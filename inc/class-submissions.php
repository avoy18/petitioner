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
            PRIMARY KEY  (id),
            KEY form_id (form_id)
        )";
        $sql .= ' ' . $wpdb->get_charset_collate() . ';';

        // Include the upgrade file for dbDelta
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // Create the table
        dbDelta($sql);
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

        $email                = isset($_POST['petitioner_email']) ? sanitize_email(wp_unslash($_POST['petitioner_email'])) : '';
        $form_id              = isset($_POST['form_id']) ? sanitize_text_field(wp_unslash($_POST['form_id'])) : '';
        $fname                = isset($_POST['petitioner_fname']) ? sanitize_text_field(wp_unslash($_POST['petitioner_fname'])) : '';
        $lname                = isset($_POST['petitioner_lname']) ? sanitize_text_field(wp_unslash($_POST['petitioner_lname'])) : '';
        $country              = isset($_POST['petitioner_country']) ? sanitize_text_field(wp_unslash($_POST['petitioner_country'])) : '';
        $bcc                  = !empty($_POST['petitioner_bcc']) && sanitize_text_field(wp_unslash($_POST['petitioner_bcc'])) === 'on';
        $require_approval     = get_post_meta($form_id, '_petitioner_require_approval', true);
        $approval_status      = __('Confirmed', 'petitioner');
        $accept_tos           = !empty($_POST['petitioner_accept_tos']) && sanitize_text_field(wp_unslash($_POST['petitioner_accept_tos'])) === 'on';

        if ($require_approval) {
            $default_approval_status = get_post_meta($form_id, '_petitioner_approval_state', true);
            $approval_status = $default_approval_status;
        }

        $recaptcha_enabled = get_option('petitioner_enable_recaptcha', false);
        $hcaptcha_enabled = get_option('petitioner_enable_hcaptcha', false);

        if ($recaptcha_enabled) {
            $recaptcha_response = isset($_POST['petitioner-g-recaptcha-response']) ? sanitize_text_field(wp_unslash($_POST['petitioner-g-recaptcha-response'])) : '';

            $recaptcha_result = self::verify_captcha($recaptcha_response, 'recaptcha');


            error_log(print_r($recaptcha_result, true));

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

        global $wpdb;

        // todo: add these
        $hide_name = false;
        $newsletter_opt_in = false;

        // Insert into the custom table

        // Query the custom table to check if the email already exists
        $email_findings = $wpdb->get_var($wpdb->prepare(
            'SELECT COUNT(*) FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE email = %s AND form_id = %d',
            $email,
            $form_id
        ));

        $email_exists = $email_findings > 0;

        if ($email_exists) {
            wp_send_json_error(__('Looks like you\'ve already signed this petition!', 'petitioner'));
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

        $inserted = $wpdb->insert(
            $wpdb->prefix . 'av_petitioner_submissions',
            $data,
            array(
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
                '%s', // approval status
            )
        );

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
        );

        $mailer = new AV_Petitioner_Mailer($mailer_settings);

        $send_emails = $mailer->send_emails();

        // Check if the insert was successful
        if ($inserted === false || $send_emails === false) {
            wp_send_json_error(__('Error saving submission. Please try again.', 'petitioner'));
        } else {
            wp_send_json_success(__('Your signature has been added!', 'petitioner'));
        }

        wp_die();
    }

    public static function api_fetch_form_submissions()
    {
        global $wpdb;

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

        // Calculate the total number of pages
        $total_pages = ceil($total_submissions / $per_page);

        // Return the results as a JSON response
        wp_send_json_success(array(
            'submissions' => $submissions,
            'total' => $total_submissions,
            'total_pages' => $total_pages,
            'current_page' => $page,
            'per_page' => $per_page,
        ));

        wp_die();
    }

    public static function api_change_submission_status()
    {
        global $wpdb;

        // Validate and sanitize inputs
        $ids = isset($_POST['ids']) ? sanitize_text_field(wp_unslash($_POST['ids'])) : '';
        $new_status = isset($_POST['status']) ? sanitize_text_field(wp_unslash($_POST['status'])) : '';

        if (empty($ids) || empty($new_status)) {
            wp_send_json_error(['message' => 'Invalid input. IDs and status are required.']);
            return;
        }

        // Convert comma-separated IDs into an array
        $ids_array = array_filter(array_map('intval', explode(',', $ids)));

        if (empty($ids_array)) {
            wp_send_json_error(['message' => 'Invalid ID list provided.']);
            return;
        }

        // Prepare the placeholders for the IN clause
        $placeholders = implode(',', array_fill(0, count($ids_array), '%d'));

        // Update the status in the database
        $table_name = $wpdb->prefix . 'av_petitioner_submissions'; // Adjust table name as needed
        $updated_rows = $wpdb->query(
            $wpdb->prepare(
                "UPDATE $table_name SET approval_status = %s WHERE id IN ($placeholders)",
                array_merge([$new_status], $ids_array)
            )
        );

        if ($updated_rows === false) {
            wp_send_json_error(['message' => 'Database update failed.']);
            return;
        }

        // Return success response
        wp_send_json_success(['message' => 'Status updated successfully.', 'updated_rows' => $updated_rows]);
    }

    /**
     * Update an existing notification.
     *
     * @param int $id
     * @param array $fields
     * @return bool|int
     */
    public static function update_notification($id, $name, $notification_type, $delivery_channels, $settings = [])
    {
        global $wpdb;


        $data = array_merge([
            'name' => sanitize_text_field($name),
            'notification_type' => sanitize_text_field($notification_type),
            'delivery_channels' => wp_json_encode($delivery_channels),
        ], $settings);

        do_action('monitori_save_notification');

        return $wpdb->update($wpdb->prefix . 'monitori_notifications', $data, ['id' => absint($id)]);
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
