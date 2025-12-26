<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Handles custom properties for submissions
 * 
 * @package AV_Petitioner
 * @subpackage Submissions
 * @since 0.8.0
 */
class AV_Petitioner_Custom_Properties
{
    /**
     * Get all registered custom property types
     *
     * @return array
     */
    public static function get_property_types()
    {
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
    public static function extract_from_post($post_data)
    {
        $custom_data = [];
        $property_types = self::get_property_types();

        foreach ($property_types as $key => $config) {
            $post_key = 'petitioner_' . $key;

            if (isset($post_data[$post_key])) {
                $sanitize = $config['sanitize'] ?? 'sanitize_text_field';
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
     * Merge custom properties into submission object
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
