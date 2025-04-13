<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * AV_Petitioner_Email_Template
 *
 * A class to handle email templates.
 */
class AV_Petitioner_Email_Template
{
    public static function get_default_ty_subject($confirm_emails = false)
    {
        return $confirm_emails ? __('Please confirm your email.', 'petitioner') : __('Thank you for signing the petition!', 'petitioner');
    }

    static public function get_default_ty_email($confirm_emails = false)
    {
        $message = '';
        // Translators: {{user_name}} is the user's name
        $message =  '<p>' . __('Dear {{user_name}},</p>', 'petitioner') . '</p>';
        $message .=  '<p>' . __('Thank you for signing the petition.', 'petitioner') . '</p>';

        if ($confirm_emails) {
            $message .=  '<p>' . __('Please confirm your email by clicking the link below.', 'petitioner') . '</p>';
            $message .=  '<p>{{confirmation_link}}</p>';
        }

        return $message;
    }

    static public function get_default_from_field()
    {
        $domain = wp_parse_url(home_url(), PHP_URL_HOST);

        if ($domain === 'localhost') {
            $domain = 'localhost.com';
        }
        return 'petition-no-reply@' . $domain;
    }
}
