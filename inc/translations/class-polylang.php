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
        add_action('av_petitioner_register_translation', [$this, 'register_string'], 10, 4);
        add_filter('av_petitioner_translate_string', [$this, 'translate_string'], 10, 3);
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
            $form_id . ':' . $name,
            $value,
            sprintf('Petitioner #%d', $form_id),
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
}
