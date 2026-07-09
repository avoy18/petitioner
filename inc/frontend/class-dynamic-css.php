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
    const ALLOWED_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];
    const ALLOWED_BORDER_WIDTHS = ['0px', '1px', '2px', '3px'];

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

    private static function get_border_radius_styles()
    {
        $styles = '';
        $radius = get_option('petitioner_border_radius', '');

        if (!empty($radius) && in_array($radius, self::ALLOWED_SIZES, true)) {
            $styles .= '--ptr-input-border-radius: var(--ptr-border-radius-' . $radius . ')!important;';
            $styles .= '--ptr-button-border-radius: var(--ptr-border-radius-' . $radius . ')!important;';
            
            // Limit wrapper radius to 'lg' so it doesn't become a pill
            $wrapper = $radius === 'full' ? 'lg' : $radius;
            $styles .= '--ptr-wrapper-radius: var(--ptr-border-radius-' . $wrapper . ')!important;';
        }

        return $styles;
    }

    private static function get_font_styles()
    {
        $styles = '';
        
        $base = get_option('petitioner_base_font_size', '');
        if (!empty($base) && in_array($base, self::ALLOWED_SIZES, true)) {
            $styles .= '--ptr-label-font-size: var(--ptr-fs-' . $base . ')!important;';
        }

        $btn = get_option('petitioner_button_font_size', '');
        if (!empty($btn) && in_array($btn, self::ALLOWED_SIZES, true)) {
            $styles .= '--ptr-btn-font-size: var(--ptr-fs-' . $btn . ')!important;';
        }

        return $styles;
    }

    private static function get_spacing_styles()
    {
        $styles = '';
        $spacing = get_option('petitioner_field_spacing', '');

        if (!empty($spacing) && in_array($spacing, self::ALLOWED_SIZES, true)) {
            $styles .= '--ptr-input-margin-bottom: var(--ptr-spacer-' . $spacing . ')!important;';
        }

        return $styles;
    }

    private static function get_border_styles()
    {
        $styles = '';
        $width = get_option('petitioner_input_border_width', '');

        if (!empty($width) && in_array($width, self::ALLOWED_BORDER_WIDTHS, true)) {
            $styles .= '--ptr-input-border-width: ' . $width . '!important;';
        }

        return $styles;
    }

    private static function get_input_size_styles()
    {
        $styles = '';
        $size = get_option('petitioner_input_size', '');

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
