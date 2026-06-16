<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Dynamic Bulk CSV Importer for Petitioner
 * 
 * This class provides a flexible utility to batch import or remove submissions via a CSV file.
 * It dynamically maps CSV headers to system field keys by matching them against form labels 
 * and a predefined list of fallback synonyms, with support for manual overrides.
 * 
 * Usage:
 * ```php
 * $importer = new AV_Petitioner_Submissions_Importer([
 *     'form_id'            => 123,
 *     'csv_url'            => '/wp-content/uploads/2026-06-15/01/to-import.csv', 
 *     'action'             => 'import', // 'import' or 'remove'
 *     'trigger_finalized'  => false,
 *     'approve_submission' => true,
 *     'field_overrides'    => ['Email address' => 'email', 'Tel' => 'phone'] // Map CSV headers to Petitioner's field ids
 * ]);
 * 
 * $result = $importer->run();
 * ```
 * 
 * Note: for local testing, use absolute paths like `/Users/yourusername/path/to/your/csv/test-import.csv`
 * 
 * You will also need to change sslverify to false via:
 * 
 * `add_filter('av_petitioner_submissions_importer_sslverify', '__return_false');`
 * 
 */
class AV_Petitioner_Submissions_Importer
{
    /**
     * The ID of the form.
     * @var int $form_id
     */
    private $form_id;

    /**
     * The URL of the CSV file.
     * @var string $csv_url
     */
    private $csv_url;

    /**
     * The action to perform.
     * @var string $action
     */
    private $action;

    /**
     * Whether to trigger the finalized action.
     * @var bool $trigger_finalized
     */
    private $trigger_finalized;

    /**
     * Whether to approve the submission.
     * @var bool $approve_submission
     */
    private $approve_submission;

    /**
     * The field overrides.
     * 
     * @var array $field_overrides
     * 
     * @example ['Email address' => 'email', 'Tel' => 'phone']
     */
    private $field_overrides;

    public function __construct($args = [])
    {
        $this->form_id            = isset($args['form_id']) ? absint($args['form_id']) : 0;
        $this->csv_url            = isset($args['csv_url']) ? esc_url_raw($args['csv_url']) : '';
        $this->action             = isset($args['action']) && $args['action'] === 'remove' ? 'remove' : 'import';
        $this->trigger_finalized  = isset($args['trigger_finalized']) ? filter_var($args['trigger_finalized'], FILTER_VALIDATE_BOOLEAN) : false;
        $this->approve_submission = isset($args['approve_submission']) ? filter_var($args['approve_submission'], FILTER_VALIDATE_BOOLEAN) : true;
        $this->field_overrides    = isset($args['field_overrides']) && is_array($args['field_overrides']) ? $args['field_overrides'] : [];
    }

    /**
     * Executes the import or removal process.
     * 
     * @return array Array containing 'success' boolean, 'message', 'imported' count, and 'skipped' count.
     */
    public function run()
    {
        if (!$this->form_id || empty($this->csv_url)) {
            return $this->error_result(__('Please provide both form_id and csv_url.', 'petitioner'));
        }

        if (!class_exists('AV_Petitioner_Submissions_Model')) {
            return $this->error_result(__('Petitioner plugin is not active.', 'petitioner'));
        }

        $csv_content = $this->fetch_csv($this->csv_url);

        if (!$csv_content) {
            return $this->error_result(__('Failed to download or read CSV from the provided URL.', 'petitioner'));
        }

        // Strip UTF-8 BOM if present
        $csv_content = preg_replace('/^\xEF\xBB\xBF/', '', $csv_content);

        $result = $this->process_csv($csv_content);

        if ($this->action === 'remove') {
            /* translators: 1: number of records removed, 2: number of records skipped */
            $message = sprintf(
                __('Removal completed. %1$d records removed successfully. %2$d records skipped.', 'petitioner'),
                $result['imported'],
                $result['skipped']
            );
        } else {
            /* translators: 1: number of records imported, 2: number of records skipped */
            $message = sprintf(
                __('Import completed. %1$d records imported successfully. %2$d records skipped.', 'petitioner'),
                $result['imported'],
                $result['skipped']
            );
        }

        return [
            'success'  => true,
            'message'  => $message,
            'imported' => $result['imported'],
            'skipped'  => $result['skipped']
        ];
    }

    /**
     * Summary of error_result
     * @param mixed $message
     * @return array{imported: int, message: mixed, skipped: int, success: bool}
     */
    private function error_result($message)
    {
        return [
            'success'  => false,
            'message'  => $message,
            'imported' => 0,
            'skipped'  => 0
        ];
    }

    /**
     * Summary of fetch_csv
     * @param mixed $url_or_path
     * @return false|string
     */
    private function fetch_csv($url_or_path)
    {
        // Handle HTTP/HTTPS URLs
        if (strpos($url_or_path, 'http://') === 0 || strpos($url_or_path, 'https://') === 0) {

            /**
             * Whether to verify SSL certificates for external CSV files.
             * Default is true for maximum security.
             * @var bool $sslverify
             */
            $sslverify = apply_filters('av_petitioner_submissions_importer_sslverify', true);

            /**
             * Timeout for external CSV file download in seconds.
             * @var int $timeout
             */
            $timeout = apply_filters('av_petitioner_submissions_importer_timeout', 15);

            $response = wp_safe_remote_get($url_or_path, ['sslverify' => $sslverify, 'timeout' => $timeout]);

            if (is_wp_error($response)) {
                return false;
            }

            $body = wp_remote_retrieve_body($response);

            return empty($body) ? false : $body;
        }

        // Handle local paths (prevent path traversal / LFI)
        $local_path = $url_or_path;

        if (!file_exists($local_path)) {
            $local_path = ABSPATH . ltrim($url_or_path, '/');
        }

        $real_path = realpath($local_path);

        // Security Check: Ensure the file exists, is a file (not a directory), and is within the WordPress installation directory
        if ($real_path && is_file($real_path) && strpos($real_path, ABSPATH) === 0) {
            return file_get_contents($real_path);
        }

        return false;
    }

    /**
     * Get the field key for a given header.
     * 
     * @param string $header The header name from the CSV file.
     * @param array $form_labels The labels of the form fields.
     * @return string|null The field key or null if not found.
     */
    private function get_field_key($header, $form_labels)
    {
        // Check explicit overrides
        if (isset($this->field_overrides[$header])) {
            return $this->field_overrides[$header];
        }

        $header_lower = strtolower(trim($header));

        // Check if it strictly matches an allowed system field
        if (in_array($header, AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS)) {
            return $header;
        }

        // Match against the form's human-readable labels
        foreach ($form_labels as $key => $label) {
            if (strtolower(trim($label)) === $header_lower) {
                return $key;
            }
        }

        return null;
    }

    /**
     * Map CSV headers to field keys.
     * 
     * @param array $headers The headers from the CSV file.
     * @return array The mapped headers.
     */
    private function map_headers($headers)
    {
        $form_labels = av_petitioner_get_form_labels($this->form_id, AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS);
        $mapped = [];

        foreach ($headers as $index => $header) {
            $mapped[$index] = $this->get_field_key($header, $form_labels);
        }

        return $mapped;
    }

    /**
     * Process the CSV content.
     * 
     * @param string $csv_content The CSV content.
     * @return array The result of the import/removal process.
     */
    private function process_csv($csv_content)
    {
        $lines = explode("\n", trim($csv_content));
        $headers = str_getcsv(array_shift($lines));

        $mapped_headers = $this->map_headers($headers);

        $imported = 0;
        $skipped = 0;

        foreach ($lines as $line) {
            if (empty(trim($line))) continue;

            $row = str_getcsv($line);

            if (count($row) !== count($headers)) continue;

            $record = [];

            foreach ($row as $index => $value) {
                $key = $mapped_headers[$index];
                if ($key !== null) {
                    $record[$key] = $value;
                }
            }

            if ($this->action === 'remove') {
                if ($this->remove_record($record)) {
                    $imported++;
                } else {
                    $skipped++;
                }
            } else {
                if ($this->insert_record($record)) {
                    $imported++;
                } else {
                    $skipped++;
                }
            }
        }

        return [
            'imported' => $imported,
            'skipped'  => $skipped
        ];
    }

    /**
     * Insert a new record.
     * 
     * @param array $record The record to insert.
     * @return bool True if the record was inserted successfully, false otherwise.
     */
    private function insert_record($record)
    {
        $email = isset($record['email']) ? sanitize_email($record['email']) : '';
        if (empty($email)) {
            return false;
        }

        if (AV_Petitioner_Submissions_Model::check_duplicate_email($email, $this->form_id)) {
            return false;
        }

        $data = [
            'form_id'           => $this->form_id,
            'fname'             => sanitize_text_field($record['fname'] ?? ''),
            'lname'             => sanitize_text_field($record['lname'] ?? ''),
            'email'             => $email,
            'date_of_birth'     => sanitize_text_field($record['date_of_birth'] ?? ''),
            'country'           => sanitize_text_field($record['country'] ?? ''),
            'salutation'        => sanitize_text_field($record['salutation'] ?? ''),
            'phone'             => sanitize_text_field($record['phone'] ?? ''),
            'street_address'    => sanitize_text_field($record['street_address'] ?? ''),
            'city'              => sanitize_text_field($record['city'] ?? ''),
            'postal_code'       => sanitize_text_field($record['postal_code'] ?? ''),
            'comments'          => sanitize_textarea_field($record['comments'] ?? ''),
            'bcc_yourself'      => !empty($record['bcc_yourself']) ? 1 : 0,
            'newsletter'        => !empty($record['newsletter']) ? 1 : 0,
            'hide_name'         => !empty($record['hide_name']) ? 1 : 0,
            'is_featured'       => !empty($record['is_featured']) ? 1 : 0,
            'approval_status'   => $this->approve_submission ? 'Confirmed' : 'Pending',
            'submitted_at'      => !empty($record['submitted_at']) ? sanitize_text_field($record['submitted_at']) : current_time('mysql'),
        ];

        if (empty($data['date_of_birth'])) {
            unset($data['date_of_birth']);
        }

        $submission_id = AV_Petitioner_Submissions_Model::create_submission($data);

        if ($submission_id) {
            do_action('petitioner_after_submission', $submission_id, $this->form_id);

            if ($this->trigger_finalized) {
                if (class_exists('AV_Petitioner_Submissions_Controller') && method_exists('AV_Petitioner_Submissions_Controller', 'trigger_finalized_hook')) {
                    AV_Petitioner_Submissions_Controller::trigger_finalized_hook($submission_id);
                }
            }

            return true;
        }

        return false;
    }

    /**
     * Remove a record.
     * 
     * @param array $record The record to remove.
     * @return bool True if the record was removed successfully, false otherwise.
     */
    private function remove_record($record)
    {
        $email = isset($record['email']) ? sanitize_email($record['email']) : '';
        if (empty($email)) {
            return false;
        }

        global $wpdb;
        $table = $wpdb->prefix . 'av_petitioner_submissions';

        $deleted = $wpdb->delete($table, [
            'email'   => $email,
            'form_id' => $this->form_id
        ]);

        return $deleted !== false && $deleted > 0;
    }
}
