<?php
/**
 * Form Builder Fields Registry
 *
 * Defines the default and draggable fields available in the form builder.
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class AV_Petitioner_Field_Registry {

    /**
     * Cache for retrieved fields.
     */
    private static $cached_fields = null;

    /**
     * Get default core fields.
     */
    public static function get_defaults() {
        return [
            'fname' => [
                'fieldKey'    => 'fname',
                'type'        => 'text',
                'fieldName'   => AV_Petitioner_Labels::get('fname', null, true),
                'label'       => AV_Petitioner_Labels::get('fname', null, true),
                'placeholder' => AV_Petitioner_Labels::get('fname_placeholder', null, true),
                'required'    => true,
                'removable'   => false,
            ],
            'lname' => [
                'fieldKey'    => 'lname',
                'type'        => 'text',
                'fieldName'   => AV_Petitioner_Labels::get('lname', null, true),
                'label'       => AV_Petitioner_Labels::get('lname', null, true),
                'placeholder' => AV_Petitioner_Labels::get('lname_placeholder', null, true),
                'required'    => true,
                'removable'   => false,
            ],
            'email' => [
                'fieldKey'    => 'email',
                'type'        => 'email',
                'fieldName'   => AV_Petitioner_Labels::get('email', null, true),
                'label'       => AV_Petitioner_Labels::get('email', null, true),
                'placeholder' => AV_Petitioner_Labels::get('email_placeholder', null, true),
                'required'    => true,
                'removable'   => false,
            ],
            'submit' => [
                'fieldKey'    => 'submit',
                'type'        => 'submit',
                'fieldName'   => AV_Petitioner_Labels::get('submit_button', null, true),
                'label'       => AV_Petitioner_Labels::get('submit_button_label', null, true),
                'required'    => true,
                'removable'   => false,
            ],
        ];
    }

    /**
     * Get draggable fields.
     */
    public static function get_draggable() {
        return [
            [
                'fieldKey'    => 'phone',
                'type'        => 'tel',
                'fieldName'   => AV_Petitioner_Labels::get('phone', null, true),
                'label'       => AV_Petitioner_Labels::get('phone', null, true),
                'value'       => '',
                'required'    => false,
                'removable'   => true,
                'description' => AV_Petitioner_Labels::get('phone_desc', null, true),
            ],
            [
                'fieldKey'    => 'date_of_birth',
                'type'        => 'date',
                'fieldName'   => AV_Petitioner_Labels::get('date_of_birth', null, true),
                'label'       => AV_Petitioner_Labels::get('date_of_birth', null, true),
                'value'       => '',
                'required'    => false,
                'removable'   => true,
                'description' => AV_Petitioner_Labels::get('date_of_birth_desc', null, true),
            ],
            [
                'fieldKey'    => 'country',
                'type'        => 'select',
                'fieldName'   => AV_Petitioner_Labels::get('country', null, true),
                'label'       => AV_Petitioner_Labels::get('country', null, true),
                'required'    => false,
                'removable'   => true,
                'options'     => [],
            ],
            [
                'fieldKey'    => 'street_address',
                'type'        => 'text',
                'fieldName'   => AV_Petitioner_Labels::get('street_address', null, true),
                'label'       => AV_Petitioner_Labels::get('street_address', null, true),
                'value'       => '',
                'required'    => false,
                'removable'   => true,
            ],
            [
                'fieldKey'    => 'city',
                'type'        => 'text',
                'fieldName'   => AV_Petitioner_Labels::get('city', null, true),
                'label'       => AV_Petitioner_Labels::get('city', null, true),
                'value'       => '',
                'required'    => false,
                'removable'   => true,
            ],
            [
                'fieldKey'    => 'postal_code',
                'type'        => 'text',
                'fieldName'   => AV_Petitioner_Labels::get('postal_code', null, true),
                'label'       => AV_Petitioner_Labels::get('postal_code', null, true),
                'value'       => '',
                'required'    => false,
                'removable'   => true,
            ],
            [
                'fieldKey'    => 'accept_tos',
                'type'        => 'checkbox',
                'fieldName'   => AV_Petitioner_Labels::get('accept_tos_checkbox', null, true),
                'label'       => AV_Petitioner_Labels::get('accept_tos', null, true),
                'defaultValue'=> false,
                'required'    => true,
                'removable'   => true,
            ],
            [
                'fieldKey'    => 'hide_name',
                'type'        => 'checkbox',
                'fieldName'   => AV_Petitioner_Labels::get('hide_name_checkbox', null, true),
                'label'       => AV_Petitioner_Labels::get('hide_name', null, true),
                'defaultValue'=> false,
                'required'    => false,
                'removable'   => true,
                'description' => AV_Petitioner_Labels::get('hide_name_desc', null, true),
            ],
            [
                'fieldKey'    => 'newsletter',
                'type'        => 'checkbox',
                'fieldName'   => AV_Petitioner_Labels::get('newsletter_checkbox', null, true),
                'label'       => AV_Petitioner_Labels::get('newsletter', null, true),
                'defaultValue'=> false,
                'required'    => false,
                'removable'   => true,
                'description' => AV_Petitioner_Labels::get('newsletter_desc', null, true),
            ],
            [
                'fieldKey'    => 'bcc',
                'type'        => 'checkbox',
                'fieldName'   => AV_Petitioner_Labels::get('bcc_yourself_checkbox', null, true),
                'label'       => AV_Petitioner_Labels::get('bcc_yourself', null, true),
                'defaultValue'=> false,
                'required'    => false,
                'removable'   => true,
                'description' => AV_Petitioner_Labels::get('bcc_yourself_desc', null, true),
            ],
            [
                'fieldKey'    => 'legal',
                'type'        => 'wysiwyg',
                'fieldName'   => AV_Petitioner_Labels::get('legal_text', null, true),
                'label'       => '',
                'value'       => AV_Petitioner_Labels::get('legal_default_val', null, true),
                'required'    => false,
                'removable'   => true,
            ],
            [
                'fieldKey'    => 'comments',
                'type'        => 'textarea',
                'fieldName'   => AV_Petitioner_Labels::get('comments', null, true),
                'label'       => AV_Petitioner_Labels::get('comments', null, true),
                'placeholder' => '',
                'required'    => false,
                'removable'   => true,
            ],
        ];
    }

    /**
     * Get all registered form fields.
     *
     * @return array Array containing 'defaults' and 'draggable' fields.
     */
    public static function get_all() {
        if (self::$cached_fields !== null) {
            return self::$cached_fields;
        }

        self::$cached_fields = apply_filters('av_petitioner_builder_fields', [
            'defaults'  => self::get_defaults(),
            'draggable' => self::get_draggable(),
        ]);

        return self::$cached_fields;
    }

    /**
     * Get a specific field by its key.
     * Searches both defaults and draggables.
     */
    public static function get( $field_key ) {
        $fields = self::get_all();

        // Check defaults first (they are keyed by fieldKey)
        if ( isset( $fields['defaults'][ $field_key ] ) ) {
            return $fields['defaults'][ $field_key ];
        }

        // Search draggables (which is an indexed array of objects)
        foreach ( $fields['draggable'] as $field ) {
            if ( isset( $field['fieldKey'] ) && $field['fieldKey'] === $field_key ) {
                return $field;
            }
        }

        return null; // Not found
    }
}
