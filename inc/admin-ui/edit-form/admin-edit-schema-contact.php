<?php
if (!defined("ABSPATH")) {
    exit(); // Exit if accessed directly
}

return [
    'title'                     => ['meta_key' => '_petitioner_title', 'type' => 'text'],
    'email'                     => ['meta_key' => '_petitioner_email', 'type' => 'emails'],
    'cc_emails'                 => ['meta_key' => '_petitioner_cc_emails', 'type' => 'emails'],
    'subject'                   => ['meta_key' => '_petitioner_subject', 'type' => 'text'],
    'add_honeypot'              => ['meta_key' => '_petitioner_add_honeypot', 'type' => 'checkbox'],
    'from_field'                => ['meta_key' => '_petitioner_from_field', 'type' => 'text'],
    'from_name'                 => ['meta_key' => '_petitioner_from_name', 'type' => 'text'],
    'override_success_message'  => ['meta_key' => '_petitioner_override_success_message', 'type' => 'checkbox'],
    'success_message'           => ['meta_key' => '_petitioner_success_message', 'type' => 'wysiwyg'],
    'success_message_title'     => ['meta_key' => '_petitioner_success_message_title', 'type' => 'text'],
    'redirect_url'              => ['meta_key' => '_petitioner_redirect_url', 'type' => 'url'],
    'form_fields'               => ['meta_key' => '_petitioner_form_fields', 'type' => 'json_form_fields'],
    'field_order'               => ['meta_key' => '_petitioner_field_order', 'type' => 'json_array'],
];
