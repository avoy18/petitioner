<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Controller for exporting submissions as CSV
 * @since 0.7.0
 */
class AV_Petitioner_CSV_Exporter
{
    /**
     * Number of submissions to process per batch
     */
    const BATCH_SIZE = 1000;

    /**
     * Main export entry point
     * Handles the CSV export request and streams the file to the browser
     */
    public static function api_admin_petitioner_export_csv()
    {
        self::check_permissions();

        $form_id = isset($_GET['form_id']) ? intval($_GET['form_id']) : false;

        if (!$form_id) {
            wp_die(AV_Petitioner_Labels::get('invalid_form_id'));
        }

        $conditional_logic_raw = isset($_POST['conditional_logic']) ? wp_unslash($_POST['conditional_logic']) : null;
        $conditional_logic = av_petitioner_parse_conditional_logic($conditional_logic_raw);

        $query = av_petitioner_build_model_query($conditional_logic);

        $settings = [
            'query'         => $query,
            'relation'      => $conditional_logic['logic'] ?? 'AND',
        ];

        $skip_unconfirmed = false;

        $total_count = AV_Petitioner_Submissions_Model::get_submission_count($form_id, $settings, $skip_unconfirmed);

        if ($total_count === 0) {
            wp_die(AV_Petitioner_Labels::get('no_submissions_to_export'));
        }

        $filename = 'petition_submissions_' . current_time('Y-m-d_H-i-s') . '.csv';

        self::send_download_headers($filename);

        self::stream_csv_chunked($form_id, $settings, $total_count);

        exit;
    }

    /**
     * Stream CSV content in chunks to avoid memory issues
     * 
     * @param int   $form_id      Form ID to export
     * @param array $settings     Query settings (query, relation)
     * @param int   $total_count  Total number of submissions
     */
    private static function stream_csv_chunked($form_id, $settings, $total_count)
    {
        $output = fopen('php://output', 'w');

        if ($output === false) {
            wp_die(AV_Petitioner_Labels::get('error_generic'));
        }

        // Add UTF-8 BOM for Excel compatibility (must be first thing)
        fprintf($output, "\xEF\xBB\xBF");

        fputcsv($output, self::get_csv_headers($form_id));

        $total_pages = ceil($total_count / self::BATCH_SIZE);

        for ($page = 1; $page <= $total_pages; $page++) {
            wp_suspend_cache_addition(true);

            $offset = ($page - 1) * self::BATCH_SIZE;

            $results = AV_Petitioner_Submissions_Model::get_form_submissions(
                $form_id,
                array_merge($settings, [
                    'offset'    => $offset,
                    'per_page'  => self::BATCH_SIZE,
                ])
            );

            if (!empty($results['submissions'])) {
                foreach ($results['submissions'] as $row) {
                    fputcsv($output, self::get_csv_row($row));
                }
            }

            unset($results);

            flush();
        }

        fclose($output);
    }

    /**
     * Get CSV column headers
     * Maps database field names to human-readable labels
     * 
     * @return array Array of column header names
     */
    private static function get_csv_headers($form_id)
    {
        $allowed_fields = AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS;

        // Get defaults
        $default_labels = AV_Petitioner_Labels::get_field_labels();

        // Get custom labels from form builder
        $custom_labels = av_petitioner_get_form_labels(
            $form_id,
            $allowed_fields
        );

        $all_labels = array_merge($default_labels, $custom_labels);

        $headers = [];

        foreach ($allowed_fields as $field) {
            // Use label if available, otherwise generate from field name
            $headers[] = $all_labels[$field] ?? ucwords(str_replace('_', ' ', $field));
        }

        return $headers;
    }

    /**
     * Get CSV row data from submission object
     * Dynamically builds row based on allowed fields from model
     * Sanitizes values to prevent CSV injection attacks
     * 
     * @param object $submission Submission database row object
     * @return array Array of values for CSV row
     */
    private static function get_csv_row($submission)
    {
        $row = [];

        foreach (AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS as $field) {
            $value = isset($submission->$field) ? $submission->$field : '';

            // Sanitize to prevent CSV injection
            $row[] = self::sanitize_csv_value($value);
        }

        return $row;
    }

    /**
     * Send CSV download headers
     * 
     * @param string $filename Name of the file to download
     */
    private static function send_download_headers($filename)
    {
        // Prevent any previous output
        if (headers_sent()) {
            wp_die(AV_Petitioner_Labels::get('error_generic'));
        }

        // Disable output buffering to allow streaming
        // Clean ALL nested buffers
        while (ob_get_level() > 0) {
            ob_end_clean();
        }

        // Suppress non-fatal errors that could corrupt CSV
        // (Still logs to error_log if WP_DEBUG is on)
        error_reporting(E_ERROR | E_PARSE);

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=' . sanitize_file_name($filename));
        header('Cache-Control: no-cache, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');

        // Prevent timeout on large exports
        set_time_limit(0);

        // Prevent WordPress from interfering with output
        remove_action('shutdown', 'wp_ob_end_flush_all', 1);
    }

    /**
     * Check user permissions and nonce
     * 
     * @return void
     */
    private static function check_permissions()
    {
        if (!current_user_can('manage_options')) {
            wp_die(AV_Petitioner_Labels::get('missing_permissions'));
        }

        // Nonce check
        $nonce_label = AV_Petitioner_Admin_Edit_UI::$ADMIN_EDIT_NONCE_LABEL;
        if (!isset($_POST['petitioner_nonce']) || !wp_verify_nonce($_POST['petitioner_nonce'], $nonce_label)) {
            wp_die(AV_Petitioner_Labels::get('invalid_nonce'));
        }
    }

    /**
     * Sanitize CSV value to prevent formula injection attacks
     * 
     * @param string $value Raw value
     * @return string Sanitized value
     */
    private static function sanitize_csv_value($value)
    {
        // Convert to string
        $value = (string) $value;

        // Check if value starts with dangerous characters
        $dangerous_chars = ['=', '+', '-', '@', "\t", "\r"];

        if (strlen($value) > 0 && in_array($value[0], $dangerous_chars)) {
            // Prefix with single quote to neutralize
            $value = "'" . $value;
        }

        return $value;
    }
}
