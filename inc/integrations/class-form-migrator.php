<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Class AV_Petitioner_Migrator
 *
 * This class handles the migration of the form fields from the old Petitioner plugin to the new one.
 */
class AV_Petitioner_Form_Migrator
{
    public static function migrate_form_fields_to_builder_filters()
    {
        add_filter('av_petitioner_form_fields', ['AV_Petitioner_Form_Migrator', 'migrate_form_fields'], 5, 2);
        add_filter('av_petitioner_form_fields_admin', ['AV_Petitioner_Form_Migrator', 'migrate_form_fields'], 5, 2);
    }

    public static function migrate_form_fields($form_fields, $form_id)
    {

        // Decode if string
        if (is_string($form_fields)) {
            $form_fields = json_decode($form_fields, true);
        }

        // If empty or invalid, generate defaults
        if (empty($form_fields) || !is_array($form_fields)) {

            $show_country           = get_post_meta($form_id, '_petitioner_show_country', true);
            $send_to_representative = get_post_meta($form_id, '_petitioner_send_to_representative', true);
            $add_consent_checkbox   = get_post_meta($form_id, '_petitioner_add_consent_checkbox', true);
            $add_legal_text         = get_post_meta($form_id, '_petitioner_add_legal_text', true);
            $legal_text             = get_post_meta($form_id, '_petitioner_legal_text', true);
            $consent_text           = get_post_meta($form_id, '_petitioner_consent_text', true);
            $field_order            = [];

            $defaults = [];

            $defaults['fname'] = [
                'type'        => 'text',
                'fieldName'   => __('First name', 'petitioner'),
                'label'       => __('First name', 'petitioner'),
                'placeholder' => '',
                'required'    => true,
                'removable'   => false,
            ];

            $defaults['lname'] = [
                'type'        => 'text',
                'fieldName'   => __('Last name', 'petitioner'),
                'label'       => __('Last name', 'petitioner'),
                'placeholder' => '',
                'required'    => true,
                'removable'   => false,
            ];

            $defaults['email'] = [
                'type'        => 'email',
                'fieldName'   => __('Your email', 'petitioner'),
                'label'       => __('Your email', 'petitioner'),
                'placeholder' => '',
                'required'    => true,
                'removable'   => false,
            ];

            if ($show_country) {
                $defaults['country'] = [
                    'key'        => 'country',
                    'type'       => 'select',
                    'fieldName'  => __('Country', 'petitioner'),
                    'label'      => __('Country', 'petitioner'),
                    'required'   => false,
                    'removable'  => true,
                ];
            }

            if ($add_consent_checkbox) {
                $defaults['accept_tos'] = [
                    'key'           => 'accept_tos',
                    'type'          => 'checkbox',
                    'fieldName'     => __('Terms of service checkbox', 'petitioner'),
                    'label'         => !empty($consent_text)
                        ? $consent_text
                        : __('By submitting this form, I agree to the terms of service', 'petitioner'),
                    'defaultValue'  => false,
                    'required'      => true,
                    'removable'     => true,
                ];
            }

            if ($add_legal_text) {
                $defaults['legal'] = [
                    'key'        => 'legal',
                    'type'       => 'wysiwyg',
                    'fieldName'  => __('Legal text', 'petitioner'),
                    'label'      => '',
                    'value'      => $legal_text,
                    'required'   => false,
                    'removable'  => true,
                ];
            }

            $defaults['submit'] = [
                'type'       => 'submit',
                'fieldName'  => __('Submit button', 'petitioner'),
                'label'      => __('Sign this petition', 'petitioner'),
                'required'   => true,
                'removable'  => false,
            ];

            $form_fields = $defaults;
            $field_order = array_keys($defaults);

            update_post_meta($form_id, '_petitioner_form_fields', wp_json_encode($form_fields));
            update_post_meta($form_id, '_petitioner_field_order', wp_json_encode($field_order));
        }

        return $form_fields;
    }

    /**
     * Go through each petition and manually migrate forms on activation
     */
    public static function migrate_all_forms_to_builder()
    {
        $forms = get_posts([
            'post_type'   => 'petitioner-petition',
            'numberposts' => 1000,
            'post_status' => 'any',
        ]);

        foreach ($forms as $form) {
            $form_id = $form->ID;
            $existing_fields = get_post_meta($form_id, '_petitioner_form_fields', true);
            self::migrate_form_fields($existing_fields, $form_id);
        }
    }
}
