<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * WPML integration for the Petitioner plugin.
 * 
 * @since 0.8.7
 */
class AV_Petitioner_WPML
{
    public function __construct()
    {
        if (!class_exists('SitePress')) {
            return;
        }

        add_action('av_petitioner_register_translation', [$this, 'register_string'], 10, 3);
        add_filter('av_petitioner_translate_string', [$this, 'translate_string'], 10, 3);
        add_filter('av_petitioner_translations_register_form_args', [$this, 'register_form_args']);
        add_filter('av_petitioner_current_lang', [$this, 'current_lang']);
    }

    /**
     * Register a string with WPML.
     * 
     * @param int $form_id The form ID.
     * @param string $name The name of the string.
     * @param string $value The string to register.
     */
    public function register_string($form_id, $name, $value)
    {
        if (!is_string($value) || $value === '') {
            return;
        }

        do_action(
            'wpml_register_single_string',
            AV_Petitioner_Translations::string_group($form_id),
            AV_Petitioner_Translations::string_name($form_id, $name),
            $value
        );
    }

    /**
     * Translate a string with WPML.
     * 
     * @param string $value The string to translate.
     * @param string $name The name of the string.
     * @param int $form_id The form ID.
     * @return string The translated string.
     */
    public function translate_string($value, $name, $form_id)
    {
        if (!is_string($value) || $value === '') {
            return $value;
        }

        $translated = apply_filters(
            'wpml_translate_single_string',
            $value,
            AV_Petitioner_Translations::string_group($form_id),
            AV_Petitioner_Translations::string_name($form_id, $name)
        );

        return is_string($translated) ? $translated : $value;
    }

    /**
     * Filter to modify the arguments passed to get_posts() when registering all forms.
     * 
     * @param array $args The arguments passed to get_posts().
     * @return array The modified arguments.
     */
    public function register_form_args($args)
    {
        if (!is_array($args)) {
            return $args;
        }

        $args['suppress_filters'] = true;
        return $args;
    }

    /**
     * Current language slug for the hidden form field (ru, not ru_RU).
     *
     * @param string $lang
     * @return string
     */
    public function current_lang($lang)
    {
        $current = apply_filters('wpml_current_language', '');

        return is_string($current) && $current !== '' ? $current : $lang;
    }
}
