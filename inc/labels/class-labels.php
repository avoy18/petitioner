<?php

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Stores all of the static labels of the plugin
 * and provides filters to override them
 */
class AV_Petitioner_Labels
{
    private static $all_labels_cache = null; // Cache for labels + filters

    /**
     * Get a label by key
     *
     * @param string $key The key of the label to retrieve
     * @param int|null $form_id Optional form ID for form-specific labels
     * @return string The label text
     */
    public static function get($key, $form_id = null)
    {
        if (empty($key)) {
            av_ptr_error_log('AV_Petitioner_Labels::get called with empty key');
            return '';
        }

        if ($form_id !== null) {
            return self::get_form_label($key, $form_id);
        }

        // Get cached labels (only built once per request)
        $defaults = self::get_all_with_filters();

        return isset($defaults[$key]) ? $defaults[$key] : '';
    }

    /**
     * Get all labels with filters applied (cached)
     * 
     * @return array All labels with filters applied
     */
    private static function get_all_with_filters()
    {
        if (self::$all_labels_cache !== null) {
            return self::$all_labels_cache;
        }

        $labels = self::get_all();

        /**
         * Filter to modify the default labels for the plugin.
         *
         * @param array $labels Array of default labels.
         * @return array Modified default labels.
         */
        self::$all_labels_cache = apply_filters('av_petitioner_labels_defaults', $labels);

        return self::$all_labels_cache;
    }

    /**
     * Get all labels (without filters)
     *
     * @return array An array of all labels
     */
    public static function get_all()
    {
        return [
            // Error messages
            'could_not_submit'               => __('Could not submit the form.', 'petitioner'),
            'error_generic'                  => __('Something went wrong. Please try again.', 'petitioner'),
            'error_required'                 => __('This field is required.', 'petitioner'),
            'invalid_nonce'                  => __('Invalid nonce.', 'petitioner'),
            'invalid_form_id'                => __('Invalid form ID.', 'petitioner'),
            'flagged_as_spam'                => __('Your submission has been flagged as spam.', 'petitioner'),
            'already_signed'                 => __('Looks like you\'ve already signed this petition!', 'petitioner'),
            'missing_permissions'            => __('Missing permissions', 'petitioner'),
            'missing_fields'                 => __('Missing required fields', 'petitioner'),
            'already_confirmed'              => __('Submission already confirmed or not found.', 'petitioner'),
            'missing_confirmation_token'     => __('Missing confirmation token', 'petitioner'),
            'no_submissions_to_export'       => __('No submissions available to export.', 'petitioner'),

            // Email labels
            'ty_email_subject'               => AV_Petitioner_Email_Template::get_default_ty_subject(),
            'ty_email'                       => AV_Petitioner_Email_Template::get_default_ty_email(),
            'ty_email_subject_confirm'       => AV_Petitioner_Email_Template::get_default_ty_subject(true),
            'ty_email_confirm'               => AV_Petitioner_Email_Template::get_default_ty_email(true),
            'from_field'                     => AV_Petitioner_Email_Template::get_default_from_field(),
            'from_name'                      => AV_Petitioner_Email_Template::get_default_from_name(),
            'confirmation_resent'            => __('Confirmation email resent.', 'petitioner'),

            // UI labels
            'success_message_title'          => __('Thank you!', 'petitioner'),
            'success_message'                => __('Your submission has been received.', 'petitioner'),
            'success_generic'                => __('Success!', 'petitioner'),
            'your_name_here'                 => __('{Your name will be here}', 'petitioner'),
            'view_the_letter'                => __('View the letter', 'petitioner'),
            'close_modal'                    => __('Close modal', 'petitioner'),
            'signatures'                     => __('Signatures', 'petitioner'),
            'goal'                           => __('Goal', 'petitioner'),
            'id'                             => __('ID', 'petitioner'),
            'created_at'                     => __('Submission date', 'petitioner'),
            'name'                           => __('Name', 'petitioner'),

            // Form field labels
            'form_id'                        => __('Form ID', 'petitioner'),
            'fname'                          => __('First name', 'petitioner'),
            'lname'                          => __('Last name', 'petitioner'),
            'email'                          => __('Your email', 'petitioner'),
            'country'                        => __('Country', 'petitioner'),
            'salutation'                     => __('Salutation', 'petitioner'),
            'date_of_birth'                  => __('Date of birth', 'petitioner'),
            'phone'                          => __('Phone', 'petitioner'),
            'street_address'                 => __('Street address', 'petitioner'),
            'city'                           => __('City', 'petitioner'),
            'postal_code'                    => __('Postal code', 'petitioner'),
            'comments'                       => __('Comments', 'petitioner'),
            'bcc_yourself'                   => __('BCC yourself', 'petitioner'),
            'newsletter'                     => __('Newsletter', 'petitioner'),
            'hide_name'                      => __('Hide name', 'petitioner'),
            'accept_tos'                     => __('Terms of service checkbox', 'petitioner'),
            'approval_status'                => __('Approval status', 'petitioner'),
            'confirmation_token'             => __('Confirmation token', 'petitioner'),
        ];
    }

    /**
     * Get a label for a specific form
     *
     * @param string $key The key of the label to retrieve
     * @param int $form_id The ID of the form
     * @return string The label text
     */
    public static function get_form_label($key, $form_id)
    {
        return get_post_meta('' . $form_id, '_petitioner_' . $key, true) ?: self::get($key);
    }
}
