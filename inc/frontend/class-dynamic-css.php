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
        if (!is_array($settings)) {
            $settings = [];
        }

        if (!isset($settings['default_values']) || !is_array($settings['default_values'])) {
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
     * Safely validates a visual option against the schema.
     *
     * @param string $value      The value to validate.
     * @param string $schema_key The schema category key (e.g. 'border_radius').
     * @return bool True if valid, false otherwise.
     */
    private static function is_valid_option($value, $schema_key)
    {
        if (!is_string($value) || $value === '') {
            return false;
        }

        $schema = self::get_schema_options();

        if (!isset($schema[$schema_key]) || !is_array($schema[$schema_key])) {
            return false;
        }

        return array_key_exists($value, $schema[$schema_key]);
    }

    /**
     * Helper to get a setting either from overrides or the database.
     *
     * @param string $key The database option key.
     * @param array $overrides Optional array of values keyed without the petitioner_ prefix.
     * @return mixed
     */
    private static function get_setting($key, $overrides = [])
    {
        $override_key = str_replace('petitioner_', '', $key);
        if (isset($overrides[$override_key])) {
            return $overrides[$override_key];
        }
        return get_option($key, '');
    }

    /**
     * Generates all dynamic CSS styles based on saved options or overrides.
     *
     * @param array $overrides Optional overrides for live preview.
     * @return string The generated CSS string.
     */
    public static function generate_css($overrides = [])
    {
        $dynamic_styles = '';
        $dynamic_styles .= self::get_color_styles($overrides);
        $dynamic_styles .= self::get_border_radius_styles($overrides);
        $dynamic_styles .= self::get_font_styles($overrides);
        $dynamic_styles .= self::get_spacing_styles($overrides);
        $dynamic_styles .= self::get_border_styles($overrides);
        $dynamic_styles .= self::get_input_size_styles($overrides);

        $custom_css = '';
        if (!empty($dynamic_styles)) {
            $custom_css .= '.petitioner {' . $dynamic_styles . ' } ';
        }

        $custom_css .= self::get_setting('petitioner_custom_css', $overrides);

        return $custom_css;
    }

    /**
     * Generates CSS variables for color settings.
     *
     * @param array $overrides Optional overrides.
     * @return string The color CSS styles.
     */
    private static function get_color_styles($overrides = [])
    {
        $styles = '';

        $primary = sanitize_hex_color(self::get_setting('petitioner_primary_color', $overrides));
        if (!empty($primary)) {
            $styles .= '--ptr-color-primary: ' . $primary . '!important;';
        }

        $dark = sanitize_hex_color(self::get_setting('petitioner_dark_color', $overrides));
        if (!empty($dark)) {
            $styles .= '--ptr-color-dark: ' . $dark . '!important;';
        }

        $grey = sanitize_hex_color(self::get_setting('petitioner_grey_color', $overrides));
        if (!empty($grey)) {
            $styles .= '--ptr-color-grey: ' . $grey . '!important;';
        }

        return $styles;
    }

    /**
     * Generates CSS variables for border radius settings.
     *
     * @param array $overrides Optional overrides.
     * @return string The border radius CSS styles.
     */
    private static function get_border_radius_styles($overrides = [])
    {
        $styles = '';
        $radius = self::get_setting('petitioner_border_radius', $overrides);

        if (self::is_valid_option($radius, 'border_radius')) {
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
     * @param array $overrides Optional overrides.
     * @return string The font size CSS styles.
     */
    private static function get_font_styles($overrides = [])
    {
        $styles = '';

        $base = self::get_setting('petitioner_base_font_size', $overrides);
        if (self::is_valid_option($base, 'base_font_size')) {
            $styles .= '--ptr-label-font-size: var(--ptr-fs-' . $base . ')!important;';
        }

        $btn = self::get_setting('petitioner_button_font_size', $overrides);
        if (self::is_valid_option($btn, 'button_font_size')) {
            $styles .= '--ptr-btn-font-size: var(--ptr-fs-' . $btn . ')!important;';
        }

        return $styles;
    }

    /**
     * Generates CSS variables for field spacing settings.
     *
     * @param array $overrides Optional overrides.
     * @return string The field spacing CSS styles.
     */
    private static function get_spacing_styles($overrides = [])
    {
        $styles = '';
        $spacing = self::get_setting('petitioner_field_spacing', $overrides);

        if (self::is_valid_option($spacing, 'field_spacing')) {
            $styles .= '--ptr-input-margin-bottom: var(--ptr-spacer-' . $spacing . ')!important;';
        }

        return $styles;
    }

    /**
     * Generates CSS variables for input border width settings.
     *
     * @param array $overrides Optional overrides.
     * @return string The input border width CSS styles.
     */
    private static function get_border_styles($overrides = [])
    {
        $styles = '';
        $width = self::get_setting('petitioner_input_border_width', $overrides);

        if (self::is_valid_option($width, 'input_border_width')) {
            $styles .= '--ptr-input-border-width: ' . $width . '!important;';
        }

        return $styles;
    }

    /**
     * Generates CSS variables for input size settings.
     *
     * @param array $overrides Optional overrides.
     * @return string The input size CSS styles.
     */
    private static function get_input_size_styles($overrides = [])
    {
        $styles = '';
        $size = self::get_setting('petitioner_input_size', $overrides);

        if (empty($size) || !self::is_valid_option($size, 'input_size')) {
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
