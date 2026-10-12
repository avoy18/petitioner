<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * TranslatePress integration for the Petitioner plugin.
 *
 * The public form is left in the source language so TranslatePress can translate
 * the page itself. Emails are sent later, so those strings are translated here.
 *
 * @since 0.8.7
 */
class AV_Petitioner_TranslatePress
{
    public function __construct()
    {
        if (!function_exists('trp_translate')) {
            return;
        }

        add_filter('av_petitioner_translate_string', [$this, 'translate_string'], 10, 4);
        add_filter('av_petitioner_locale', [$this, 'locale'], 10, 2);
        add_filter('av_petitioner_current_lang', [$this, 'current_lang']);
    }

    /**
     * Translate a string TranslatePress cannot see in the page HTML.
     *
     * Page text is left alone so the visual editor can translate it. Emails pass
     * a language. Redirects and the success message do not, so those use the
     * current TranslatePress language, the same way the other adapters do.
     *
     * @param string      $value
     * @param string      $name
     * @param int         $form_id
     * @param string|null $lang TranslatePress language code, such as de_DE.
     * @return string
     */
    public function translate_string($value, $name, $form_id, $lang = null)
    {
        if (!is_string($value) || $value === '' || !function_exists('trp_translate')) {
            return $value;
        }

        if (!is_string($lang) || $lang === '') {
            if (!$this->is_absent_from_the_page($name)) {
                return $value;
            }

            $lang = $this->current_lang('');

            if ($lang === '') {
                $posted = isset($_POST['lang']) ? wp_unslash($_POST['lang']) : '';
                $lang = AV_Petitioner_Translations::sanitize_lang($posted);
            }
        }

        if (!is_string($lang) || $lang === '') {
            return $value;
        }

        $translated = trp_translate($value, $lang, false);

        return is_string($translated) && $translated !== '' ? $translated : $value;
    }

    /**
     * Strings that are not rendered as page text.
     *
     * @param string $name
     * @return bool
     */
    private function is_absent_from_the_page($name)
    {
        return in_array($name, [
            'redirect_url',
            'confirm_success_url',
            'confirm_error_url',
            'success_message_title',
            'success_message',
        ], true);
    }

    /**
     * Locale for a stored TranslatePress language code.
     *
     * The code is already a locale, such as de_DE.
     *
     * @since 0.8.7
     *
     * @param string $locale
     * @param string $lang
     * @return string
     */
    public function locale($locale, $lang)
    {
        if (!is_string($lang) || $lang === '') {
            return $locale;
        }

        return $lang;
    }

    /**
     * Current TranslatePress language code for the hidden form field.
     *
     * @param string $lang
     * @return string
     */
    public function current_lang($lang)
    {
        $current = $GLOBALS['TRP_LANGUAGE'] ?? '';

        return is_string($current) && $current !== '' ? $current : $lang;
    }
}
