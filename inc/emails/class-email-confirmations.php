<?php

/**
 * Class AV_Email_Confirmations
 *
 * This class handles email confirmation functionalities for the Petitioner plugin.
 * It is responsible for managing the logic related to sending and processing email confirmations.
 *
 * @package Petitioner
 * @subpackage EmailConfirmations
 */
class AV_Email_Confirmations
{

    public function __construct()
    {
        add_action('init', [$this, 'confirm_email']);
    }

    /**
     * Retrieves the confirmation token for a given submission ID.
     *
     * This method fetches the submission data using the provided submission ID
     * and returns the confirmation token if it exists. If the token is not found,
     * an empty string is returned.
     *
     * @param int $sid The ID of the submission.
     * @return string The confirmation token if available, or an empty string.
     */
    static function get_confirmation_token($sid)
    {
        $sid                = intval($sid);
        $current_submission = AV_Petitioner_Submissions_Model::get_submission_by_id($sid);

        return !empty($current_submission->confirmation_token) ? $current_submission->confirmation_token : '';
    }

    /**
     * Generates a confirmation token.
     *
     * This method creates a secure random token using `random_bytes` and converts it to a hexadecimal string.
     *
     * @return string A 64-character hexadecimal string representing the confirmation token.
     * @throws Exception If it was not possible to gather sufficient entropy.
     */
    static function generate_confirmation_token()
    {
        try {
            return bin2hex(random_bytes(32));
        } catch (Exception $e) {
            av_ptr_error_log('Error generating confirmation token with random_bytes(), using fallback: ' . $e->getMessage());
            return bin2hex(wp_generate_password(64, false, false));
        }
    }

    /**
     * Handles email confirmation for petition submissions.
     *
     * This method checks for the presence of required query parameters (`petitioner_confirm`, `token`, and `sid`) 
     * in the URL. If any of these are missing, the method exits early. It then validates the submission ID (`sid`) 
     * and token against the stored submission data. If the token matches the stored confirmation token, the 
     * submission's approval status is updated to "Confirmed" and the confirmation token is removed.
     *
     * On successful confirmation, the user is redirected to a success page. If the confirmation fails, the user 
     * is redirected to an invalid confirmation page.
     *
     * @return void
     */
    public function confirm_email()
    {
        if (!isset($_GET['petitioner_confirm']) || !isset($_GET['token']) || !isset($_GET['sid'])) {
            return;
        }

        $id     = absint($_GET['sid']);
        $token  = sanitize_text_field(wp_unslash($_GET['token']));

        $submission = AV_Petitioner_Submissions_Model::get_submission_by_id($id);

        if (!$submission) {
            return;
        }

        $form_id = $submission->form_id;

        if ($token === $submission->confirmation_token) {
            // Update status and remove the token
            $updated = AV_Petitioner_Submissions_Model::update_submission($id, [
                'approval_status'       => 'Confirmed',
                'confirmation_token'    => null
            ]);

            if ($updated !== false) {
                // Send the emails
                self::send_emails($submission);

                /**
                 * Fires immediately after a petition submission's email is successfully confirmed.
                 * 
                 * This action allows external code to run custom logic (e.g., syncing to a CRM,
                 * sending a custom notification, or triggering a webhook) the moment a user
                 * clicks the confirmation link in their email and the record is updated.
                 *
                 * @since 0.8.1
                 *
                 * @param object $submission The submission object containing the petition data.
                 */
                do_action('petitioner_email_confirmation_success', $submission);
                // Optional: custom redirect on success
                $this->handle_redirect($form_id, '_petitioner_confirm_success_url', home_url('/?petitioner=confirmed'));
            }
        }

        /**
         * Fires when a petition submission's email confirmation fails.
         * 
         * This typically occurs if the token is invalid, expired, or the submission
         * has already been confirmed. External code can use this to log failures
         * or trigger alternative workflows.
         *
         * @since 0.8.1
         *
         * @param object $submission The submission object that failed confirmation.
         * @param string $token      The invalid token that was provided in the URL.
         */
        do_action('petitioner_email_confirmation_error', $submission, $token);

        // Optional: custom redirect on failure
        $this->handle_redirect($form_id, '_petitioner_confirm_error_url', home_url('/?petitioner=invalid'));
    }

    /**
     * Safely executes a redirect by checking explicitly configured form metadata.
     * Enforces strict validation using `wp_validate_redirect` to prevent open redirects
     * unless explicitly bypassed by the `petitioner_allow_external_redirects` filter.
     *
     * @param int    $form_id     The ID of the submission's form.
     * @param string $meta_key    The meta key holding the custom redirect URL.
     * @param string $default_url The fallback URL to redirect to if custom URL is empty or invalid.
     * @return void
     */
    private function handle_redirect($form_id, $meta_key, $default_url)
    {
        $custom_url = get_post_meta($form_id, $meta_key, true);
        $custom_url = av_petitioner_get_validated_redirect_url($custom_url, $form_id);

        if (!empty($custom_url)) {
            wp_redirect($custom_url);
        } else {
            wp_redirect($default_url);
        }
        exit;
    }

    /**
     * Sends emails to the user and the target email address.
     */
    static public function send_emails($submission, $force_ty_email = false, $force_confirm_email = false)
    {
        $form_id           = $submission->form_id;
        $email             = $submission->email;
        $fname             = $submission->fname;
        $lname             = $submission->lname;
        $country           = $submission->country;
        $bcc               = $submission->bcc_yourself ? 1 : 0;
        $submission_id     = $submission->id;

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
            'confirm_emails'            => $force_confirm_email,  // set TRUE only when resending
            'send_ty_email'             => $force_ty_email,       // set TRUE only when resending
            'submission_id'             => $submission_id,
            'from_field'                => get_post_meta($form_id, '_petitioner_from_field', true),
            'from_name'                 => get_post_meta($form_id, '_petitioner_from_name', true),
        );

        /**
         * Filter the mailer settings before sending emails for email confirmations.
         *
         * This allows modification of the mailer settings (e.g. adding/removing recipients)
         * before the emails are sent.
         *
         * @param array $mailer_settings Associative array of mailer settings.
         * @param array $submission_data Associative array of submission data.
         * @return array Modified mailer settings.
         */
        $mailer_settings = apply_filters('av_petitioner_confirmation_mailer_settings', $mailer_settings, $submission);

        $mailer = new AV_Petitioner_Mailer($mailer_settings);

        return $mailer->send_emails();
    }
}
