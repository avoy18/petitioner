<?php

if (! defined('ABSPATH')) {
    exit;
}

/**
 * Submissions UI class
 */
class AV_Petitioner_Submissions_UI
{
    /**
     * Get the default settings of the submissions list
     * 
     * Shared by the shortcode, the block and any direct caller so the
     * defaults are only declared once. Boolean values are accepted either as
     * native booleans or as the strings a shortcode attribute produces.
     * 
     * @return array The default settings
     * @since 0.8.7
     */
    static public function get_defaults()
    {
        return [
            'per_page'          => 20,
            'style'             => 'simple',
            'fields'            => 'name,country,submitted_at',
            'show_pagination'   => true,
            'hide_page_numbers' => false,
        ];
    }

    /**
     * Render the submissions list
     * 
     * @param int $form_id The form ID
     * @param array $atts The attributes
     * @return string The submissions list
     * @since 0.8.7
     */
    static public function render_submissions_list($form_id = 0, $atts = [])
    {
        $form_id = absint($form_id);

        if (!$form_id) {
            return '';
        }

        $defaults = self::get_defaults();
        $atts     = array_merge($defaults, $atts);

        $available_styles = self::get_available_styles();
        $available_fields = self::get_available_fields();

        $per_page   = absint($atts['per_page']);
        $style      = in_array($atts['style'], $available_styles, true) ? $atts['style'] : $defaults['style'];

        // Remove spaces and split fields
        $fields_raw = str_replace(' ', '', $atts['fields']);
        $fields_arr = explode(',', $fields_raw);

        // Filter only available fields
        $fields = array_values(array_intersect($fields_arr, $available_fields));

        $show_pagination = filter_var($atts['show_pagination'], FILTER_VALIDATE_BOOLEAN);
        $hide_page_numbers = filter_var($atts['hide_page_numbers'], FILTER_VALIDATE_BOOLEAN);

        $settings = [
            'form_id'           => $form_id,
            'per_page'          => $per_page,
            'style'             => $style,
            'fields'            => implode(',', $fields),
            'show_pagination'   => $show_pagination,
            'hide_page_numbers' => $hide_page_numbers
        ];

        ob_start();
        echo '<div class="petitioner petitioner-submissions petitioner-submissions--' . esc_attr($style) . '"';
        echo ' data-ptr-settings="' . esc_attr(json_encode($settings)) . '"';
        echo '>';
        echo '</div>';

        return ob_get_clean();
    }

    /**
     * Get the available styles
     * 
     * @return array The available styles
     */
    static public function get_available_styles()
    {
        $styles = ['simple', 'table'];

        /**
         * Filter the available styles that are displayed in the submissions list
         * 
         * @param array $styles The available styles that are displayed in the submissions list
         * @return array The available styles that are displayed in the submissions list
         */
        return apply_filters('av_petitioner_submissions_styles', $styles);
    }

    /**
     * Get the available styles as label/value pairs for a select control.
     *
     * Labels come from AV_Petitioner_Labels::get_submission_style_labels(). Styles
     * without a registered label fall back to a humanised slug.
     *
     * @return array List of ['label' => string, 'value' => string]
     */
    static public function get_style_choices()
    {
        $labels  = AV_Petitioner_Labels::get_submission_style_labels();
        $choices = [];

        foreach (self::get_available_styles() as $style) {
            $choices[] = [
                'label' => isset($labels[$style]) ? $labels[$style] : ucwords(str_replace(['-', '_'], ' ', $style)),
                'value' => $style,
            ];
        }

        return $choices;
    }

    /**
     * Get the available fields
     * 
     * @return array The available fields
     */
    static public function get_available_fields()
    {
        $available_fields = AV_Petitioner_Submissions_Controller::get_public_fields();
        array_unshift($available_fields, 'name'); // Add name to the beginning of the array

        /**
         * Filter the available fields that are displayed in the submissions list
         * 
         * @param array $available_fields The available fields that are displayed in the submissions list
         * @return array The available fields that are displayed in the submissions list
         */
        return apply_filters('av_petitioner_available_fields_shortcode', $available_fields);
    }
}
