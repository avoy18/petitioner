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
        if (!check_ajax_referer('petitioner_form_nonce', 'petitioner_nonce', false)) {
            wp_send_json_error([
                'title'     => AV_Petitioner_Labels::get('could_not_submit'),
                'message'   => AV_Petitioner_Labels::get('invalid_nonce'),
            ]);
            wp_die();
        }

        if (!empty($_POST['ptr_info'])) {
            wp_send_json_error([
                'title'     => AV_Petitioner_Labels::get('could_not_submit'),
                'message'   => AV_Petitioner_Labels::get('error_generic'),
            ]);
            wp_die();
        }

        $email                      = isset($_POST['petitioner_email']) ? sanitize_email(wp_unslash($_POST['petitioner_email'])) : '';
        $form_id                    = isset($_POST['form_id']) ? sanitize_text_field(wp_unslash($_POST['form_id'])) : '';
        $fname                      = isset($_POST['petitioner_fname']) ? sanitize_text_field(wp_unslash($_POST['petitioner_fname'])) : '';
        $lname                      = isset($_POST['petitioner_lname']) ? sanitize_text_field(wp_unslash($_POST['petitioner_lname'])) : '';
        $country                    = isset($_POST['petitioner_country']) ? sanitize_text_field(wp_unslash($_POST['petitioner_country'])) : '';
        $phone                      = isset($_POST['petitioner_phone']) ? sanitize_text_field(wp_unslash($_POST['petitioner_phone'])) : '';
        $street_address             = isset($_POST['petitioner_street_address']) ? sanitize_text_field(wp_unslash($_POST['petitioner_street_address'])) : '';
        $city                       = isset($_POST['petitioner_city']) ? sanitize_text_field(wp_unslash($_POST['petitioner_city'])) : '';
        $postal_code                = isset($_POST['petitioner_postal_code']) ? sanitize_text_field(wp_unslash($_POST['petitioner_postal_code'])) : '';
        $comments                   = isset($_POST['petitioner_comments']) ? sanitize_text_field(wp_unslash($_POST['petitioner_comments'])) : '';
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

        // handle captcha
        AV_Petitioner_Captcha::validate_captcha($form_id);

        // akismet
        $akismet_is_spam = AV_Petitioner_Akismet::check_with_akismet(
            $email,
            $fname,
            $lname,
            $country,
            $form_id
        );

        if ($akismet_is_spam) {
            wp_send_json_error([
                'title'     => AV_Petitioner_Labels::get('could_not_submit'),
                'message'   => AV_Petitioner_Labels::get('flagged_as_spam'),
            ]);
        }

        // todo: add these
        $hide_name          = false;
        $newsletter_opt_in  = false;

        // Insert into the custom table

        $email_exists = AV_Petitioner_Submissions_Model::check_duplicate_email($email, $form_id);

        if ($email_exists) {
            wp_send_json_error([
                'title'     => AV_Petitioner_Labels::get('could_not_submit'),
                'message'   => AV_Petitioner_Labels::get('already_signed'),
            ]);
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
            'phone'             => $phone,
            'street_address'    => $street_address,
            'city'              => $city,
            'postal_code'       => $postal_code,
            'comments'          => $comments,
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

        /**
         * Filter the form submission data before it is saved.
         *
         * This allows modification of the submission data (e.g. sanitization, additional metadata)
         * before the submission is created and stored.
         *
         * @param array $data Associative array of submission data (field values and metadata).
         * @return array Modified submission data.
         */
        $data = apply_filters('av_petitioner_submission_data_pre_save', $data);

        $submission_id = AV_Petitioner_Submissions_Model::create_submission($data);

        /**
         * petitioner_after_submission
         * 
         * Fires an action after a submission is processed.
         *
         * This hook allows developers to perform custom actions or extend functionality
         * after a submission has been successfully handled.
         *
         * @since 0.2.7
         * 
         * @param int $submission_id The ID of the processed submission.
         * @param int $form_id The ID of the form associated with the submission.
         */
        do_action('petitioner_after_submission', $submission_id, $form_id);

        $send_to_rep = $default_approval_status !== 'Email' && get_post_meta($form_id, '_petitioner_send_to_representative', true);

        $mailer_settings = array(
            'target_email'              => get_post_meta($form_id, '_petitioner_email', true),
            'target_cc_emails'          => get_post_meta($form_id, '_petitioner_cc_emails', true),
            'user_email'                => $email,
            'user_name'                 => $fname . ' ' . $lname,
            'user_country'              => $country,
            'letter'                    => get_post_meta($form_id, '_petitioner_letter', true),
            'subject'                   => get_post_meta($form_id, '_petitioner_subject', true),
            'bcc'                       => $bcc,
            'send_to_representative'    => $send_to_rep,
            'form_id'                   => $form_id,
            'confirm_emails'            => $default_approval_status === 'Email',
            'submission_id'             => $submission_id,
            'from_field'                => get_post_meta($form_id, '_petitioner_from_field', true),
            'from_name'                 => get_post_meta($form_id, '_petitioner_from_name', true),
        );

        /**
         * Filter the mailer settings before sending emails.
         *
         * This allows modification of the mailer settings (e.g. adding/removing recipients)
         * before the emails are sent.
         *
         * @param array $mailer_settings Associative array of mailer settings.
         * @param array $submission_data Associative array of submission data.
         * @return array Modified mailer settings.
         */
        $mailer_settings = apply_filters('av_petitioner_mailer_settings', $mailer_settings, $data);

        $mailer = new AV_Petitioner_Mailer($mailer_settings);

        $send_emails = $mailer->send_emails();

        // Check if the insert was successful
        if ($submission_id === false || $send_emails === false) {
            wp_send_json_error([
                'title'   => AV_Petitioner_Labels::get('could_not_submit'),
                'message' => AV_Petitioner_Labels::get('error_generic'),
            ]);
        } else {
            wp_send_json_success([
                'title'     => AV_Petitioner_Labels::get('success_message_title', $form_id),
                'message'   => AV_Petitioner_Labels::get('success_message', $form_id),
            ]);
        }

        wp_die();
    }

    /**
     * Fetch form submissions for the API
     */
    public static function api_fetch_form_submissions()
    {
        // Get the form ID and pagination info from the request
        $page           = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $per_page       = isset($_GET['per_page']) ? intval($_GET['per_page']) : 1000;
        $offset         = ($page - 1) * $per_page;
        $form_id        = isset($_GET['form_id']) ? intval($_GET['form_id']) : 0;
        $order          = isset($_GET['order']) ? ($_GET['order'] === 'desc' ? 'desc' : 'asc') : null;
        $orderby        = isset($_GET['orderby']) ? $_GET['orderby'] : '';

        // Check if form_id is valid
        if (!$form_id) {
            wp_send_json_error('Invalid form ID.');
            wp_die();
        }

        // Fetch submissions and total count using the new method
        $fetch_settings = [
            'per_page' => $per_page,
            'offset'   => $offset,
        ];

        if ($order) {
            $fetch_settings['order'] = $order;
        }

        $allowed_fields = AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS;

        if ($orderby && in_array($orderby, $allowed_fields, true)) {
            $fetch_settings['orderby']  = $orderby;
        }


        $result = AV_Petitioner_Submissions_Model::get_form_submissions($form_id, $fetch_settings);

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
     * Fetch form submissions for the API
     * 
     * This function is used for non-logged-in users to fetch form submissions.
     * It retrieves the form ID and pagination information from the request,
     * validates the form ID, and then fetches the submissions using the
     * AV_Petitioner_Submissions_Model::get_form_submissions method.
     */
    public static function api_get_form_submissions()
    {
        // if (!check_ajax_referer('petitioner_submissions_nonce', 'petitioner_nonce', false)) {
        //     wp_send_json_error(AV_Petitioner_Labels::get('invalid_nonce'));
        //     wp_die();
        // }

        // Get the form ID and pagination info from the request
        $page       = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $per_page   = isset($_GET['per_page']) ? intval($_GET['per_page']) : 1000;
        $offset     = ($page - 1) * $per_page;
        $form_id    = isset($_GET['form_id']) ? intval($_GET['form_id']) : 0;
        $order      = isset($_GET['order']) ? ($_GET['order'] === 'desc' ? 'desc' : 'asc') : null;
        $orderby    = isset($_GET['orderby']) ? $_GET['orderby'] : '';

        // Check if form_id is valid
        if (!$form_id) {
            wp_send_json_error('Invalid form ID.');
            wp_die();
        }

        $hide_last_name = get_post_meta($form_id, '_petitioner_hide_last_names', true);

        // Fetch submissions and total count using the new method
        $fields = ['id', 'fname', 'lname', 'country', 'salutation', 'comments', 'city', 'postal_code', 'hide_name', 'submitted_at'];

        $fetch_settings = [
            'per_page'          => $per_page,
            'offset'            => $offset,
            'fields'            => $fields,
            'query'             => [
                'approval_status' => 'Confirmed',
            ],
        ];

        if ($order) {
            $fetch_settings['order'] = $order;
        }

        if ($orderby && in_array($orderby, $fields, true)) {
            $fetch_settings['orderby'] = $orderby;
        }

        $result = AV_Petitioner_Submissions_Model::get_form_submissions($form_id, $fetch_settings);

        // Calculate the total number of pages
        $total_pages = ceil($result['total'] / $per_page);

        $labels = av_petitioner_get_form_labels($form_id, [
            'name',
            'country',
            'city',
            'postal_code',
            'comments',
            'submitted_at',
        ]);

        $final_submissions = array_map(function ($submission) use ($hide_last_name, $labels) {
            if ($submission->hide_name) {
                $submission->fname = __('Anonymous', 'petitioner');
                $submission->lname = '';
            }

            if ($hide_last_name) {
                $submission->lname = mb_substr($submission->lname, 0, 1);
            }

            $modified_submission = [
                'name'          => $submission->fname . ' ' . $submission->lname
            ];

            foreach ($labels as $k => $v) {
                if ($k === 'name') {
                    continue;
                }

                $modified_submission[$k] = $submission->{$k};
            }

            return $modified_submission;
        }, $result['submissions']);

        // Return the results as a JSON response
        wp_send_json_success([
            'labels'        => $labels,
            'submissions'   => $final_submissions,
            'total'         => $result['total'],
            'total_pages'   => $total_pages,
            'current_page'  => $page,
            'per_page'      => $per_page,
        ]);

        wp_die();
    }

    /**
     * Update form submissions
     * 
     * @since 0.6.0
     */
    public static function api_update_form_submission()
    {
        self::check_admin_request(AV_Petitioner_Admin_Edit_UI::$ADMIN_EDIT_NONCE_LABEL);
        $id = isset($_POST['id']) ? absint($_POST['id']) : null;

        if (empty($id)) {
            wp_send_json_error([
                'message'   => AV_Petitioner_Labels::get('missing_fields'),
            ]);
            return;
        }

        $submission = [];

        // Use the model's allowed fields to dynamically build the submission array
        foreach (AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS as $field) {
            if (isset($_POST[$field])) {
                switch ($field) {
                    case 'id':
                        break;
                    case 'form_id':
                        break;
                    case 'email':
                        $submission[$field] = sanitize_email(wp_unslash($_POST[$field]));
                        break;
                    case 'comments':
                        $submission[$field] = sanitize_textarea_field(wp_unslash($_POST[$field]));
                        break;
                    case 'salutation':
                    case 'confirmation_token':
                        // Handle nullable fields
                        $value = $_POST[$field];
                        $submission[$field] = ($value !== '' && $value !== null) ? sanitize_text_field(wp_unslash($value)) : null;
                        break;
                    default:
                        // Default sanitization for text fields
                        $submission[$field] = sanitize_text_field(wp_unslash($_POST[$field]));
                        break;
                }
            }
        }

        $updated_rows = AV_Petitioner_Submissions_Model::update_submission($id, $submission);

        if ($updated_rows === 0) {
            wp_send_json_error(['message' => AV_Petitioner_Labels::get('error_generic')]);
        }

        wp_send_json_success(['message' => AV_Petitioner_Labels::get('success_generic'), 'updated_rows' => $updated_rows]);
    }

    /**
     * @since 0.6.0
     */
    public static function api_delete_form_submission()
    {
        self::check_admin_request(AV_Petitioner_Admin_Edit_UI::$ADMIN_EDIT_NONCE_LABEL);

        $id = isset($_POST['id']) ? absint($_POST['id']) : null;

        if (empty($id)) {
            wp_send_json_error([
                'message'   => AV_Petitioner_Labels::get('missing_fields'),
            ]);
            return;
        }

        $updated_rows = AV_Petitioner_Submissions_Model::delete_submission($id);

        if ($updated_rows === 0) {
            wp_send_json_error(['message' => AV_Petitioner_Labels::get('error_generic')]);
        }

        wp_send_json_success(['message' => AV_Petitioner_Labels::get('success_generic'), 'updated_rows' => $updated_rows]);
    }

    /**
     * Update submission status via backend
     */
    public static function api_change_submission_status()
    {
        $id         = isset($_POST['id']) ? absint($_POST['id']) : 0;
        $new_status = isset($_POST['status']) ? sanitize_text_field(wp_unslash($_POST['status'])) : '';

        if (!$id || empty($new_status)) {
            wp_send_json_error(['message' => AV_Petitioner_Labels::get('missing_fields')]);
            return;
        }

        $updated_rows = AV_Petitioner_Submissions_Model::update_submission($id, ['approval_status' => $new_status]);

        if ($updated_rows === false) {
            wp_send_json_error(['message' => AV_Petitioner_Labels::get('error_generic')]);
            return;
        }

        wp_send_json_success([
            'message' => 'Status updated successfully.',
            'updated_rows' => $updated_rows
        ]);
    }

    /**
     * Resend confirmation email to a specific submission
     */
    public static function api_resend_confirmation_email()
    {
        if (!current_user_can('manage_options')) {
            wp_send_json_error([
                'message'   => AV_Petitioner_Labels::get('missing_permissions'),
            ]);
        }

        $id = isset($_POST['id']) ? absint($_POST['id']) : 0;
        if (!$id) {
            wp_send_json_error(['message' => AV_Petitioner_Labels::get('missing_fields')]);
        }

        $submission = AV_Petitioner_Submissions_Model::get_submission_by_id($id);

        if (!$submission || $submission->approval_status === 'Confirmed') {
            wp_send_json_error(['message' => AV_Petitioner_Labels::get('already_confirmed')]);
        }

        if (empty($submission->confirmation_token)) {
            wp_send_json_error(['message' => AV_Petitioner_Labels::get('missing_confirmation_token')]);
        }

        $success = AV_Email_Confirmations::send_emails($submission, true, true);

        if ($success) {
            wp_send_json_success(['message' => AV_Petitioner_Labels::get('confirmation_resent')]);
        } else {
            wp_send_json_error(['message' => AV_Petitioner_Labels::get('error_generic')]);
        }
    }

    /**
     * Resend confirmation emails to all unconfirmed submissions
     */
    public static function api_resend_all_confirmation_emails()
    {
        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => AV_Petitioner_Labels::get('missing_permissions')]);
        }

        $form_id = isset($_POST['form_id']) ? absint($_POST['form_id']) : 0;

        if (!$form_id) {
            wp_send_json_error(['message' => AV_Petitioner_Labels::get('missing_fields')]);
        }

        $results = AV_Petitioner_Submissions_Model::get_unconfirmed_submissions($form_id);

        if (empty($results)) {
            wp_send_json_error(['message' => 'No unconfirmed submissions found.']);
        }

        $count = 0;
        foreach ($results as $submission) {
            $success = AV_Email_Confirmations::send_emails($submission, true, true);
            if ($success) {
                $count++;
            }
        }

        wp_send_json_success(['message' => "Resent confirmation emails to $count users."]);
    }

    /**
     * Check the count of unconfirmed submissions for a specific form
     */
    public static function api_check_unconfirmed_count()
    {
        $form_id = isset($_POST['form_id']) ? absint($_POST['form_id']) : 0;

        if (!$form_id) {
            wp_send_json_error(['message' => AV_Petitioner_Labels::get('invalid_form_id')]);
        }

        $count = AV_Petitioner_Submissions_Model::get_unconfirmed_count($form_id);

        wp_send_json_success(['count' => (int) $count]);
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

        // Output the column headings (matches DB schema)
        fputcsv($output, array(
            'ID',
            'Form ID',
            'First Name',
            'Last Name',
            'Email',
            'Country',
            'Salutation',
            'Phone',
            'Street Address',
            'City',
            'Postal Code',
            'BCC Yourself',
            'Newsletter',
            'Hide Name',
            'Accept TOS',
            'Approval Status',
            'Submitted At',
            'Confirmation Token'
        ));

        // Loop over the rows and output them as CSV
        foreach ($results as $row) {
            fputcsv($output, array(
                $row->id,
                $row->form_id,
                $row->fname,
                $row->lname,
                $row->email,
                $row->country,
                $row->salutation,
                $row->phone,
                $row->street_address,
                $row->city,
                $row->postal_code,
                $row->bcc_yourself,
                $row->newsletter,
                $row->hide_name,
                $row->accept_tos,
                $row->approval_status,
                $row->submitted_at,
                $row->confirmation_token
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
        // Lookup table for each CAPTCHA provider
        $providers = [
            'recaptcha' => [
                'secret_key_option' => 'petitioner_recaptcha_secret_key',
                'verify_url'        => 'https://www.google.com/recaptcha/api/siteverify',
            ],
            'hcaptcha' => [
                'secret_key_option' => 'petitioner_hcaptcha_secret_key',
                'verify_url'        => 'https://hcaptcha.com/siteverify',
            ],
            'turnstile' => [
                'secret_key_option' => 'petitioner_turnstile_secret_key',
                'verify_url'        => 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            ],
        ];

        // Validate captcha type
        if (! isset($providers[$captcha_type])) {
            return [
                'success' => false,
                'message' => __('Invalid CAPTCHA type.', 'petitioner'),
            ];
        }

        $provider = $providers[$captcha_type];
        $captcha_secret = get_option($provider['secret_key_option'], '');

        // Handle missing response
        if (empty($captcha_response)) {
            return [
                'success' => false,
                'message' => __('CAPTCHA response is missing.', 'petitioner'),
            ];
        }

        // Send request to verification API
        $api_response = wp_remote_post($provider['verify_url'], [
            'body' => [
                'secret'   => $captcha_secret,
                'response' => $captcha_response,
                'remoteip' => $_SERVER['REMOTE_ADDR'],
            ],
        ]);

        // Handle connection failure
        if (is_wp_error($api_response)) {
            return [
                'success' => false,
                'message' => __('CAPTCHA verification failed: Unable to connect.', 'petitioner'),
            ];
        }

        // Decode API response
        $body = json_decode(wp_remote_retrieve_body($api_response), true);

        // Validate general success
        if (! isset($body['success']) || ! $body['success']) {
            return [
                'success' => false,
                'message' => __('CAPTCHA verification failed.', 'petitioner'),
            ];
        }

        // Special case: Check reCAPTCHA v3 score
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

    public static function check_admin_request($nonce_label)
    {
        if (!check_ajax_referer($nonce_label, 'petitioner_nonce', false)) {
            av_ptr_error_log(['nonce', $nonce_label, $_POST['petitioner_nonce']]);
            wp_send_json_error([
                'title'     => AV_Petitioner_Labels::get('could_not_submit'),
                'message'   => AV_Petitioner_Labels::get('invalid_nonce'),
            ]);
            wp_die();
        }

        if (!current_user_can('manage_options')) {
            wp_send_json_error([
                'message'   => AV_Petitioner_Labels::get('missing_permissions'),
            ]);
            wp_die();
        }
    }
}
