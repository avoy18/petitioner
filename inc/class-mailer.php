<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class AV_Petitioner_Mailer
{
    public $target_email;
    public $target_cc_emails;
    public $user_email;
    public $user_name;
    public $user_country;
    public $subject;
    public $letter;
    public $bcc                     = true;
    public $send_to_representative  = true;
    public $send_ty_email           = true;
    public $confirm_emails          = false;
    public $headers                 = array();
    public $domain                  = '';
    public $form_id                 = '';
    public $submission_id           = false;

    public function __construct($settings)
    {
        $this->target_email             = $settings['target_email'];
        $this->target_cc_emails         = $settings['target_cc_emails'];
        $this->user_email               = $settings['user_email'];
        $this->user_name                = $settings['user_name'];
        $this->user_country             = $settings['user_country'];
        $this->letter                   = wpautop(wp_kses_post($settings['letter']));
        $this->subject                  = $settings['subject'];
        $this->bcc                      = $settings['bcc'];
        $this->send_to_representative   = $settings['send_to_representative'];
        $this->confirm_emails           = $settings['confirm_emails'];
        $this->form_id                  = $settings['form_id'];
        $this->submission_id            = $settings['submission_id'];
        $this->domain                   = wp_parse_url(home_url(), PHP_URL_HOST);

        if ($this->domain === 'localhost') {
            $this->domain = 'localhost.com';
        }
    }

    /**
     * Sends the petition emails
     * @return bool
     */
    public function send_emails()
    {
        $success = false;

        $conf_result = true;

        $conf_result = $this->ty_email();
        $success = $conf_result;

        if ($this->send_to_representative) {
            $rep_result = $this->representative_email();
            $success = $rep_result && $conf_result;
        }


        return $success;
    }

    /**
     * Sends the petition details to the user
     * @return bool
     */
    public function ty_email()
    {
        $subject = self::get_default_ty_subject($this->confirm_emails);
        $message = self::get_default_ty_email($this->confirm_emails);

        $override_ty_email = get_post_meta($this->form_id, '_petitioner_override_ty_email', true);

        if ($override_ty_email) {
            $custom_subject = get_post_meta($this->form_id, '_petitioner_ty_email_subject', true);
            $custom_message = get_post_meta($this->form_id, '_petitioner_ty_email', true);

            $subject = $custom_subject ? $custom_subject : $subject;
            $message = $custom_message ? $custom_message : $message;
        } else {
            // // Add the letter if the emails are being sent to rep
            if ($this->send_to_representative) {
                $message .=  '<p>' . __('Below is a copy of your letter:', 'petitioner') . '</p>';
                $message .=  '<hr/>';
                $message .= $this->letter;

                // Translators: %s is the user's name
                $message .=  '<p>' . sprintf(__('Sincerely, %s'), $this->user_name) . '</p>';
            }
        }

        $message = $this->convert_email_variables($message);

        // Headers for plain text email
        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'From: petition-no-reply@' . $this->domain
        );
        // Send the email
        return wp_mail($this->user_email, $subject, $message, $headers);
    }

    /**
     * Sends the petition details to the admin or representative
     * @return bool
     */
    public function representative_email()
    {
        $subject = $this->subject;
        $message =  $this->letter;

        // Translators: %s is the user's name
        $message .=  '<p>' . sprintf(__('Sincerely, %s'), $this->user_name) . '</p>';

        // Headers for plain text email
        $headers = array(
            'Content-Type: text/html; charset=UTF-8',
            'From: petition-no-reply@' . $this->domain
        );

        if (!empty($this->target_cc_emails)) {
            $headers[] = 'CC: ' . $this->target_cc_emails;
        }

        if ($this->bcc) {
            $headers[] = 'BCC: ' . $this->user_email;
        }

        // Send the email
        $the_args = [
            'target_email'  => $this->target_email,
            'subject'       => $subject,
            'message'       => $message,
            'headers'       => $headers
        ];

        do_action('petitioner_before_send_rep_email', $the_args);

        /**
         * In case the email is sent to multiple recipients, 
         * we need to split the emails and send them one by one
         */
        if (strpos($this->target_email, ',') !== false) {
            $emails = explode(',', $this->target_email);
            $success = true;
            foreach ($emails as $email) {
                $email = trim($email);
                if (!wp_mail($email, $subject, $message, $headers)) {
                    $success = false;
                }
            }
            return $success;
        }

        return wp_mail($this->target_email, $subject, $message, $headers);
    }

    static public function get_default_ty_subject($confirm_emails = false)
    {
        if (!$confirm_emails) {
            return __('Thank you for signing the petition!', 'petitioner');
        }

        return __('Please confirm your email.', 'petitioner');
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

    public function convert_email_variables($message)
    {
        $confirmation_link = '';

        if ($this->confirm_emails) {
            $confirmation_link = add_query_arg(
                array(
                    'petitioner_confirm' => 1,
                    'token'              => AV_Email_Confirmations::get_confirmation_token($this->submission_id),
                    'sid'                => $this->submission_id,
                ),
                get_site_url()
            );

            $confirmation_link = '<a href="' . esc_url($confirmation_link) . '">' . esc_html__('Confirm your email.', 'petitioner') . '</a>';
        }

        $variables = [
            'user_name'         => $this->user_name,
            'petition_letter'   => $this->letter,
            'petition_goal'     => get_post_meta($this->form_id, '_petitioner_goal', true),
            'confirmation_link' => $confirmation_link
        ];

        foreach ($variables as $key => $value) {
            $pattern = '/{{\s*' . preg_quote($key, '/') . '\s*}}/';
            error_log($value);
            $sanitized_value = '';

            switch ($key) {
                case 'petition_letter':
                    $sanitized_value = wp_kses_post($value);
                    break;
                case 'confirmation_link':
                    $sanitized_value = wp_kses_post($value);
                    break;
                default:
                    $sanitized_value = sanitize_text_field($value);
                    break;
            }

            error_log($sanitized_value);

            $message = preg_replace($pattern, $sanitized_value, $message);
        }

        return $message;
    }

    // todo: add admin emails
    // public function send_admin_email()
    // {
    //     // Fetch recipient email from options or fallback to the site admin email
    //     $admin_email = get_option('admin_email');
    //     $subject = __('New petition submission - ', 'petitioner') . $this->subject;
    //     $message = '<p>' . sprintf(__("A new petition has been submitted by %s. Here are the details:\n\n", 'petitioner'), $this->user_name) . '</p>';
    //     $message .= '';

    //     // Headers for plain text email
    //     $headers = array('Content-Type: text/html; charset=UTF-8');

    //     // Send the email
    //     return wp_mail($admin_email, $subject, $message, $headers);
    // }
}
