<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class AV_Petitioner_Submissions_Controller
{

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

        $email_exists = AV_Petitioner_Submissions_Model::check_duplicate_email($email, $form_id);

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

        $submission_id = AV_Petitioner_Submissions_Model::create_submission($data);

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

    /**
     * Fetch form submissions for the API
     */
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
        $result = AV_Petitioner_Submissions_Model::get_form_submissions($form_id, $per_page, $offset);

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

    /**
     * Update submission status via backend
     */
    public static function api_change_submission_status()
    {
        $id         = isset($_POST['id']) ? absint($_POST['id']) : 0;
        $new_status = isset($_POST['status']) ? sanitize_text_field(wp_unslash($_POST['status'])) : '';

        if (!$id || empty($new_status)) {
            wp_send_json_error(['message' => 'Invalid input. ID and status are required.']);
            return;
        }

        $updated_rows = AV_Petitioner_Submissions_Model::update_submission($id, ['approval_status' => $new_status]);

        if ($updated_rows === false) {
            wp_send_json_error(['message' => 'Database update failed.']);
            return;
        }

        wp_send_json_success([
            'message' => 'Status updated successfully.',
            'updated_rows' => $updated_rows
        ]);
    }

    /**
     * Export submissions to CSV
     */
    public static function admin_petitioner_export_csv()
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
