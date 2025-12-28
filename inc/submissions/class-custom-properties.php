<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Handles custom properties for submissions.
 * 
 * Extracts, sanitizes, and stores custom field data from form submissions.
 * Provides utilities to encode/decode JSON storage and hydrate submission objects.
 * 
 * @package AV_Petitioner
 * @subpackage Submissions
 * @since 0.8.0
 */
class AV_Petitioner_Custom_Properties
{
    public function __construct()
    {
        add_filter('av_petitioner_submission_data_pre_save', [$this, 'append_to_submission_data'], 10, 2);
        add_filter('av_petitioner_get_form_submissions_result', [$this, 'hydrate_submissions_in_result'], 10, 3);
    }

    public function append_to_submission_data($submission_data = [], $post_data = [])
    {
        if (empty($submission_data) || empty($post_data)) {
            av_ptr_error_log('Petitioner Custom Properties: Empty submission data or post data');
            return $submission_data;
        }

        $custom_properties = self::get_custom_properties($post_data);

        if (!empty($custom_properties)) {
            $submission_data['custom_properties'] = self::encode($custom_properties);
        }

        return $submission_data;
    }

    public function hydrate_submissions_in_result($result = [])
    {
        if (empty($result)) {
            return $result;
        }

        $result['submissions'] = self::hydrate_submissions($result['submissions']);
        return $result;
    }

    /**
     * Get all registered custom property types
     *
     * @return array
     */
    public static function get_property_types()
    {
        /**
         * Filter to register custom property types
         *
         * @param array $property_types Array of custom property types
         * @return array Array of custom property types
         */
        return apply_filters('petitioner_get_custom_property_types', []);
    }

    /**
     * Check if a key is a registered custom property
     *
     * @param string $key
     * @return bool
     */
    public static function is_custom_property($key)
    {
        return isset(self::get_property_types()[$key]);
    }

    /**
     * Extract and sanitize custom properties from POST data
     *
     * @param array $post_data
     * @return array
     */
    public static function get_custom_properties($post_data)
    {
        $custom_data = [];
        $property_types = self::get_property_types();

        foreach ($property_types as $key => $config) {
            $post_key = 'petitioner_' . $key;

            if (isset($post_data[$post_key])) {
                $sanitize = $config['sanitize_callback'] ?? 'sanitize_text_field';
                $custom_data[$key] = call_user_func($sanitize, wp_unslash($post_data[$post_key]));
            }
        }

        return $custom_data;
    }

    /**
     * Encode custom properties for storage
     *
     * @param array $data
     * @return string
     */
    public static function encode($data)
    {
        return wp_json_encode($data);
    }

    /**
     * Decode custom properties from storage
     *
     * @param string $json
     * @return array
     */
    public static function decode($json)
    {
        if (empty($json)) {
            return [];
        }
        return json_decode($json, true) ?: [];
    }

    /**
     * Convert custom properties from JSON to array
     *
     * @param object $submission
     * @return object
     */
    public static function hydrate_submission($submission)
    {
        if (!empty($submission->custom_properties)) {
            $custom = self::decode($submission->custom_properties);
            foreach ($custom as $key => $value) {
                $submission->{$key} = $value;
            }
            unset($submission->custom_properties);
        }
        return $submission;
    }

    /**
     * Hydrate an array of submissions
     *
     * @param array $submissions
     * @return array
     */
    public static function hydrate_submissions($submissions)
    {
        return array_map(function ($submission) {
            return self::hydrate_submission($submission);
        }, $submissions);
    }
}
