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
        AV_Petitioner_Submissions_Controller::check_admin_request(AV_Petitioner_Admin_Edit_UI::$ADMIN_EDIT_NONCE_LABEL);
        
        $form_id = isset($_GET['form_id']) ? intval($_GET['form_id']) : false;
        
        if (!$form_id) {
            wp_die(AV_Petitioner_Labels::get('invalid_form_id'));
        }

        // Parse conditional logic from request
        $conditional_logic_raw = isset($_POST['conditional_logic']) ? wp_unslash($_POST['conditional_logic']) : null;
        $conditional_logic = self::parse_conditional_logic($conditional_logic_raw);

        // Build query for model
        $query = self::build_model_query($conditional_logic);

        // Fetch submissions with filters
        $results = AV_Petitioner_Submissions_Model::get_form_submissions($form_id, [
            'query' => $query,
            'per_page' => 999999, // Get all matching results
        ]);

        if (empty($results['submissions'])) {
            wp_die(AV_Petitioner_Labels::get('no_submissions_to_export'));
        }

        // Generate filename with timestamp
        $filename = 'petition_submissions_' . date('Y-m-d_H-i-s') . '.csv';
        
        // Send download headers
        self::send_download_headers($filename);

        // Stream CSV to output
        self::stream_csv($results['submissions']);

        // Prevent any further output
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

        // Validate structure
        if (!is_array($conditional_logic) || !isset($conditional_logic['conditions'])) {
            av_ptr_error_log('Petitioner CSV Export: Invalid conditional_logic structure');
            return null;
        }

        return $conditional_logic;
    }

    /**
     * Convert conditional logic to model query array
     * NOTE: Model currently only supports 'equals' operator with AND logic
     * Other operators (contains, starts_with, etc.) are ignored
     * 
     * @param array|null $conditional_logic Parsed conditional logic
     * @return array Query array for model
     */
    private static function build_model_query($conditional_logic)
    {
        $query = [];

        if (!$conditional_logic || empty($conditional_logic['conditions'])) {
            return $query;
        }

        $ignored_operators = [];

        foreach ($conditional_logic['conditions'] as $condition) {
            // Validate condition structure
            if (
                !isset($condition['field']) ||
                !isset($condition['operator']) ||
                !isset($condition['value'])
            ) {
                continue;
            }

            // Only process conditions with the 'equals' operator
            if ($condition['operator'] === 'equals' && !empty($condition['field']) && $condition['value'] !== '') {
                $query[$condition['field']] = $condition['value'];
            } else if ($condition['operator'] !== 'equals' && !in_array($condition['operator'], $ignored_operators)) {
                // Track ignored operators for logging
                $ignored_operators[] = $condition['operator'];
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
}
