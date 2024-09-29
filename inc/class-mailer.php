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
    public $subject;
    public $letter;
    public $bcc = true;
    public $send_to_representative = true;
    public $headers = array();
    public $domain = '';

    public function __construct($settings)
    {
        $this->target_email = $settings['target_email'];
        $this->target_cc_emails = $settings['target_cc_emails'];
        $this->user_email = $settings['user_email'];
        $this->user_name = $settings['user_name'];
        $this->letter = wpautop(wp_kses_post($settings['letter']));
        $this->subject = $settings['subject'];
        $this->bcc = $settings['bcc'];
        $this->send_to_representative = $settings['send_to_representative'];

        $this->domain = wp_parse_url(home_url(), PHP_URL_HOST);

        if($this->domain === 'localhost'){
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

        $conf_result = $this->send_confirmation_email();

        if ($this->send_to_representative) {
            $rep_result = $this->send_representative_email();
            $success = $rep_result && $conf_result;
        } else {
            $success = $conf_result;
        }

        return $success;
    }

    /**
     * Sends the petition details to the user
     * @return bool
     */
    public function send_confirmation_email()
    {
        $subject = __('Thank you for signing the petition!', 'petitioner');
        // Translators: %s is the user's name
        $message =  '<p>' . sprintf(__('Dear %s,</p>', 'petitioner'), $this->user_name) . '</p>';
        $message .=  '<p>' . __('Thank you for signing the petition.', 'petitioner') . '</p>';

        // Add the letter if the emails are being sent to rep
        if ($this->send_to_representative) {
            $message .=  '<p>' . __('Below is a copy of your letter:', 'petitioner') . '</p>';
            $message .=  '<hr/>';
            $message .= $this->letter;

            // Translators: %s is the user's name
            $message .=  '<p>' . sprintf(__('Sincerely, %s'), $this->user_name) . '</p>';
        }

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
    public function send_representative_email()
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
        return wp_mail($this->target_email, $subject, $message, $headers);
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
