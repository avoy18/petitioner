<?php

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * A wrapper for Action Scheduler to manage background tasks.
 */
class AV_Petitioner_Queue
{
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
     * @param array|null  $args Args that would have been passed to the job. Null matches any args.
     * @param string $group The group the job is assigned to.
     * @return string|null The scheduled action ID if a scheduled action was found, or null if no matching action found.
     */
    public static function cancel_action($hook, $args = null, $group = 'petitioner')
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
     * @param array|null  $args Args that would have been passed to the job. Null matches any args.
     * @param string $group The group the job is assigned to.
     */
    public static function cancel_all_actions($hook, $args = null, $group = 'petitioner')
    {
        if (function_exists('as_unschedule_all_actions')) {
            as_unschedule_all_actions($hook, $args, $group);
        }
    }

    /**
     * Return the timestamp for the next occurrence of a scheduled action.
     *
     * @param string $hook The hook that the job will trigger.
     * @param array|null  $args Args that would have been passed to the job. Null matches any args.
     * @param string $group The group the job is assigned to.
     * @return int|bool The timestamp for the next occurrence, or false if nothing was found.
     */
    public static function next_scheduled_action($hook, $args = null, $group = 'petitioner')
    {
        if (function_exists('as_next_scheduled_action')) {
            return as_next_scheduled_action($hook, $args, $group);
        }
        return false;
    }
}
