<?php

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * A wrapper for Action Scheduler to manage background tasks.
 * 
 * @since 0.8.3
 * 
 * @note Pro tip: you can view your current queue here: `/wp-admin/admin.php?page=action-scheduler`
 */
class AV_Petitioner_Queue
{
    /**
     * Initializes the queue wrapper.
     */
    public static function init()
    {
        // Hide the "Scheduled Actions" menu link so it doesn't clutter the Tools menu
        // Users can still access it directly via /wp-admin/tools.php?page=action-scheduler
        add_action('admin_menu', [self::class, 'hide_admin_menu'], 999);
    }

    /**
     * Hides the Action Scheduler menu item.
     */
    public static function hide_admin_menu()
    {
        /**
         * Filter whether to hide the Action Scheduler menu item.
         *
         * @param bool $hide Whether to hide the menu item. Default true.
         */
        $should_hide = apply_filters('av_petitioner_hide_action_scheduler', true);

        if ($should_hide) {
            // We only want to hide it if WooCommerce isn't active (WooCommerce moves it anyway)
            remove_submenu_page('tools.php', 'action-scheduler');
        }
    }
    /**
     * Enqueue an action to run one time, as soon as possible.
     *
     * @param string $hook The hook to trigger.
     * @param array  $args Arguments to pass when the hook triggers.
     * @param string $group The group to assign this job to.
     * @return int|bool The action ID, or false if Action Scheduler is not available.
     */
    public static function schedule_action($hook, $args = [], $group = 'petitioner')
    {
        if (function_exists('as_enqueue_async_action')) {
            return as_enqueue_async_action($hook, $args, $group);
        }
        return false;
    }

    /**
     * Schedule an action to run one time at a specific timestamp.
     *
     * @param int    $timestamp When the job will run.
     * @param string $hook The hook to trigger.
     * @param array  $args Arguments to pass when the hook triggers.
     * @param string $group The group to assign this job to.
     * @return int|bool The action ID, or false if Action Scheduler is not available.
     */
    public static function schedule_single_action($timestamp, $hook, $args = [], $group = 'petitioner')
    {
        if (function_exists('as_schedule_single_action')) {
            return as_schedule_single_action($timestamp, $hook, $args, $group);
        }
        return false;
    }

    /**
     * Schedule a recurring action.
     *
     * @param int    $timestamp When the first instance of the job will run.
     * @param int    $interval_in_seconds How long to wait between runs.
     * @param string $hook The hook to trigger.
     * @param array  $args Arguments to pass when the hook triggers.
     * @param string $group The group to assign this job to.
     * @return int|bool The action ID, or false if Action Scheduler is not available.
     */
    public static function schedule_recurring_action($timestamp, $interval_in_seconds, $hook, $args = [], $group = 'petitioner')
    {
        if (function_exists('as_schedule_recurring_action')) {
            return as_schedule_recurring_action($timestamp, $interval_in_seconds, $hook, $args, $group);
        }
        return false;
    }

    /**
     * Cancel the next occurrence of a scheduled action.
     *
     * @param string $hook The hook that the job will trigger.
     * @param array  $args Args that would have been passed to the job.
     * @param string $group The group the job is assigned to.
     * @return string|null The scheduled action ID if a scheduled action was found, or null if no matching action found.
     */
    public static function cancel_action($hook, $args = [], $group = 'petitioner')
    {
        if (function_exists('as_unschedule_action')) {
            return as_unschedule_action($hook, $args, $group);
        }
        return null;
    }

    /**
     * Cancel all occurrences of a scheduled action.
     *
     * @param string $hook The hook that the job will trigger.
     * @param array  $args Args that would have been passed to the job.
     * @param string $group The group the job is assigned to.
     */
    public static function cancel_all_actions($hook, $args = [], $group = 'petitioner')
    {
        if (function_exists('as_unschedule_all_actions')) {
            as_unschedule_all_actions($hook, $args, $group);
        }
    }

    /**
     * Retrieve the recent Action Scheduler logs for a specific hook and optional search query.
     *
     * @param string $hook     The hook name to search for.
     * @param string $search   An optional search string to filter logs by (e.g. JSON substring in args).
     * @param int    $page     The current page of logs.
     * @param int    $per_page How many logs to retrieve per page.
     * @return array Array containing the 'status' and the 'logs' array.
     */
    public static function get_logs_by_hook($hook, $search = '', $page = 1, $per_page = 10)
    {
        if (!class_exists('\ActionScheduler')) {
            return ['status' => 'disabled', 'logs' => []];
        }

        $page     = max(1, (int) $page);
        $per_page = max(1, (int) $per_page);
        $offset   = ($page - 1) * $per_page;

        $query = [
            'hook'     => $hook,
            'search'   => $search,
            'per_page' => $per_page,
            'offset'   => $offset,
            'orderby'  => 'date',
            'order'    => 'DESC',
        ];

        $action_ids = \ActionScheduler::store()->query_actions($query);
        $results = [];

        foreach ($action_ids as $action_id) {
            $action = \ActionScheduler::store()->fetch_action($action_id);
            if ($action instanceof \ActionScheduler_NullAction) {
                continue;
            }

            $status = \ActionScheduler::store()->get_status($action_id);
            $logs = \ActionScheduler::logger()->get_logs($action_id);

            $log_messages = array_map(function ($log) {
                return [
                    'message' => $log->get_message(),
                    'date'    => $log->get_date()->format('Y-m-d H:i:s')
                ];
            }, $logs);

            $args = $action->get_args();

            $schedule = $action->get_schedule();
            $scheduled_date = is_object($schedule) && method_exists($schedule, 'get_date') ? $schedule->get_date() : null;

            $action_date = $scheduled_date ? $scheduled_date->format('Y-m-d H:i:s') : '';

            if (empty($action_date) && !empty($log_messages)) {
                $action_date = end($log_messages)['date'];
            }

            $results[] = [
                'id'       => $action_id,
                'status'   => $status,
                'date'     => $action_date,
                'logs'     => $log_messages,
                'payload'  => $args
            ];
        }

        return ['status' => 'enabled', 'logs' => $results];
    }

    /**
     * Reschedules an identical action for a failed job.
     *
     * @param int $action_id The ID of the action to retry.
     * @return int|bool The new action ID or false if it failed.
     */
    public static function retry_action($action_id)
    {
        if (!class_exists('\ActionScheduler')) {
            return false;
        }

        $action = \ActionScheduler::store()->fetch_action($action_id);
        if (!$action instanceof \ActionScheduler_NullAction) {
            $hook  = $action->get_hook();
            $args  = $action->get_args();
            $group = $action->get_group();

            // Re-enqueue the identical task as a brand new action
            return self::schedule_action($hook, $args, $group);
        }

        return false;
    }

    /**
     * Return the timestamp for the next occurrence of a scheduled action.
     *
     * @param string $hook The hook that the job will trigger.
     * @param array  $args Args that would have been passed to the job.
     * @param string $group The group the job is assigned to.
     * @return int|bool The timestamp for the next occurrence, or false if nothing was found.
     */
    public static function next_scheduled_action($hook, $args = [], $group = 'petitioner')
    {
        if (function_exists('as_next_scheduled_action')) {
            return as_next_scheduled_action($hook, $args, $group);
        }
        return false;
    }
}
