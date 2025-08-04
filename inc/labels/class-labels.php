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
    public static $defaults = [];

    /**
     * Get a label by key
     *
     * @param string $key The key of the label to retrieve
     * @return string The label text
     */
    public static function get($key, $form_id = null)
    {
        self::$defaults = self::get_all();

        /**
         * Filter to modify the default labels for the plugin.
         *
         * @param array $defaults Array of default labels.
         * @return array Modified default labels.
         */
        self::$defaults = apply_filters('av_petitioner_labels_defaults', self::$defaults);

        // If the key exists in the defaults, return it
        // Otherwise, return an empty string
        if (empty($key)) {
            av_ptr_error_log('AV_Petitioner_Labels::get called with empty key');
            return '';
        }

        if ($form_id !== null) {
            return self::get_form_label($key, $form_id);
        }

        return isset(self::$defaults[$key]) ? self::$defaults[$key] : '';
    }

    /**
     * Get all labels
     *
     * @return array An array of all labels
     */
    public static function get_all()
    {
        return [
            'could_not_submit'               => __('Could not submit the form.', 'petitioner'),
            'error_generic'                  => __('Something went wrong. Please try again.', 'petitioner'),
            'error_required'                 => __('This field is required.', 'petitioner'),
            'invalid_nonce'                  => __('Invalid nonce.', 'petitioner'),
            'flagged_as_spam'                => __('Your submission has been flagged as spam.', 'petitioner'),
            'already_signed'                 => __('Looks like you\'ve already signed this petition!', 'petitioner'),
            'ty_email_subject'               => AV_Petitioner_Email_Template::get_default_ty_subject(),
            'ty_email'                       => AV_Petitioner_Email_Template::get_default_ty_email(),
            'ty_email_subject_confirm'       => AV_Petitioner_Email_Template::get_default_ty_subject(true),
            'ty_email_confirm'               => AV_Petitioner_Email_Template::get_default_ty_email(true),
            'from_field'                     => AV_Petitioner_Email_Template::get_default_from_field(),
            'success_message_title'          => __('Thank you!', 'petitioner'),
            'success_message'                => __('Your submission has been received.', 'petitioner'),
            'your_name_here'                 => __('{Your name will be here}', 'petitioner'),
            'view_the_letter'                => __('View the letter', 'petitioner'),
            'close_modal'                    => __('Close modal', 'petitioner'),
            'signatures'                     => __('Signatures', 'petitioner'),
            'goal'                           => __('Goal', 'petitioner'),
            'id'                             => __('ID', 'petitioner'),
            'created_at'                     => __('Submission date', 'petitioner'),
            'name'                           => __('Name', 'petitioner')
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
