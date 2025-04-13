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
    public $form_id                 = '';
    public $submission_id           = false;
    public $from_field              = false;

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
        $this->from_field               = $settings['from_field'];

        if (empty($this->from_field)) {
            $this->from_field = AV_Petitioner_Email_Template::get_default_from_field();
        }
    }

    /**
     * Sends the petition emails
     * @return bool
     */
    public function send_emails()
    {
        $success                = true;
        $conf_result            = false;
        $filter_args            = [
            'form_id'       => $this->form_id,
            'submission_id' => $this->submission_id,
            'user_name'     => $this->user_name,
        ]; // what data to pass to the filter

        $should_send_ty_email   = apply_filters('petitioner_send_ty_email', true, $filter_args);
        $should_send_to_rep     = apply_filters('petitioner_send_to_representative', $this->send_to_representative, $filter_args);

        if ($should_send_ty_email) {
            $conf_result    = $this->ty_email();
            $success        = $conf_result;
        }

        if ($should_send_to_rep) {
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
        $subject = AV_Petitioner_Email_Template::get_default_ty_subject($this->confirm_emails);
        $message = AV_Petitioner_Email_Template::get_default_ty_email($this->confirm_emails, $this->user_name, $this->letter);

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

        return AV_Petitioner_Email_Controller::send(
            $this->user_email,
            $subject,
            $message,
            $this->from_field
        );
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

        $headers = AV_Petitioner_Email_Controller::build_headers($this->from_field, $this->target_cc_emails, $this->user_email);

        // Send the email
        $the_args = [
            'target_email'  => $this->target_email,
            'subject'       => $subject,
            'message'       => $message,
            'headers'       => $headers
        ];

        do_action('petitioner_before_send_rep_email', $the_args);


        return AV_Petitioner_Email_Controller::send($this->target_email, $subject, $message, $headers);
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

            $message = preg_replace($pattern, $sanitized_value, $message);
        }

        return $message;
    }
}
