<?php
/**
 * Form Builder Fields Registry
 *
 * Defines the default and draggable fields available in the form builder.
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class AV_Petitioner_Builder_Fields {

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
                'fieldName'   => __('First name', 'petitioner'),
                'label'       => __('First name', 'petitioner'),
                'placeholder' => __('John', 'petitioner'),
                'required'    => true,
                'removable'   => false,
            ],
            'lname' => [
                'fieldKey'    => 'lname',
                'type'        => 'text',
                'fieldName'   => __('Last name', 'petitioner'),
                'label'       => __('Last name', 'petitioner'),
                'placeholder' => __('Smith', 'petitioner'),
                'required'    => true,
                'removable'   => false,
            ],
            'email' => [
                'fieldKey'    => 'email',
                'type'        => 'email',
                'fieldName'   => __('Your email', 'petitioner'),
                'label'       => __('Your email', 'petitioner'),
                'placeholder' => __('smith@example.com', 'petitioner'),
                'required'    => true,
                'removable'   => false,
            ],
            'submit' => [
                'fieldKey'    => 'submit',
                'type'        => 'submit',
                'fieldName'   => __('Submit button', 'petitioner'),
                'label'       => __('Sign this petition', 'petitioner'),
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
                'fieldName'   => __('Phone #', 'petitioner'),
                'label'       => __('Phone #', 'petitioner'),
                'value'       => '',
                'required'    => false,
                'removable'   => true,
                'description' => __('Allows users to enter their phone number. The pattern is set to allow only digits.', 'petitioner'),
            ],
            [
                'fieldKey'    => 'date_of_birth',
                'type'        => 'date',
                'fieldName'   => __('Date of Birth', 'petitioner'),
                'label'       => __('Date of Birth', 'petitioner'),
                'value'       => '',
                'required'    => false,
                'removable'   => true,
                'description' => __('Allows users to enter their date of birth using a date picker.', 'petitioner'),
            ],
            [
                'fieldKey'    => 'country',
                'type'        => 'select',
                'fieldName'   => __('Country', 'petitioner'),
                'label'       => __('Country', 'petitioner'),
                'required'    => false,
                'removable'   => true,
                'options'     => [],
            ],
            [
                'fieldKey'    => 'street_address',
                'type'        => 'text',
                'fieldName'   => __('Street address', 'petitioner'),
                'label'       => __('Street address', 'petitioner'),
                'value'       => '',
                'required'    => false,
                'removable'   => true,
            ],
            [
                'fieldKey'    => 'city',
                'type'        => 'text',
                'fieldName'   => __('City', 'petitioner'),
                'label'       => __('City', 'petitioner'),
                'value'       => '',
                'required'    => false,
                'removable'   => true,
            ],
            [
                'fieldKey'    => 'postal_code',
                'type'        => 'text',
                'fieldName'   => __('Postal code', 'petitioner'),
                'label'       => __('Postal code', 'petitioner'),
                'value'       => '',
                'required'    => false,
                'removable'   => true,
            ],
            [
                'fieldKey'    => 'accept_tos',
                'type'        => 'checkbox',
                'fieldName'   => 'Terms of service checkbox',
                'label'       => __('By submitting this form, I agree to the terms of service', 'petitioner'),
                'defaultValue'=> false,
                'required'    => true,
                'removable'   => true,
            ],
            [
                'fieldKey'    => 'hide_name',
                'type'        => 'checkbox',
                'fieldName'   => __('Keep me anonymous checkbox', 'petitioner'),
                'label'       => __('Keep my name anonymous', 'petitioner'),
                'defaultValue'=> false,
                'required'    => false,
                'removable'   => true,
                'description' => __('Allows users to opt-in to keep their name anonymous in public signature lists.', 'petitioner'),
            ],
            [
                'fieldKey'    => 'newsletter',
                'type'        => 'checkbox',
                'fieldName'   => __('Newsletter opt-in checkbox', 'petitioner'),
                'label'       => __('Subscribe to newsletter', 'petitioner'),
                'defaultValue'=> false,
                'required'    => false,
                'removable'   => true,
                'description' => __('Allows users to opt-in to receive newsletter updates.', 'petitioner'),
            ],
            [
                'fieldKey'    => 'bcc',
                'type'        => 'checkbox',
                'fieldName'   => __('BCC checkbox', 'petitioner'),
                'label'       => __('BCC me on the email', 'petitioner'),
                'defaultValue'=> false,
                'required'    => false,
                'removable'   => true,
                'description' => __('Allows users to opt-in to send a copy of the petition to the email address entered in this form. Only works if you send emails to the representative.', 'petitioner'),
            ],
            [
                'fieldKey'    => 'legal',
                'type'        => 'wysiwyg',
                'fieldName'   => __('Legal text', 'petitioner'),
                'label'       => '',
                'value'       => __('By submitting, you agree to our terms.', 'petitioner'),
                'required'    => false,
                'removable'   => true,
            ],
            [
                'fieldKey'    => 'comments',
                'type'        => 'textarea',
                'fieldName'   => __('Comments', 'petitioner'),
                'label'       => __('Comments', 'petitioner'),
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
