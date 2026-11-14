<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Shared sending logic for form emails. Each form type extends it with its own copy.
 */
abstract class AV_Petitioner_Mailer
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
    public $from_name               = false;
    public $final_from_field;
    public $lang                    = '';

    public function __construct($settings)
    {
        $this->target_email             = $settings['target_email'];
        $this->target_cc_emails         = $settings['target_cc_emails'];
        $this->user_email               = $settings['user_email'];
        $this->user_name                = $settings['user_name'];
        $this->user_country             = $settings['user_country'];
        $this->letter                   = is_string($settings['letter']) ? $settings['letter'] : '';
        $this->subject                  = $settings['subject'];
        $this->bcc                      = $settings['bcc'];
        $this->send_to_representative   = $settings['send_to_representative'];
        $this->confirm_emails           = $settings['confirm_emails'];
        $this->send_ty_email            = $settings['send_ty_email'] ?? true;
        $this->form_id                  = $settings['form_id'];
        $this->submission_id            = $settings['submission_id'];
        $this->from_field               = $settings['from_field'] ?? '';
        $this->from_name                = $settings['from_name'] ?? '';
        $this->lang                     = isset($settings['lang']) && is_string($settings['lang']) ? $settings['lang'] : '';

        $sanitized_from_field = sanitize_email($this->from_field);

        if (empty($sanitized_from_field) || !is_email($sanitized_from_field)) {
            $sanitized_from_field = sanitize_email(AV_Petitioner_Email_Template::get_default_from_field());
        }

        $this->from_field = $sanitized_from_field;

        $sanitized_from_name = sanitize_text_field($this->from_name);

        if (empty($sanitized_from_name)) {
            $sanitized_from_name = sanitize_text_field(AV_Petitioner_Email_Template::get_default_from_name());
        }

        $this->from_name = $sanitized_from_name;

        $this->final_from_field = sprintf('%s <%s>', $this->from_name, $this->from_field);
    }

    /**
     * Whether this form type sends a thank-you email to the submitter.
     *
     * @since 0.9.0
     * @return bool
     */
    protected function should_send_ty_email()
    {
        return (bool) $this->send_ty_email;
    }

    /**
     * Whether this form type sends an email to the form's target email.
     *
     * @since 0.9.0
     * @return bool
     */
    protected function should_send_to_target()
    {
        return (bool) $this->send_to_representative;
    }

    /**
     * Sends the form emails
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

        $submission     = !empty($this->submission_id) ? AV_Petitioner_Submissions_Model::get_submission_by_id($this->submission_id) : null;
        $status         = self::get_status($submission);

        $rep_email_sent = !empty($status['rep_email_sent']);
        $ty_email_sent  = !empty($status['ty_email_sent']);

        /**
         * petitioner_send_ty_email
         * 
         * Decided if the thank you email should be sent.
         *
         * @since 0.2.7
         *
         * @param bool  $should_send_ty_email Whether to send the thank you email.
         * @param array $filter_args The arguments passed to the filter.
         */
        $should_send_ty_email   = apply_filters('petitioner_send_ty_email', $this->should_send_ty_email(), $filter_args);

        /**
         * petitioner_send_ty_email
         * 
         * Decided if the rep email should be sent.
         *
         * @since 0.2.7
         *
         * @param bool  $should_send_to_rep Whether to send the rep you email.
         * @param array $filter_args The arguments passed to the filter.
         */
        $is_confirmed = !$submission || !isset($submission->approval_status) || $submission->approval_status === 'Confirmed';
        $should_send_to_rep     = $is_confirmed && apply_filters('petitioner_send_to_representative', $this->should_send_to_target(), $filter_args);
        $conf_result            = false;
        $rep_result             = false;

        if ($should_send_ty_email && !$ty_email_sent) {
            $conf_result = $this->ty_email();
            $success = $success && $conf_result;

            if ($conf_result && $submission) {
                $status['ty_email_sent'] = true;
            }
        }

        if ($should_send_to_rep && !$rep_email_sent) {
            $rep_result = $this->representative_email();

            $success = $success && $rep_result;

            if ($rep_result && $submission) {
                $status['rep_email_sent'] = true;
            }
        }

        if ($submission && ($conf_result || $rep_result)) {
            AV_Petitioner_Submissions_Model::update_submission($this->submission_id, [
                'email_status' => wp_json_encode($status)
            ]);
        }

        return $success;
    }

    /**
     * Sends the thank-you email to the submitter. Form types without one send nothing.
     *
     * @return bool
     */
    public function ty_email()
    {
        return true;
    }

    /**
     * Sends the form details to the form's target email.
     *
     * @return bool
     */
    abstract public function representative_email();

    /**
     * Send an email to the form's target email (and CC), BCC-ing the submitter if they asked to.
     *
     * @since 0.9.0
     *
     * @param string $subject
     * @param string $message
     * @return bool
     */
    protected function send_to_target($subject, $message)
    {
        $headers = AV_Petitioner_Email_Controller::build_headers($this->final_from_field, $this->target_cc_emails, ($this->bcc ? $this->user_email : ''));

        // Send the email
        $the_args = [
            'target_email'  => $this->target_email,
            'subject'       => $subject,
            'message'       => $message,
            'headers'       => $headers
        ];

        /**
         * petitioner_before_send_rep_email
         * 
         * Fires an action before sending a representative email.
         *
         * This hook allows developers to perform custom actions or modify data
         * before the email to the representative is sent.
         *
         * @since 0.2.7
         * 
         * @param array $the_args An array of arguments related to the email being sent.
         */
        do_action('petitioner_before_send_rep_email', $the_args);

        $sent = AV_Petitioner_Email_Controller::send($this->target_email, $subject, $message, $headers);

        /**
         * av_petitioner_after_send_rep_email
         *
         * Fires after the representative email is sent.
         *
         * @since 0.8.7
         *
         * @param array $the_args Arguments for the email that was sent.
         * @param bool  $sent     Whether wp_mail accepted the message.
         */
        do_action('av_petitioner_after_send_rep_email', $the_args, $sent);

        return $sent;
    }

    /**
     * Translate one email string into a language slug.
     *
     * @param string $name
     * @param string $value
     * @param string $lang
     * @return string
     */
    public function email_string($name, $value, $lang)
    {
        if (!is_string($value) || $value === '' || !is_string($lang) || $lang === '') {
            return $value;
        }

        $translated = apply_filters('av_petitioner_email_string', $value, $name, $this->form_id, $lang);

        return is_string($translated) ? $translated : $value;
    }

    /**
     * Get email status from submission safely
     *
     * @since 0.8.2
     *
     * @param WP_Post|null $submission Submission
     * @return array
     */
    public static function get_status($submission)
    {
        $status = ($submission && !empty($submission->email_status)) ? json_decode($submission->email_status, true) : [];
        /**
         * av_petitioner_submission_status
         * 
         * Filters the email status of a submission.
         *
         * @since 0.8.2
         * 
         * @param array $status The email status.
         * @param WP_Post|null $submission The submission.
         */
        $status = apply_filters('av_petitioner_submission_status', $status, $submission);

        if (!is_array($status)) {
            $status = [];
        }

        return $status;
    }
}
