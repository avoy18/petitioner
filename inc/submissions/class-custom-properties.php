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
        /**
         * Filter the submission data before it is saved
         */
        add_filter('av_petitioner_submission_data_pre_save', [$this, 'filter_pre_save'], 10, 2);

        /**
         * Filter the submissions result before it is returned
         */
        add_filter('av_petitioner_get_form_submissions_result', [$this, 'filter_result_hydration'], 10, 1);

        /**
         * Handle editing a submission
         */
        add_filter('av_petitioner_submission_data_pre_update', [$this, 'filter_pre_update'], 10, 2);

        /**
         * Filter the form labels to add custom property labels
         */
        add_filter('av_petitioner_get_form_labels', [$this, 'filter_form_labels'], 10, 4);

        /**
         * Filter the CSV column headers and rows
         */
        add_filter('av_petitioner_get_csv_column_headers', [$this, 'filter_csv_column_headers'], 10, 2);
        add_filter('av_petitioner_get_csv_row', [$this, 'filter_csv_row'], 10, 2);
    }

    /**
     * Append custom properties to submission data
     *
     * @param array $submission_data - the submission data array that is being saved
     * @param array $post_data - the $_POST data passed to the form submission
     * @return array - the modified submission data array with custom properties appended
     */
    public function filter_pre_save($submission_data, $post_data)
    {
        if (empty($submission_data) || empty($post_data)) {
            av_ptr_error_log('Petitioner custom properties: empty submission data or post data. Skipping appending.');
            return $submission_data;
        }

        $custom_properties = self::get_custom_properties($post_data);

        if (!empty($custom_properties)) {
            $submission_data['custom_properties'] = self::encode($custom_properties);
        }

        return $submission_data;
    }

    /**
     * Hydrate submissions in result
     *
     * @param array $result - the result array that is being returned from the get_form_submissions method
     * @return array - the modified result array with submissions hydrated
     */
    public function filter_result_hydration($result)
    {
        if (empty($result) || !isset($result['submissions']) || !is_array($result['submissions'])) {
            av_ptr_error_log('Petitioner custom properties: empty result or submissions not an array. Skipping hydration.');
            return $result;
        }

        $result['submissions'] = self::hydrate_submissions($result['submissions']);
        return $result;
    }

    /**
     * Filter the submission data before it is updated
     * 
     * Remove the custom properties from the submission data and store them in the custom_properties field.
     *
     * @param array $submission_data - the submission data array that is being updated
     * @param array $post_data - the $_POST data passed to the form submission
     * @return array - the modified submission data array without the custom properties on the top level
     */
    public function filter_pre_update($submission_data, $post_data)
    {
        if (empty($submission_data) || empty($post_data)) {
            av_ptr_error_log('Petitioner custom properties: empty submission data or post data. Skipping appending.');
            return $submission_data;
        }

        $custom_properties = self::get_custom_properties($post_data, false);

        if (!empty($custom_properties)) {

            // Cleaning up data here from the unwanted custom properties
            foreach (array_keys($custom_properties) as $key) {
                unset($submission_data[$key]);
            }

            $submission_data['custom_properties'] = self::encode($custom_properties);
        }

        return $submission_data;
    }

    /**
     * Filter the form labels to add custom property labels
     * 
     * These will show up when calling av_petitioner_get_form_labels()
     *
     * @param array $labels - the labels array that is being returned from the get_form_labels method
     * @param int $form_id - the form id
     * @param array $label_ids - the label ids
     * @param array $fields_parsed - the fields parsed
     * @return array - the modified labels array with custom property labels appended
     */
    public function filter_form_labels($labels, $form_id, $label_ids, $fields_parsed)
    {
        if (empty($fields_parsed) || $form_id === 0) {
            av_ptr_error_log('Petitioner custom properties: required properties are missing. Skipping filtering form labels.');
            return $labels;
        }

        $property_types = self::get_property_types();
        $property_keys = array_keys($property_types);

        foreach ($property_keys as $key) {
            if (isset($fields_parsed[$key]) && !empty($fields_parsed[$key]['label'])) {
                $labels[$key] = $fields_parsed[$key]['label'];
            }
        }

        return $labels;
    }

    /**
     * Filter the CSV column headers to add custom property labels
     *
     * @param array $headers - the headers array that is being returned from the get_csv_column_headers method
     * @param int $form_id - the form id
     * @return array - the modified headers array with custom property labels appended
     */
    public function filter_csv_column_headers($headers, $form_id)
    {
        if (empty($headers) || $form_id === 0) {
            av_ptr_error_log('Petitioner custom properties: empty headers or form id. Skipping filtering column headers.');
            return $headers;
        }

        $property_types = self::get_property_types();
        $property_keys = array_keys($property_types);

        $property_labels = av_petitioner_get_form_labels(
            $form_id,
            $property_keys
        );

        foreach ($property_keys as $key) {
            if (isset($property_labels[$key]) && !empty($property_labels[$key])) {
                $headers[] = $property_labels[$key];
            } else {
                av_ptr_error_log(sprintf(
                    'Petitioner custom properties: custom property key "%s" has no label. Skipping.',
                    $key
                ));
                $headers[] = $key;
            }
        }

        return $headers;
    }

    /**
     * Filter the CSV row to add custom property values
     *
     * @param array $row - the row array that is being returned from the get_csv_row method
     * @param object $submission - the submission object
     * @return array - the modified row array with custom property values appended
     */
    public function filter_csv_row($row, $submission)
    {
        if (empty($row) || $submission === null) {
            av_ptr_error_log('Petitioner custom properties: empty row or submission. Skipping filtering CSV row.');
            return $row;
        }

        $property_types = self::get_property_types();
        $property_keys = array_keys($property_types);

        foreach ($property_keys as $key) {
            $row[] = isset($submission->{$key}) ? $submission->{$key} : '';
        }

        return $row;
    }

    /**
     * A utility to get all registered custom property types
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
     * A utility to extract and sanitize custom properties from POST data
     *
     * @param array $post_data
     * @return array
     */
    public static function get_custom_properties($post_data, $use_prefix = true)
    {
        $custom_data = [];
        $property_types = self::get_property_types();

        foreach ($property_types as $key => $config) {
            // POST data comes in either with (frontend) or without (admin) the 'petitioner_' prefix, so need this to be flexible.
            $post_key = $use_prefix ? 'petitioner_' . $key : $key;

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
     * A utility to encode custom properties for storage in JSON format
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
     * A utility to decode custom properties from storage
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
     * A utility to convert custom properties from JSON to array
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
     * A utility to hydrate an array of submissions
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
