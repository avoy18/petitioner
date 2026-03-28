<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Class AV_Petitioner_Goal_Milestones
 *
 * Handles goal milestones for petitions. Provides normalization,
 * resolution of the active goal, and sanitization for storage.
 *
 * Milestone format: [{ value: int, count_start: int }, ...]
 * Legacy format (plain int) is auto-migrated on read.
 */
class AV_Petitioner_Goal_Milestones
{
    /**
     * Normalize a raw goal meta value into an array of milestones.
     *
     * Handles:
     * - Plain int/numeric string (legacy) → [{ value: N, count_start: 0 }]
     * - JSON string → decoded array
     * - Already-decoded array → passthrough
     *
     * @param mixed $raw_value The raw _petitioner_goal meta value.
     * @return array Array of milestone objects sorted by count_start ascending.
     */
    public static function normalize($raw_value)
    {
        // Legacy: plain integer or numeric string
        if (is_numeric($raw_value)) {
            return [['value' => (int) $raw_value, 'count_start' => 0]];
        }

        // Already an array (e.g. from PHP unserialization)
        if (is_array($raw_value)) {
            return self::sort_milestones(self::validate_milestones($raw_value));
        }

        // JSON string
        if (is_string($raw_value) && !empty($raw_value)) {
            $decoded = json_decode($raw_value, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return self::sort_milestones(self::validate_milestones($decoded));
            }
        }

        // Fallback
        return [['value' => 0, 'count_start' => 0]];
    }

    /**
     * Get the currently active goal for a given petition based on submission count.
     *
     * Finds the milestone with the highest count_start that the current
     * submission count has reached or exceeded. Returns its value.
     *
     * @param int $form_id The petition post ID.
     * @return int The active goal value.
     */
    public static function get_active_goal($form_id)
    {
        $raw        = get_post_meta($form_id, '_petitioner_goal', true);
        $milestones = self::normalize($raw);
        $count      = AV_Petitioner_Submissions_Model::get_submission_count($form_id);

        return self::resolve_active_goal($milestones, $count);
    }

    /**
     * Resolve which milestone is active given milestones and a count.
     *
     * @param array $milestones Normalized milestones array.
     * @param int   $count      Current submission count.
     * @return int The active goal value.
     */
    public static function resolve_active_goal($milestones, $count)
    {
        if (empty($milestones)) {
            return 0;
        }

        // Ensure milestones are strictly sorted by count_start ascending
        // since this is a public method and we rely on the sort order below.
        $milestones = self::sort_milestones($milestones);

        // Start with a zero default so that if count hasn't reached
        // any milestone's count_start, we return 0.
        $active = ['value' => 0, 'count_start' => 0];

        foreach ($milestones as $milestone) {
            if ($count >= $milestone['count_start']) {
                $active = $milestone;
            } else {
                break; // sorted ascending, no need to continue
            }
        }

        return (int) $active['value'];
    }

    /**
     * Sanitize a raw JSON payload of milestones for safe storage.
     *
     * @param string $raw JSON-encoded milestones string from form POST.
     * @return string Sanitized JSON string ready for update_post_meta.
     */
    public static function sanitize_json($raw)
    {
        // If it's just a number (legacy form field), wrap it
        if (is_numeric($raw)) {
            $milestones = [['value' => (int) $raw, 'count_start' => 0]];
            return wp_json_encode($milestones);
        }

        $decoded = json_decode(wp_unslash($raw), true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            return wp_json_encode([['value' => 0, 'count_start' => 0]]);
        }

        $sanitized = self::validate_milestones($decoded);
        $sorted    = self::sort_milestones($sanitized);

        return wp_json_encode($sorted);
    }

    /**
     * Ensure each milestone has valid value and count_start as integers.
     *
     * @param array $milestones Raw milestones array.
     * @return array Validated milestones array.
     */
    private static function validate_milestones($milestones)
    {
        $validated = [];

        foreach ($milestones as $milestone) {
            if (!is_array($milestone)) {
                continue;
            }

            $validated[] = [
                'value'       => isset($milestone['value']) ? absint($milestone['value']) : 0,
                'count_start' => isset($milestone['count_start']) ? absint($milestone['count_start']) : 0,
            ];
        }

        // Ensure at least one milestone exists
        if (empty($validated)) {
            $validated[] = ['value' => 0, 'count_start' => 0];
        }

        return $validated;
    }

    /**
     * Sort milestones by count_start ascending.
     *
     * @param array $milestones Milestones array.
     * @return array Sorted milestones.
     */
    private static function sort_milestones($milestones)
    {
        usort($milestones, function ($a, $b) {
            return $a['count_start'] - $b['count_start'];
        });

        return $milestones;
    }
}
