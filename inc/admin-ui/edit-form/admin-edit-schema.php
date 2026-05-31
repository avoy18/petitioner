<?php
if (!defined("ABSPATH")) {
    exit(); // Exit if accessed directly
}

return [
    'title'                     => ['meta_key' => '_petitioner_title', 'type' => 'text'],
    'send_to_representative'    => ['meta_key' => '_petitioner_send_to_representative', 'type' => 'checkbox'],
    'email'                     => ['meta_key' => '_petitioner_email', 'type' => 'emails'],
    'cc_emails'                 => ['meta_key' => '_petitioner_cc_emails', 'type' => 'emails'],
    'goal'                      => ['meta_key' => '_petitioner_goal', 'type' => 'json_goal'],
    'subject'                   => ['meta_key' => '_petitioner_subject', 'type' => 'text'],
    'show_country'              => ['meta_key' => '_petitioner_show_country', 'type' => 'checkbox'],
    'show_goal'                 => ['meta_key' => '_petitioner_show_goal', 'type' => 'checkbox'],
    'require_approval'          => ['meta_key' => '_petitioner_require_approval', 'type' => 'checkbox'],
    'approval_state'            => ['meta_key' => '_petitioner_approval_state', 'type' => 'text'],
    'letter'                    => ['meta_key' => '_petitioner_letter', 'type' => 'wysiwyg'],
    'add_consent_checkbox'      => ['meta_key' => '_petitioner_add_consent_checkbox', 'type' => 'checkbox'],
    'add_legal_text'            => ['meta_key' => '_petitioner_add_legal_text', 'type' => 'checkbox'],
    'consent_text'              => ['meta_key' => '_petitioner_consent_text', 'type' => 'text'],
    'legal_text'                => ['meta_key' => '_petitioner_legal_text', 'type' => 'wysiwyg'],
    'override_ty_email'         => ['meta_key' => '_petitioner_override_ty_email', 'type' => 'checkbox'],
    'ty_email'                  => ['meta_key' => '_petitioner_ty_email', 'type' => 'wysiwyg'],
    'ty_email_subject'          => ['meta_key' => '_petitioner_ty_email_subject', 'type' => 'text'],
    'override_success_message'  => ['meta_key' => '_petitioner_override_success_message', 'type' => 'checkbox'],
    'success_message'           => ['meta_key' => '_petitioner_success_message', 'type' => 'wysiwyg'],
    'success_message_title'     => ['meta_key' => '_petitioner_success_message_title', 'type' => 'text'],
    'from_field'                => ['meta_key' => '_petitioner_from_field', 'type' => 'text'],
    'from_name'                 => ['meta_key' => '_petitioner_from_name', 'type' => 'text'],
    'add_honeypot'              => ['meta_key' => '_petitioner_add_honeypot', 'type' => 'checkbox'],
    'form_fields'               => ['meta_key' => '_petitioner_form_fields', 'type' => 'json_form_fields'],
    'field_order'               => ['meta_key' => '_petitioner_field_order', 'type' => 'json_array'],
    'hide_last_names'           => ['meta_key' => '_petitioner_hide_last_names', 'type' => 'checkbox'],
    'csv_column_config'         => ['meta_key' => '_petitioner_csv_column_config', 'type' => 'json_csv_config'],
    'redirect_url'              => ['meta_key' => '_petitioner_redirect_url', 'type' => 'url'],
    'confirm_success_url'       => ['meta_key' => '_petitioner_confirm_success_url', 'type' => 'url'],
    'confirm_error_url'         => ['meta_key' => '_petitioner_confirm_error_url', 'type' => 'url'],
];
