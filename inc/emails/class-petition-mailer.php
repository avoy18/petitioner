<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Petition emails: the thank-you email to the signer and the letter to the representative.
 */
class AV_Petitioner_Petition_Mailer extends AV_Petitioner_Mailer
{
    /**
     * Sends the petition details to the user
     * @return bool
     */
    public function ty_email()
    {
        $lang               = is_string($this->lang) ? $this->lang : '';

        /**
         * Fires before the email copy is prepared.
         *
         * @since 0.8.7
         *
         * @param AV_Petitioner_Mailer $mailer Mailer for this send.
         * @param string               $lang   Language slug for this send. Empty keeps the source locale.
         */
        do_action('av_petitioner_before_email_prep', $this, $lang);

        $letter             = $this->format_letter($this->email_string('letter', $this->letter, $lang));
        $subject            = AV_Petitioner_Email_Template::get_default_ty_subject($this->confirm_emails);
        $message            = AV_Petitioner_Email_Template::get_default_ty_email($this->confirm_emails);
        $headers            = AV_Petitioner_Email_Controller::build_headers($this->final_from_field);
        $override_ty_email  = get_post_meta($this->form_id, '_petitioner_override_ty_email', true);
        if ($override_ty_email) {
            $custom_subject = get_post_meta($this->form_id, '_petitioner_ty_email_subject', true);
            $custom_message = get_post_meta($this->form_id, '_petitioner_ty_email', true);

            $subject = $custom_subject ? $this->email_string('ty_email_subject', $custom_subject, $lang) : $subject;
            $message = $custom_message ? $this->email_string('ty_email', $custom_message, $lang) : $message;
        } else {
            // // Add the letter if the emails are being sent to rep
            if ($this->send_to_representative) {
                $message .=  '<p>' . AV_Petitioner_Labels::get('letter_copy_intro', $this->form_id) . '</p>';
                $message .=  '<hr/>';
                $message .= $letter;

                $message .= $this->get_signature_html();
            }
        }

        $message = $this->convert_email_variables($message, $letter);

        $sent = AV_Petitioner_Email_Controller::send(
            $this->user_email,
            $subject,
            $message,
            $headers
        );

        /**
         * av_petitioner_after_send_ty_email
         *
         * Fires after the thank-you email is sent.
         *
         * @since 0.8.7
         *
         * @param AV_Petitioner_Mailer $mailer Mailer for this send.
         * @param string               $lang   Language slug for this send.
         * @param bool                 $sent   Whether wp_mail accepted the message.
         */
        do_action('av_petitioner_after_send_ty_email', $this, $lang, $sent);

        return $sent;
    }

    /**
     * Sends the petition details to the admin or representative
     * @return bool
     */
    public function representative_email()
    {
        /**
         * Use the signer's language for the representative email.
         *
         * @since 0.8.7
         * @param bool                 $use_submission_lang False keeps the source letter and subject.
         * @param AV_Petitioner_Mailer $mailer              Mailer for this send. `$mailer->lang` is the signer slug.
         * @return bool
         */
        $use_submission_lang = apply_filters('av_petitioner_representative_use_submission_lang', false, $this);
        $lang = $use_submission_lang ? $this->lang : '';

        /** This action is documented on ty_email(). */
        do_action('av_petitioner_before_email_prep', $this, $lang);

        $subject = $this->email_string('subject', $this->subject, $lang);
        $message = $this->format_letter($this->email_string('letter', $this->letter, $lang));

        $message .= $this->get_signature_html();

        return $this->send_to_target($subject, $message);
    }

    /**
     * Build the signature paragraph that closes the petition emails.
     *
     * The "sincerely" label is editable in the settings screen, so the name is
     * substituted literally rather than through sprintf(): a stray "%" in a
     * custom label would raise a ValueError and abort the send.
     *
     * @since 0.8.6
     *
     * @return string The signature paragraph, or an empty string if the label is blank.
     */
    public function get_signature_html()
    {
        $label = AV_Petitioner_Labels::get('sincerely', $this->form_id);

        if (empty($label)) {
            return '';
        }

        $name = sanitize_text_field($this->user_name);

        return '<p>' . str_replace(['{{user_name}}', '%1$s', '%s'], $name, $label) . '</p>';
    }

    /**
     * Turn the stored letter into email HTML after translation.
     *
     * Polylang matches the registered source text, so wpautop has to run after that lookup.
     *
     * @param string $letter
     * @return string
     */
    public function format_letter($letter)
    {
        return wpautop(wp_kses_post(is_string($letter) ? $letter : ''));
    }

    public function convert_email_variables($message, $letter = null)
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

            $confirmation_link = '<a href="' . esc_url($confirmation_link) . '">' . esc_html(AV_Petitioner_Labels::get('confirm_email')) . '</a>';
        }

        $variables = [
            'user_name'         => $this->user_name,
            'petition_letter'   => is_string($letter) ? $letter : $this->letter,
            'petition_goal'     => AV_Petitioner_Goal_Milestones::get_active_goal($this->form_id),
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
