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
        return bin2hex(random_bytes(32));
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

        if ($token === $submission->confirmation_token) {
            // Update status and remove the token
            $updated = AV_Petitioner_Submissions_Model::update_submission($id, [
                'approval_status'       => 'Confirmed',
                'confirmation_token'    => null
            ]);

            if ($updated !== false) {
                // Optional: show success flag in query string
                wp_redirect(home_url('/?petitioner=confirmed'));
                exit;
            }
        }

        // Optional: redirect on failure
        wp_redirect(home_url('/?petitioner=invalid'));
        exit;
    }
}
