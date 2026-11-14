<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Contact form emails: every submission notifies the form's email with the submitted fields.
 *
 * @since 0.9.0
 */
class AV_Petitioner_Contact_Mailer extends AV_Petitioner_Mailer
{
    const INTERNAL_KEYS = ['id', 'form_id', 'lang', 'approval_status', 'submitted_at', 'confirmation_token', 'email_status', 'is_featured'];

    protected function should_send_ty_email()
    {
        return false;
    }

    protected function should_send_to_target()
    {
        return true;
    }

    /**
     * Sends the submitted fields to the form's notification email
     * @return bool
     */
    public function representative_email()
    {
        /** This action is documented in AV_Petitioner_Petition_Mailer::ty_email(). */
        do_action('av_petitioner_before_email_prep', $this, '');

        $subject = !empty($this->subject) ? $this->subject : AV_Petitioner_Labels::get('contact_notification_subject');

        $submission = !empty($this->submission_id) ? AV_Petitioner_Submissions_Model::get_submission_by_id($this->submission_id) : null;

        if ($submission) {
            $submission = AV_Petitioner_Custom_Properties::hydrate_submission($submission);
        }

        $message = AV_Petitioner_Email_Template::get_fields_table($this->get_field_rows((array) $submission));

        return $this->send_to_target($subject, $message);
    }

    /**
     * Turn submission data into label => value rows, skipping internal and empty fields.
     *
     * @param array $submission Submission data.
     * @return array<string, string>
     */
    public function get_field_rows($submission)
    {
        $field_aliases = ['bcc_yourself' => 'bcc'];

        $rows = [];

        foreach ($submission as $key => $value) {
            if (in_array($key, self::INTERNAL_KEYS, true) || !is_scalar($value) || $value === '' || $value === 0 || $value === '0') {
                continue;
            }

            $field = AV_Petitioner_Field_Registry::get($field_aliases[$key] ?? $key);
            $label = !empty($field['fieldName']) ? $field['fieldName'] : $key;

            $rows[$label] = ($value === 1 || $value === '1') ? __('Yes', 'petitioner') : (string) $value;
        }

        return $rows;
    }
}
