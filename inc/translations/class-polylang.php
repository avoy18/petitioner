<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Polylang integration for the Petitioner plugin.
 * 
 * @since 0.8.7
 */
class AV_Petitioner_Polylang
{
    public function __construct()
    {
        if (!function_exists('pll_register_string')) {
            return;
        }

        add_action('av_petitioner_register_translation', [$this, 'register_string'], 10, 4);
        add_filter('av_petitioner_translate_string', [$this, 'translate_string'], 10, 3);
        add_filter('av_petitioner_translations_register_form_args', [$this, 'register_form_args']);
        add_filter('av_petitioner_current_lang', [$this, 'current_lang']);
    }

    /**
     * Register a translation string with Polylang.
     * 
     * @param int $form_id
     * @param string $name
     * @param string $value
     * @param boolean $multiline
     */
    public function register_string($form_id, $name, $value, $multiline = false)
    {
        if (!is_string($value) || $value === '' || !function_exists('pll_register_string')) {
            return;
        }

        pll_register_string(
            self::string_name($form_id, $name),
            $value,
            self::string_group($form_id),
            (bool) $multiline
        );
    }

    /**
     * Translate a string with Polylang.
     * 
     * @param string $value
     * @param string $name
     * @param int $form_id
     * @return string
     */
    public function translate_string($value, $name, $form_id)
    {
        if (!is_string($value) || $value === '' || !function_exists('pll__')) {
            return $value;
        }

        $translated = pll__($value);

        return is_string($translated) ? $translated : $value;
    }

    /**
     * Polylang can hide posts in other languages. Empty lang = all forms.
     *
     * @param array $args
     * @return array
     */
    public function register_form_args($args)
    {
        if (!is_array($args)) {
            av_ptr_error_log('av_petitioner_translations_register_form_args: Non-array query args passed: ' . print_r($args, true));
            return $args;
        }

        $args['lang'] = '';
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
        if (!function_exists('pll_current_language')) {
            return $lang;
        }

        $current = pll_current_language();

        return is_string($current) && $current !== '' ? $current : $lang;
    }

    /**
     * @param int $form_id
     * @return string
     */
    private static function string_group($form_id)
    {
        $form_id = absint($form_id);

        return $form_id ? sprintf('Petitioner #%d', $form_id) : 'Petitioner Labels';
    }

    /**
     * @param int    $form_id
     * @param string $name
     * @return string
     */
    private static function string_name($form_id, $name)
    {
        $form_id = absint($form_id);

        return $form_id ? $form_id . ':' . $name : $name;
    }
}
