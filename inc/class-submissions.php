<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class AV_Petitioner_Submissions
{
    public $form_id = null;
    public function __construct($id  = null)
    {
        $this->form_id = $id;
    }

    public static function create_db_table()
    {
        global $wpdb;

        $sql = 'CREATE TABLE ' . $wpdb->prefix . 'av_petitioner_submissions';
        $sql .= " (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            form_id mediumint(9) NOT NULL,
            fname varchar(255) NOT NULL,
            lname varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            country varchar(255) NOT NULL,
            salutation varchar(255),
            bcc_yourself tinyint(1) DEFAULT 0,
            newsletter tinyint(1) DEFAULT 0,
            hide_name tinyint(1) DEFAULT 0,
            accept_tos tinyint(1) DEFAULT 0,
            approval_status varchar(255) DEFAULT 'Confirmed',
            submitted_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            confirmation_token varchar(64) DEFAULT NULL,
            PRIMARY KEY  (id),
            KEY form_id (form_id)
        )";
        $sql .= ' ' . $wpdb->get_charset_collate() . ';';

        // Include the upgrade file for dbDelta
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // Create the table
        dbDelta($sql);
    }

    public static function get_form_submissions($form_id, $per_page, $offset)
    {
        global $wpdb;

        // Get the submissions for the specified form_id with LIMIT and OFFSET for pagination
        $submissions = $wpdb->get_results(
            $wpdb->prepare(
                'SELECT * FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE form_id = %d LIMIT %d OFFSET %d',
                $form_id,
                $per_page,
                $offset
            )
        );

        // Get the total count of submissions for the form
        $total_submissions = $wpdb->get_var(
            $wpdb->prepare(
                'SELECT COUNT(*) FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE form_id = %d',
                $form_id
            )
        );

        return array(
            'submissions'   => $submissions,
            'total'         => $total_submissions,
        );
    }

    /**
     * Update a single submission by ID.
     *
     * @param int $id Submission ID.
     * @param array $fields Associative array of fields to update (column => value).
     * @return int|false Number of rows updated or false on failure.
     */
    public static function update_submission($id, array $fields)
    {
        global $wpdb;

        $id = absint($id);
        if (!$id || empty($fields)) {
            return false;
        }

        $table = $wpdb->prefix . 'av_petitioner_submissions';

        return $wpdb->update(
            $table,
            $fields,           // what to update
            ['id' => $id],     // where clause
            null,              // formats (optional)
            ['%d']             // id is always int
        );
    }

    public static function get_submission_by_id($submission_id)
    {
        global $wpdb;

        // Get a single submission by its ID
        $submission = $wpdb->get_row(
            $wpdb->prepare(
                'SELECT * FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE id = %d',
                $submission_id
            )
        );

        return $submission;
    }

    /**
     * Retrieves the count of submissions for a specific form based on approval status.
     *
     * This method calculates the total number of submissions for the form identified
     * by `$this->form_id`. It considers the approval status of the submissions and
     * adjusts the count based on whether approval is required and the default approval
     * status of the form.
     *
     * @return int The total count of submissions matching the criteria.
     */
    public function get_submission_count()
    {
        global $wpdb;

        $require_approval = get_post_meta($this->form_id, '_petitioner_require_approval', true);

        $final_status_to_get = 'Confirmed';

        // If require approval is enabled and the default approval status is 'Declined', count the number of declined submissions
        if ($require_approval) {
            $default_approval_status = get_post_meta($this->form_id, '_petitioner_approval_state', true);

            // only return approved if the default approval status is 'Declined'
            if ($default_approval_status === 'Declined') {
                $final_status_to_get = 'Declined';
            }
        }

        // Get the total count of submissions for the form
        return $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$wpdb->prefix}av_petitioner_submissions WHERE form_id = %d AND approval_status = %s",
                $this->form_id,
                $final_status_to_get
            )
        );
    }

    /**
     * Create a new petition submission in the database.
     *
     * @param array $data Associative array of submission data.
     * @return int|false Inserted row ID on success, false on failure.
     */
    public static function create_submission(array $data)
    {
        global $wpdb;

        $table = $wpdb->prefix . 'av_petitioner_submissions';

        $formats = [
            '%d', // form_id
            '%s', // email
            '%s', // fname
            '%s', // lname
            '%s', // country
            '%d', // bcc_yourself
            '%d', // newsletter
            '%d', // hide_name
            '%d', // accept_tos
            '%s', // submitted_at
            '%s', // approval_status
            '%s', // confirmation_token (optional)
        ];

        // Only use formats up to the number of fields provided
        $used_formats = array_slice($formats, 0, count($data));

        $inserted = $wpdb->insert($table, $data, $used_formats);

        return $inserted ? $wpdb->insert_id : false;
    }

    /**
     * Checks if a given email address is a duplicate for a specific form ID.
     *
     * This method queries a custom database table to determine if the provided
     * email address already exists for the specified form ID.
     *
     * @param string $email   The email address to check for duplicates.
     * @param int    $form_id The ID of the form to check against.
     *
     * @global wpdb $wpdb WordPress database abstraction object.
     *
     * @return bool True if the email is a duplicate, false otherwise.
     */
    public static function check_duplicate_email($email, $form_id)
    {
        global $wpdb;

        // Query the custom table to check if the email already exists
        $email_findings = $wpdb->get_var($wpdb->prepare(
            'SELECT COUNT(*) FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE email = %s AND form_id = %d',
            $email,
            $form_id
        ));

        return $email_findings > 0;
    }

    /**
     * Static function used for the API
     * @return void
     */
    public static function api_handle_form_submit()
    {
        $wpnonce = !empty($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';

        if (!isset($wpnonce) || !wp_verify_nonce($wpnonce, 'petitioner_form_nonce')) {
            wp_send_json_error('Invalid nonce');
            wp_die();
        }

        $email                      = isset($_POST['petitioner_email']) ? sanitize_email(wp_unslash($_POST['petitioner_email'])) : '';
        $form_id                    = isset($_POST['form_id']) ? sanitize_text_field(wp_unslash($_POST['form_id'])) : '';
        $fname                      = isset($_POST['petitioner_fname']) ? sanitize_text_field(wp_unslash($_POST['petitioner_fname'])) : '';
        $lname                      = isset($_POST['petitioner_lname']) ? sanitize_text_field(wp_unslash($_POST['petitioner_lname'])) : '';
        $country                    = isset($_POST['petitioner_country']) ? sanitize_text_field(wp_unslash($_POST['petitioner_country'])) : '';
        $bcc                        = !empty($_POST['petitioner_bcc']) && sanitize_text_field(wp_unslash($_POST['petitioner_bcc'])) === 'on';
        $require_approval           = get_post_meta($form_id, '_petitioner_require_approval', true);
        $approval_status            = __('Confirmed', 'petitioner');
        $default_approval_status    = get_post_meta($form_id, '_petitioner_approval_state', true);
        $accept_tos                 = !empty($_POST['petitioner_accept_tos']) && sanitize_text_field(wp_unslash($_POST['petitioner_accept_tos'])) === 'on';

        if ($require_approval) {
            if ($default_approval_status === 'Email') {
                $approval_status = 'Declined';
            } else {
                $approval_status = $default_approval_status;
            }
        }

        $recaptcha_enabled  = get_option('petitioner_enable_recaptcha', false);
        $hcaptcha_enabled   = get_option('petitioner_enable_hcaptcha', false);

        if ($recaptcha_enabled) {
            $recaptcha_response = isset($_POST['petitioner-g-recaptcha-response']) ? sanitize_text_field(wp_unslash($_POST['petitioner-g-recaptcha-response'])) : '';

            $recaptcha_result = self::verify_captcha($recaptcha_response, 'recaptcha');

            if (!$recaptcha_result['success']) {
                wp_send_json_error($recaptcha_result['message']);
                wp_die();
            }
        }

        if ($hcaptcha_enabled) {
            $hcaptcha_response = isset($_POST['petitioner-h-captcha-response']) ? sanitize_text_field(wp_unslash($_POST['petitioner-h-captcha-response'])) : '';

            $hcaptcha_result = self::verify_captcha($hcaptcha_response, 'hcaptcha');

            if (!$hcaptcha_result['success']) {
                wp_send_json_error($hcaptcha_result['message']);
                wp_die();
            }
        }

        // todo: add these
        $hide_name          = false;
        $newsletter_opt_in  = false;

        // Insert into the custom table

        $email_exists = self::check_duplicate_email($email, $form_id);

        if ($email_exists) {
            wp_send_json_error(__('Looks like you\'ve already signed this petition!', 'petitioner'));
        }

        $confirmation_token = null;

        if ($require_approval && $default_approval_status === 'Email') {
            $confirmation_token = AV_Email_Confirmations::generate_confirmation_token();
        }

        $data = array(
            'form_id'           => $form_id,
            'email'             => $email,
            'fname'             => $fname,
            'lname'             => $lname,
            'country'           => $country,
            'bcc_yourself'      => $bcc ? 1 : 0,
            'newsletter'        => $newsletter_opt_in ? 1 : 0,
            'hide_name'         => $hide_name ? 1 : 0,
            'accept_tos'        => $accept_tos ? 1 : 0,
            'submitted_at'      => current_time('mysql'),
            'approval_status'   => $approval_status,
        );

        if ($confirmation_token) {
            $data['confirmation_token'] = $confirmation_token;
        }

        $submission_id = self::create_submission($data);

        $mailer_settings = array(
            'target_email'              => get_post_meta($form_id, '_petitioner_email', true),
            'target_cc_emails'          => get_post_meta($form_id, '_petitioner_cc_emails', true),
            'user_email'                => $email,
            'user_name'                 => $fname . ' ' . $lname,
            'user_country'              => $country,
            'letter'                    => get_post_meta($form_id, '_petitioner_letter', true),
            'subject'                   => get_post_meta($form_id, '_petitioner_subject', true),
            'bcc'                       => $bcc,
            'send_to_representative'    => get_post_meta($form_id, '_petitioner_send_to_representative', true),
            'form_id'                   => $form_id,
            'confirm_emails'            => $default_approval_status === 'Email',
            'submission_id'             => $submission_id
        );

        $mailer = new AV_Petitioner_Mailer($mailer_settings);

        $send_emails = $mailer->send_emails();

        // Check if the insert was successful
        if ($submission_id === false || $send_emails === false) {
            wp_send_json_error(__('Error saving submission. Please try again.', 'petitioner'));
        } else {
            wp_send_json_success(__('Your signature has been added!', 'petitioner'));
        }

        wp_die();
    }

    public static function api_fetch_form_submissions()
    {
        // Get the form ID and pagination info from the request
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $per_page = isset($_GET['per_page']) ? intval($_GET['per_page']) : 1000;
        $offset = ($page - 1) * $per_page;
        $form_id = isset($_GET['form_id']) ? intval($_GET['form_id']) : 0;

        // Check if form_id is valid
        if (!$form_id) {
            wp_send_json_error('Invalid form ID.');
            wp_die();
        }

        // Fetch submissions and total count using the new method
        $result = self::get_form_submissions($form_id, $per_page, $offset);

        // Calculate the total number of pages
        $total_pages = ceil($result['total'] / $per_page);

        // Return the results as a JSON response
        wp_send_json_success(array(
            'submissions' => $result['submissions'],
            'total' => $result['total'],
            'total_pages' => $total_pages,
            'current_page' => $page,
            'per_page' => $per_page,
        ));

        wp_die();
    }

    public static function api_change_submission_status()
    {
        $id         = isset($_POST['id']) ? absint($_POST['id']) : 0;
        $new_status = isset($_POST['status']) ? sanitize_text_field(wp_unslash($_POST['status'])) : '';

        if (!$id || empty($new_status)) {
            wp_send_json_error(['message' => 'Invalid input. ID and status are required.']);
            return;
        }

        $updated_rows = self::update_submission($id, ['approval_status' => $new_status]);

        if ($updated_rows === false) {
            wp_send_json_error(['message' => 'Database update failed.']);
            return;
        }

        wp_send_json_success([
            'message' => 'Status updated successfully.',
            'updated_rows' => $updated_rows
        ]);
    }

    public static function api_petitioner_export_csv()
    {
        global $wpdb;

        $form_id = isset($_GET['form_id']) ? intval($_GET['form_id']) : 0;

        $results = $wpdb->get_results(
            $wpdb->prepare(
                'SELECT * FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE form_id = %d',
                $form_id,
            )
        );

        if (empty($results)) {
            wp_die('No submissions available.');
        }

        // Set the headers to force download
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=petition_submissions.csv');

        // Open output stream for writing
        $output = fopen('php://output', 'w');

        // Output the column headings (customize as per your table structure)
        fputcsv($output, array('ID', 'First Name', 'Last Name', 'Email', 'Country', 'Salutation', 'BCC Yourself', 'Newsletter', 'Hide Name', 'Accept TOS', 'Submitted At'));

        // Loop over the rows and output them as CSV
        foreach ($results as $row) {
            fputcsv($output, array(
                $row->id,
                $row->fname,
                $row->lname,
                $row->email,
                $row->country,
                $row->salutation,
                $row->bcc_yourself,
                $row->newsletter,
                $row->hide_name,
                $row->accept_tos,
                $row->submitted_at
            ));
        }

        // Close the output stream
        fclose($output);

        // Prevent any further output (like HTML or errors)
        exit;
    }

    /**
     * Verify the CAPTCHA response (Supports both Google reCAPTCHA v3 & hCaptcha).
     *
     * @param string $captcha_response The CAPTCHA response token from the form.
     * @param string $captcha_type The type of CAPTCHA ('recaptcha' or 'hcaptcha').
     * @return array Response array with 'success' boolean and 'message' string.
     * @since 0.2.3
     */
    public static function verify_captcha($captcha_response, $captcha_type = 'recaptcha')
    {
        // Get the appropriate secret key based on CAPTCHA type
        $captcha_secret = ($captcha_type === 'hcaptcha')
            ? get_option('petitioner_hcaptcha_secret_key', '')
            : get_option('petitioner_recaptcha_secret_key', '');

        // Handle missing response
        if (empty($captcha_response)) {
            error_log(strtoupper($captcha_type) . ' response is missing.');
            return [
                'success' => false,
                'message' => __('CAPTCHA response is missing.', 'petitioner'),
            ];
        }

        // Determine verification URL
        $verify_url = ($captcha_type === 'hcaptcha')
            ? 'https://hcaptcha.com/siteverify'
            : 'https://www.google.com/recaptcha/api/siteverify';

        // Send request to verification API
        $api_response = wp_remote_post($verify_url, [
            'body' => [
                'secret'   => $captcha_secret,
                'response' => $captcha_response,
                'remoteip' => $_SERVER['REMOTE_ADDR'],
            ],
        ]);

        // Handle connection failure
        if (is_wp_error($api_response)) {
            error_log(strtoupper($captcha_type) . ' API request failed: ' . $api_response->get_error_message());
            return [
                'success' => false,
                'message' => __('CAPTCHA verification failed: Unable to connect.', 'petitioner'),
            ];
        }

        // Decode API response
        $body = json_decode(wp_remote_retrieve_body($api_response), true);

        // Validate response
        if (!isset($body['success']) || !$body['success']) {
            error_log(strtoupper($captcha_type) . ' validation failed: ' . print_r($body, true));
            return [
                'success' => false,
                'message' => __('CAPTCHA verification failed.', 'petitioner'),
            ];
        }

        // Check score for Google reCAPTCHA v3
        if ($captcha_type === 'recaptcha' && isset($body['score']) && $body['score'] < 0.5) {
            return [
                'success' => false,
                'message' => __('reCAPTCHA score too low. Please try again.', 'petitioner'),
            ];
        }

        return [
            'success' => true,
            'message' => __('CAPTCHA verification completed.', 'petitioner'),
        ];
    }
}
