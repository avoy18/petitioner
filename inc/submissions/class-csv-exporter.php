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
            'relation'      => is_array($conditional_logic['logic']) ? $conditional_logic['logic'] : 'AND',
        ];

        $skip_unconfirmed = false;

        $total_count = AV_Petitioner_Submissions_Model::get_submission_count($form_id, $settings, $skip_unconfirmed);

        if ($total_count === 0) {
            wp_die(AV_Petitioner_Labels::get('no_submissions_to_export'));
        }

        $csv_column_config_raw = isset($_POST['csv_column_config']) ? wp_unslash($_POST['csv_column_config']) : null;
        $resolved_config = self::resolve_csv_column_config($form_id, $csv_column_config_raw);

        $filename = 'petition_submissions_' . current_time('Y-m-d_H-i-s') . '.csv';

        self::send_download_headers($filename);

        self::stream_csv_chunked($form_id, $settings, $total_count, $resolved_config);

        exit;
    }

    /**
     * Get CSV example entry point
     * Handles the CSV example request and returns the headings and rows of the first 10 submissions
     * 
     * @return void
     */
    public static function api_admin_petitioner_get_csv_example()
    {
        self::check_permissions(true);

        $form_id = isset($_POST['form_id']) ? intval($_POST['form_id']) : false;

        if (!$form_id) {
            wp_send_json_error([
                'message' => AV_Petitioner_Labels::get('invalid_form_id'),
            ]);
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
        $csv_column_config_raw = isset($_POST['csv_column_config']) ? wp_unslash($_POST['csv_column_config']) : null;
        $resolved_config = self::resolve_csv_column_config($form_id, $csv_column_config_raw);

        $rows = [];
        $headings = [];

        if ($total_count != 0) {
            $result = AV_Petitioner_Submissions_Model::get_form_submissions(
                $form_id,
                array_merge($settings, [
                    'offset'    => 0,
                    'per_page'  => 10,
                ])
            );

            if (!empty($result['submissions'])) {

                $headings = self::get_csv_headers($form_id, $resolved_config);

                $rows = array_map(function ($submission) use ($resolved_config) {
                    return self::get_csv_row($submission, $resolved_config);
                }, $result['submissions']);
            }
        }

        $filename = 'petition_submissions_' . current_time('Y-m-d_H-i-s') . '.csv';

        wp_send_json_success([
            'headings'      => $headings,
            'rows'          => $rows,
            'filename'      => $filename,
            'total_count'   => $total_count,
        ]);
    }

    /**
     * Stream CSV content in chunks to avoid memory issues
     * 
     * @param int   $form_id      Form ID to export
     * @param array $settings     Query settings (query, relation)
     * @param int   $total_count  Total number of submissions
     * @param array{
     *   visible_columns?: array<int, string>,
     *   labels?: array<string, string>,
     *   mappings?: array<string, array<int, array{raw: string, mapped: string}>>
     * }|null $resolved_config Resolved CSV config for headers/rows.
     */
    private static function stream_csv_chunked($form_id, $settings, $total_count, $resolved_config = null)
    {
        $output = fopen('php://output', 'w');

        if ($output === false) {
            wp_die(AV_Petitioner_Labels::get('error_generic'));
        }

        // Add UTF-8 BOM for Excel compatibility (must be first thing)
        fprintf($output, "\xEF\xBB\xBF");

        fputcsv($output, self::get_csv_headers($form_id, $resolved_config));

        $total_pages = ceil($total_count / self::BATCH_SIZE);

        wp_suspend_cache_addition(true);

        for ($page = 1; $page <= $total_pages; $page++) {
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
                    fputcsv($output, self::get_csv_row($row, $resolved_config));
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
     * Ensures all headers are unique and not empty
     * 
     * @param int $form_id Petition ID.
     * @param array{
     *   visible_columns?: array<int, string>,
     *   labels?: array<string, string>,
     *   mappings?: array<string, array<int, array{raw: string, mapped: string}>>
     * }|null $resolved_config Resolved CSV config, or null to use legacy headers.
     * @return array<int, string> Array of column header names.
     */
    public static function get_csv_headers($form_id, $resolved_config = null)
    {
        if (is_array($resolved_config) && isset($resolved_config['visible_columns']) && isset($resolved_config['labels'])) {
            $headers = array_map(static function ($field_id) use ($resolved_config) {
                $label = $resolved_config['labels'][$field_id] ?? ucwords(str_replace('_', ' ', $field_id));
                $label = trim((string) $label);
                return $label !== '' ? $label : ucwords(str_replace('_', ' ', $field_id));
            }, $resolved_config['visible_columns']);

            $header_counts = [];
            foreach ($headers as $i => $header) {
                if (!isset($header_counts[$header])) {
                    $header_counts[$header] = 0;
                    continue;
                }
                $header_counts[$header]++;
                $headers[$i] = $header . ' (' . $header_counts[$header] . ')';
            }

            return apply_filters('av_petitioner_get_csv_column_headers', $headers, $form_id);
        }

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
        $used_headers = []; // Track used headers to prevent duplicates

        foreach ($allowed_fields as $field) {
            // Skip custom_properties - handled separately via filter
            if ($field === 'custom_properties') {
                continue;
            }

            // Get label with fallback to field name
            $label = $all_labels[$field] ?? ucwords(str_replace('_', ' ', $field));

            // Ensure label is not empty
            $label = trim($label);
            if (empty($label)) {
                $label = ucwords(str_replace('_', ' ', $field));
            }

            // Make label unique if duplicate exists
            $original_label = $label;
            $counter = 1;
            while (in_array($label, $used_headers)) {
                $label = $original_label . ' (' . $counter . ')';
                $counter++;
            }

            $used_headers[] = $label;
            $headers[] = $label;
        }

        /**
         * Filter the CSV column headers
         * 
         * @param array $headers Array of column header names
         * @param int $form_id Form ID
         * @return array Array of column header names
         */
        $headers = apply_filters('av_petitioner_get_csv_column_headers', $headers, $form_id);

        return $headers;
    }

    /**
     * Get CSV row data from submission object
     * Dynamically builds row based on allowed fields from model
     * Sanitizes values to prevent CSV injection attacks
     * 
     * @param object $submission Submission database row object.
     * @param array{
     *   visible_columns?: array<int, string>,
     *   labels?: array<string, string>,
     *   mappings?: array<string, array<int, array{raw: string, mapped: string}>>
     * }|null $resolved_config Resolved CSV config, or null to use legacy row building.
     * @return array<int, string> Array of values for CSV row.
     */
    public static function get_csv_row($submission, $resolved_config = null)
    {
        if (is_array($resolved_config) && isset($resolved_config['visible_columns'])) {
            $row = [];

            foreach ($resolved_config['visible_columns'] as $field) {
                $value = isset($submission->$field) ? $submission->$field : '';
                $mapped = self::map_csv_value($field, $value, $resolved_config);
                $row[] = self::sanitize_csv_value($mapped);
            }

            return apply_filters('av_petitioner_get_csv_row', $row, $submission, $resolved_config);
        }

        $row = [];

        foreach (AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS as $field) {
            // Skip custom_properties - handled separately via filter
            if ($field === 'custom_properties') {
                continue;
            }

            $value = isset($submission->$field) ? $submission->$field : '';

            // Sanitize to prevent CSV injection
            $row[] = self::sanitize_csv_value($value);
        }

        /**
         * Filter the CSV row data
         * @param array $row Array of values for CSV row
         * @param object $submission Submission database row object
         * @return array Array of values for CSV row
         */
        $row = apply_filters('av_petitioner_get_csv_row', $row, $submission, $resolved_config);

        return $row;
    }

    /**
     * Parse and resolve CSV config from request JSON.
     *
     * @param int         $form_id Petition ID.
     * @param string|null $json    Raw request JSON.
     * @return array{
     *   visible_columns: array<int, string>,
     *   labels: array<string, string>,
     *   mappings: array<string, array<int, array{raw: string, mapped: string}>>
     * }|null Resolved CSV config, or null for invalid/missing input.
     */
    private static function resolve_csv_column_config($form_id, $json)
    {
        if (!is_string($json) || $json === '') {
            return null;
        }

        $payload = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($payload)) {
            return null;
        }

        return AV_Petitioner_Column_Config::resolve($form_id, $payload);
    }

    /**
     * Apply first matching mapping for a field.
     *
     * @param string $field_id Field key.
     * @param mixed  $value    Raw submission value.
     * @param array{
     *   visible_columns?: array<int, string>,
     *   labels?: array<string, string>,
     *   mappings?: array<string, array<int, array{raw: string, mapped: string}>>
     * } $resolved_config Resolved CSV config.
     * @return string
     */
    private static function map_csv_value($field_id, $value, $resolved_config)
    {
        $value_as_string = (string) $value;

        if (empty($resolved_config['mappings'][$field_id]) || !is_array($resolved_config['mappings'][$field_id])) {
            return $value_as_string;
        }

        foreach ($resolved_config['mappings'][$field_id] as $mapping) {
            if (!is_array($mapping) || !array_key_exists('raw', $mapping) || !array_key_exists('mapped', $mapping)) {
                continue;
            }

            if ((string) $mapping['raw'] === $value_as_string) {
                return (string) $mapping['mapped'];
            }
        }

        return $value_as_string;
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
     * @param bool $use_json Whether to use JSON response
     * @return void
     */
    private static function check_permissions($use_json = false)
    {
        if (!current_user_can('manage_options')) {

            if ($use_json) {
                wp_send_json_error([
                    'message' => AV_Petitioner_Labels::get('missing_permissions'),
                ]);
            }

            wp_die(AV_Petitioner_Labels::get('missing_permissions'));
        }

        // Nonce check
        $nonce_label = AV_Petitioner_Admin_Edit_UI::$ADMIN_EDIT_NONCE_LABEL;
        if (!isset($_POST['petitioner_nonce']) || !wp_verify_nonce($_POST['petitioner_nonce'], $nonce_label)) {

            if ($use_json) {
                wp_send_json_error([
                    'message' => AV_Petitioner_Labels::get('invalid_nonce'),
                ]);
            }

            wp_die(AV_Petitioner_Labels::get('invalid_nonce'));
        }
    }

    /**
     * Sanitize CSV value to prevent formula injection attacks
     * Trims leading whitespace and checks for dangerous characters
     * that could be interpreted as formulas by spreadsheet applications
     * 
     * @param string $value Raw value
     * @return string Sanitized value
     */
    public static function sanitize_csv_value($value)
    {
        // Convert to string and trim leading whitespace
        // (attackers may use spaces to hide dangerous characters)
        $value = ltrim((string) $value);

        // Expanded list of dangerous characters that can trigger formula injection
        // = : Formula start
        // + : Addition formula
        // - : Subtraction formula (also hyphen for command line)
        // @ : Excel formula
        // \t : Tab (can be used in some injection contexts)
        // \r : Carriage return (can break parsing)
        // \n : Newline (can break parsing)
        // | : Pipe (command execution in some contexts)
        $dangerous_chars = ['=', '+', '-', '@', "\t", "\r", "\n", '|'];

        if (strlen($value) > 0 && in_array($value[0], $dangerous_chars, true)) {
            // Prefix with single quote to neutralize
            // This tells spreadsheet apps to treat it as text, not formula
            $value = "'" . $value;
        }

        return $value;
    }
}
