<?php

class AV_Petitioner_Labels
{
    public static $defaults = [];

    /**
     * Get a label by key
     *
     * @param string $key The key of the label to retrieve
     * @return string The label text
     */
    public static function get($key)
    {
        self::$defaults = [
            'error_generic'                  => __('Something went wrong. Please try again.', 'petitioner'),
            'error_required'                 => __('This field is required.', 'petitioner'),
            'ty_email_subject'               => AV_Petitioner_Email_Template::get_default_ty_subject(),
            'ty_email'                       => AV_Petitioner_Email_Template::get_default_ty_email(),
            'ty_email_subject_confirm'       => AV_Petitioner_Email_Template::get_default_ty_subject(true),
            'ty_email_confirm'               => AV_Petitioner_Email_Template::get_default_ty_email(true),
            'from_field'                     => AV_Petitioner_Email_Template::get_default_from_field(),
            'success_message_title'          => __('Thank you!', 'petitioner'),
            'success_message'                => __('Your submission has been received.', 'petitioner'),
        ];

        self::$defaults = apply_filters('av_petitioner_labels_defaults', self::$defaults);
        // If the key exists in the defaults, return it
        // Otherwise, return an empty string
        if (empty($key)) {
            av_ptr_error_log('AV_Petitioner_Labels::get called with empty key');
            return '';
        }

        return isset(self::$defaults[$key]) ? self::$defaults[$key] : '';
    }
}
