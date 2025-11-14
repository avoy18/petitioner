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

    static public function get_default_from_name()
    {
        $blog_name = get_bloginfo('name');

        if (!empty($blog_name)) {
            return $blog_name;
        }

        $fallback = wp_parse_url(home_url(), PHP_URL_HOST);

        return !empty($fallback) ? $fallback : 'WordPress';
    }

    static public function get_styled_message($message)
    {
        $final_html = '
        <div style="background-color: #f2f4f6; padding: 48px 8px; text-align: center;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 6px; overflow: hidden;">
                <tr>
                    <td style="padding: 24px; font-family: Arial, sans-serif; font-size: 16px; color: #333333; text-align: left;">
                        ' . $message . '
                    </td>
                </tr>
            </table>
        </div>';

        /**
         * petitioner_get_styled_message
         * 
         * Filters the styled email message content.
         *
         * This filter allows modification of the final HTML content of the email message.
         *
         * @since 0.2.7
         *
         * @param string $final_html The final HTML content of the email message.
         * @param string $message    The original unstyled message content.
         */
        $final_html = apply_filters('petitioner_get_styled_message', $final_html, $message);

        return $final_html;
    }
}
