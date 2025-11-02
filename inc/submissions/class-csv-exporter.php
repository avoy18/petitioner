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
        $conditional_logic = self::parse_conditional_logic($conditional_logic_raw);

        $query = self::build_model_query($conditional_logic);


        $results = AV_Petitioner_Submissions_Model::get_form_submissions($form_id, [
            'query' => $query,
            'per_page' => 999999,
        ]);

        if (empty($results['submissions'])) {
            wp_die(AV_Petitioner_Labels::get('no_submissions_to_export'));
        }

        $filename = 'petition_submissions_' . date('Y-m-d_H-i-s') . '.csv';

        self::send_download_headers($filename);

        self::stream_csv($results['submissions']);

        exit;
    }

    /**
     * Parse conditional logic from raw JSON string
     * 
     * @param string|null $raw_json Raw JSON string from POST data
     * @return array|null Parsed conditional logic or null if invalid
     */
    private static function parse_conditional_logic($raw_json)
    {
        if (empty($raw_json)) {
            return null;
        }

        $conditional_logic = json_decode($raw_json, true);

        // Validate JSON parsing
        if (json_last_error() !== JSON_ERROR_NONE) {
            av_ptr_error_log('Petitioner CSV Export: Invalid JSON in conditional_logic - ' . json_last_error_msg());
            return null;
        }

        if (!is_array($conditional_logic) || !isset($conditional_logic['conditions'])) {
            av_ptr_error_log('Petitioner CSV Export: Invalid conditional_logic structure');
            return null;
        }

        return $conditional_logic;
    }

    /**
     * Convert conditional logic to model query array
     * Supports: equals, not_equals, is_empty, is_not_empty
     * 
     * @param array|null $conditional_logic Parsed conditional logic
     * @return array Query array for model in format: [['field' => 'x', 'operator' => 'y', 'value' => 'z'], ...]
     */
    private static function build_model_query($conditional_logic)
    {
        $query = [];

        if (!$conditional_logic || empty($conditional_logic['conditions'])) {
            return $query;
        }

        $supported_operators = ['equals', 'not_equals', 'is_empty', 'is_not_empty'];
        $ignored_operators = [];

        foreach ($conditional_logic['conditions'] as $condition) {
            if (
                !isset($condition['field']) ||
                !isset($condition['operator']) ||
                empty($condition['field'])
            ) {
                continue;
            }

            $operator = $condition['operator'];
            $field = $condition['field'];
            $value = isset($condition['value']) ? $condition['value'] : null;

            // Process supported operators
            if ($operator === 'equals' && $value !== '' && $value !== null) {
                $query[] = ['field' => $field, 'operator' => 'equals', 'value' => $value];
            } else if ($operator === 'not_equals' && $value !== '' && $value !== null) {
                $query[] = ['field' => $field, 'operator' => 'not_equals', 'value' => $value];
            } else if ($operator === 'is_empty') {
                $query[] = ['field' => $field, 'operator' => 'is_empty', 'value' => null];
            } else if ($operator === 'is_not_empty') {
                $query[] = ['field' => $field, 'operator' => 'is_not_empty', 'value' => null];
            } else if (!in_array($operator, $supported_operators) && !in_array($operator, $ignored_operators)) {
                // Track ignored operators for logging
                $ignored_operators[] = $operator;
            }
        }

        // Log ignored operators for debugging
        if (!empty($ignored_operators)) {
            av_ptr_error_log('Petitioner CSV Export: Ignoring unsupported operators: ' . implode(', ', $ignored_operators));
        }

        return $query;
    }

    /**
     * Stream CSV content directly to output
     * 
     * @param array $submissions Array of submission objects
     */
    private static function stream_csv($submissions)
    {
        // Open output stream for writing
        $output = fopen('php://output', 'w');

        if ($output === false) {
            wp_die(AV_Petitioner_Labels::get('error_generic'));
        }

        // Output the column headings
        fputcsv($output, self::get_csv_headers());

        // Loop over the rows and output them as CSV
        foreach ($submissions as $row) {
            fputcsv($output, self::get_csv_row($row));
        }

        // Close the output stream
        fclose($output);
    }

    /**
     * Get CSV column headers
     * Maps database field names to human-readable labels
     * 
     * @return array Array of column header names
     */
    private static function get_csv_headers()
    {
        $field_labels = [
            'id' => 'ID',
            'form_id' => 'Form ID',
            'fname' => 'First Name',
            'lname' => 'Last Name',
            'email' => 'Email',
            'country' => 'Country',
            'salutation' => 'Salutation',
            'phone' => 'Phone',
            'street_address' => 'Street Address',
            'city' => 'City',
            'postal_code' => 'Postal Code',
            'comments' => 'Comments',
            'bcc_yourself' => 'BCC Yourself',
            'newsletter' => 'Newsletter',
            'hide_name' => 'Hide Name',
            'accept_tos' => 'Accept TOS',
            'approval_status' => 'Approval Status',
            'submitted_at' => 'Submitted At',
            'confirmation_token' => 'Confirmation Token',
        ];

        // Get labels for fields that exist in the model
        $headers = [];
        foreach (AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS as $field) {
            if (isset($field_labels[$field])) {
                $headers[] = $field_labels[$field];
            }
        }

        return $headers;
    }

    /**
     * Get CSV row data from submission object
     * Dynamically builds row based on allowed fields from model
     * 
     * @param object $submission Submission database row object
     * @return array Array of values for CSV row
     */
    private static function get_csv_row($submission)
    {
        $row = [];

        // Build row based on allowed fields from model
        foreach (AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS as $field) {
            $row[] = isset($submission->$field) ? $submission->$field : '';
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

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=' . sanitize_file_name($filename));
        header('Cache-Control: no-cache, must-revalidate');
        header('Expires: 0');
    }

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
}
