<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class AV_Petitioner_Dynamic_CSS
 *
 * Handles the extraction, validation, and generation of dynamic CSS
 * based on the user's visual settings.
 *
 * @since 0.8.5
 */
class AV_Petitioner_Dynamic_CSS
{
    /**
     * Initializes the class and hooks into WordPress.
     *
     * @return void
     */
    public static function init()
    {
        add_filter('av_petitioner_info_settings', [self::class, 'inject_schema_options']);
    }

    /**
     * Injects the visual options schema into the localized settings array.
     *
     * @param array $settings The frontend settings array.
     * @return array Modified settings array.
     */
    public static function inject_schema_options($settings)
    {
        if (!isset($settings['default_values'])) {
            $settings['default_values'] = [];
        }
        $settings['default_values']['visual_options'] = self::get_schema_options();
        return $settings;
    }

    /**
     * Retrieves the schema for available visual options.
     *
     * @return array List of available options for dropdowns.
     */
    public static function get_schema_options()
    {
        static $schema = null;

        if ($schema !== null) {
            return $schema;
        }

        $schema = [
            'border_radius' => [
                ''     => __('Default (8px)', 'petitioner'),
                'xs'   => __('Sharp (2px)', 'petitioner'),
                'sm'   => __('Slightly Rounded (4px)', 'petitioner'),
                'md'   => __('Rounded (8px)', 'petitioner'),
                'lg'   => __('Very Rounded (16px)', 'petitioner'),
                'full' => __('Pill (999px)', 'petitioner'),
            ],
            'base_font_size' => [
                ''   => __('Default (14px)', 'petitioner'),
                'xs' => __('Extra Small (12px)', 'petitioner'),
                'sm' => __('Small (14px)', 'petitioner'),
                'md' => __('Medium (16px)', 'petitioner'),
            ],
            'button_font_size' => [
                ''   => __('Default (18px)', 'petitioner'),
                'xs' => __('Extra Small (12px)', 'petitioner'),
                'sm' => __('Small (14px)', 'petitioner'),
                'md' => __('Medium (16px)', 'petitioner'),
                'lg' => __('Large (18px)', 'petitioner'),
            ],
            'input_border_width' => [
                ''    => __('Default', 'petitioner'),
                '0px' => __('0px (None)', 'petitioner'),
                '1px' => __('1px', 'petitioner'),
                '2px' => __('2px', 'petitioner'),
                '3px' => __('3px', 'petitioner'),
            ],
            'field_spacing' => [
                ''   => __('Default (8px)', 'petitioner'),
                'xs' => __('Extra Small (4px)', 'petitioner'),
                'sm' => __('Small (8px)', 'petitioner'),
                'md' => __('Medium (16px)', 'petitioner'),
                'lg' => __('Large (24px)', 'petitioner'),
                'xl' => __('Extra Large (32px)', 'petitioner'),
            ],
            'input_size' => [
                ''   => __('Default (~62px)', 'petitioner'),
                'sm' => __('Small (32px)', 'petitioner'),
                'md' => __('Regular (40px)', 'petitioner'),
                'lg' => __('Large (48px)', 'petitioner'),
                'xl' => __('Extra Large (~62px)', 'petitioner'),
            ],
        ];

        /**
         * Filters the schema for visual options.
         *
         * @param array $schema The default schema options.
         */
        $schema = apply_filters('av_petitioner_visual_options_schema', $schema);

        return $schema;
    }

    /**
     * Generates all dynamic CSS styles based on saved options.
     *
     * @return string The generated CSS string.
     */
    public static function generate_css()
    {
        $dynamic_styles = '';
        $dynamic_styles .= self::get_color_styles();
        $dynamic_styles .= self::get_border_radius_styles();
        $dynamic_styles .= self::get_font_styles();
        $dynamic_styles .= self::get_spacing_styles();
        $dynamic_styles .= self::get_border_styles();
        $dynamic_styles .= self::get_input_size_styles();

        $custom_css = '';
        if (!empty($dynamic_styles)) {
            $custom_css .= '.petitioner {' . $dynamic_styles . ' } ';
        }

        $custom_css .= get_option('petitioner_custom_css', '');

        return $custom_css;
    }

    /**
     * Generates CSS variables for color settings.
     *
     * @return string The color CSS styles.
     */
    private static function get_color_styles()
    {
        $styles = '';

        $primary = sanitize_hex_color(get_option('petitioner_primary_color', ''));
        if (!empty($primary)) {
            $styles .= '--ptr-color-primary: ' . $primary . '!important;';
        }

        $dark = sanitize_hex_color(get_option('petitioner_dark_color', ''));
        if (!empty($dark)) {
            $styles .= '--ptr-color-dark: ' . $dark . '!important;';
        }

        $grey = sanitize_hex_color(get_option('petitioner_grey_color', ''));
        if (!empty($grey)) {
            $styles .= '--ptr-color-grey: ' . $grey . '!important;';
        }

        return $styles;
    }

    /**
     * Generates CSS variables for border radius settings.
     *
     * @return string The border radius CSS styles.
     */
    private static function get_border_radius_styles()
    {
        $styles = '';
        $radius = get_option('petitioner_border_radius', '');

        $schema = self::get_schema_options();
        if (!empty($radius) && array_key_exists($radius, $schema['border_radius'])) {
            $styles .= '--ptr-input-border-radius: var(--ptr-border-radius-' . $radius . ')!important;';
            $styles .= '--ptr-button-border-radius: var(--ptr-border-radius-' . $radius . ')!important;';

            // Limit wrapper radius to 'lg' so it doesn't become a pill
            $wrapper = $radius === 'full' ? 'lg' : $radius;
            $styles .= '--ptr-wrapper-radius: var(--ptr-border-radius-' . $wrapper . ')!important;';
        }

        return $styles;
    }

    /**
     * Generates CSS variables for font size settings.
     *
     * @return string The font size CSS styles.
     */
    private static function get_font_styles()
    {
        $styles = '';

        $base = get_option('petitioner_base_font_size', '');
        $schema = self::get_schema_options();
        if (!empty($base) && array_key_exists($base, $schema['base_font_size'])) {
            $styles .= '--ptr-label-font-size: var(--ptr-fs-' . $base . ')!important;';
        }

        $btn = get_option('petitioner_button_font_size', '');
        if (!empty($btn) && array_key_exists($btn, $schema['button_font_size'])) {
            $styles .= '--ptr-btn-font-size: var(--ptr-fs-' . $btn . ')!important;';
        }

        return $styles;
    }

    /**
     * Generates CSS variables for field spacing settings.
     *
     * @return string The field spacing CSS styles.
     */
    private static function get_spacing_styles()
    {
        $styles = '';
        $spacing = get_option('petitioner_field_spacing', '');

        $schema = self::get_schema_options();
        if (!empty($spacing) && array_key_exists($spacing, $schema['field_spacing'])) {
            $styles .= '--ptr-input-margin-bottom: var(--ptr-spacer-' . $spacing . ')!important;';
        }

        return $styles;
    }

    /**
     * Generates CSS variables for input border width settings.
     *
     * @return string The input border width CSS styles.
     */
    private static function get_border_styles()
    {
        $styles = '';
        $width = get_option('petitioner_input_border_width', '');

        $schema = self::get_schema_options();
        if (!empty($width) && array_key_exists($width, $schema['input_border_width'])) {
            $styles .= '--ptr-input-border-width: ' . $width . '!important;';
        }

        return $styles;
    }

    /**
     * Generates CSS variables for input size settings.
     *
     * @return string The input size CSS styles.
     */
    private static function get_input_size_styles()
    {
        $styles = '';
        $size = get_option('petitioner_input_size', '');

        $schema = self::get_schema_options();
        if (!empty($size) && !array_key_exists($size, $schema['input_size'])) {
            return $styles;
        }

        switch ($size) {
            case 'sm':
                $styles .= '--ptr-input-line-height: 24px !important;';
                $styles .= '--ptr-input-spacing-y: 4px !important;';
                $styles .= '--ptr-label-line-height: 1.4 !important;';
                break;
            case 'md':
                $styles .= '--ptr-input-line-height: 24px !important;';
                $styles .= '--ptr-input-spacing-y: 8px !important;';
                break;
            case 'lg':
                $styles .= '--ptr-input-line-height: 32px !important;';
                $styles .= '--ptr-input-spacing-y: 8px !important;';
                break;
            case 'xl':
                $styles .= '--ptr-input-line-height: 40px !important;';
                $styles .= '--ptr-input-spacing-y: 0.7rem !important;';
                break;
        }

        return $styles;
    }
}
