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

    /**
     * Append custom properties to submission data
     *
     * @param array $submission_data - the submission data array that is being saved
     * @param array $post_data - the $_POST data passed to the form submission
     * @return array - the modified submission data array with custom properties appended
     */
    public function append_to_submission_data($submission_data = [], $post_data = [])
    {
        if (empty($submission_data) || empty($post_data)) {
            av_ptr_error_log('Petitioner custom properties: empty submission data or post data. Skipping appending.');
            return $submission_data;
        }

        $custom_properties = self::get_custom_properties($post_data);

        if (!empty($custom_properties)) {
            $submission_data['custom_properties'] = self::encode($custom_properties);
        } else {
            av_ptr_error_log('Petitioner custom properties: no custom properties found. Skipping appending.');
        }

        return $submission_data;
    }

    /**
     * Hydrate submissions in result
     *
     * @param array $result - the result array that is being returned from the get_form_submissions method
     * @return array - the modified result array with submissions hydrated
     */
    public function hydrate_submissions_in_result($result = [])
    {
        if (empty($result) || !isset($result['submissions']) || !is_array($result['submissions'])) {
            av_ptr_error_log('Petitioner custom properties: empty result or submissions not an array. Skipping hydration.');
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
        return apply_filters('av_petitioner_get_custom_property_types', []);
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

                if (!is_callable($sanitize)) {
                    $sanitize = 'sanitize_text_field';
                    av_ptr_error_log(sprintf(
                        'Petitioner custom properties: custom property key "%s" has an invalid sanitization callback. Using default sanitization.',
                        $key
                    ));
                }

                $custom_data[$key] = call_user_func($sanitize, wp_unslash($post_data[$post_key]));
            }
        }

        return $custom_data;
    }

    /**
     * Encode custom properties for storage in JSON format.
     * Validate the data to be in the right format and log an error if it fails.
     *
     * @param array $data - the custom properties array to encode
     * @return string - the encoded custom properties in JSON format
     */
    private static function encode($data)
    {
        if (!is_array($data)) {
            av_ptr_error_log('Petitioner custom properties: data is not an array. Returning empty string.');
            return '';
        }

        $encoded = wp_json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if ($encoded === false) {
            av_ptr_error_log('Petitioner custom properties: failed to encode custom properties. Returning empty string.');
            return '';
        }

        return $encoded;
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
                if (isset($submission->{$key})) {
                    av_ptr_error_log(sprintf(
                        'Petitioner: custom property key "%s" conflicts with existing submission field. Skipping to prevent data loss.',
                        $key
                    ));
                    continue;
                }

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
