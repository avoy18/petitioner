<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

return [
    'show_letter'          => [
        'meta_key' => 'petitioner_show_letter',
        'type'     => 'checkbox'
    ],
    'show_title'           => [
        'meta_key' => 'petitioner_show_title',
        'type'     => 'checkbox'
    ],
    'show_goal'            => [
        'meta_key' => 'petitioner_show_goal',
        'type'     => 'checkbox'
    ],
    'custom_css'           => [
        'meta_key' => 'petitioner_custom_css',
        'type'     => 'textarea'
    ],
    'primary_color'        => [
        'meta_key' => 'petitioner_primary_color',
        'type'     => 'text'
    ],
    'dark_color'           => [
        'meta_key' => 'petitioner_dark_color',
        'type'     => 'text'
    ],
    'grey_color'           => [
        'meta_key' => 'petitioner_grey_color',
        'type'     => 'text'
    ],
    'enable_recaptcha'     => [
        'meta_key' => 'petitioner_enable_recaptcha',
        'type'     => 'checkbox'
    ],
    'recaptcha_site_key'   => [
        'meta_key' => 'petitioner_recaptcha_site_key',
        'type'     => 'text'
    ],
    'recaptcha_secret_key' => [
        'meta_key' => 'petitioner_recaptcha_secret_key',
        'type'     => 'text'
    ],
    'enable_hcaptcha'      => [
        'meta_key' => 'petitioner_enable_hcaptcha',
        'type'     => 'checkbox'
    ],
    'hcaptcha_site_key'    => [
        'meta_key' => 'petitioner_hcaptcha_site_key',
        'type'     => 'text'
    ],
    'hcaptcha_secret_key'  => [
        'meta_key' => 'petitioner_hcaptcha_secret_key',
        'type'     => 'text'
    ],
    'enable_turnstile'     => [
        'meta_key' => 'petitioner_enable_turnstile',
        'type'     => 'checkbox'
    ],
    'turnstile_site_key'   => [
        'meta_key' => 'petitioner_turnstile_site_key',
        'type'     => 'text'
    ],
    'turnstile_secret_key' => [
        'meta_key' => 'petitioner_turnstile_secret_key',
        'type'     => 'text'
    ],
    'enable_akismet'       => [
        'meta_key' => 'petitioner_enable_akismet',
        'type'     => 'checkbox'
    ],
    'form_fields'          => [
        'meta_key' => 'petitioner_form_fields',
        'type'     => 'text'
    ],
    'label_overrides'      => [
        'meta_key' => 'petitioner_label_overrides',
        'type'     => 'json'
    ]
];
