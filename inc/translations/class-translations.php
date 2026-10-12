<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Base translation logic for Petitioner.
 * 
 * Doesnt actually do the translation, just registers the strings and hooks into the right places.
 */
class AV_Petitioner_Translations
{
    /**
     * Whether switch_locale() changed the locale and still needs a restore.
     *
     * @var bool
     */
    private $locale_switched = false;

    public function __construct()
    {
        /**
         * This part registers strings for the future translation by the translator plugins.
         */
        add_action('save_post_petitioner-petition', [$this, 'register_form'], 20);
        add_action('admin_init', [$this, 'register_all_forms']);
        add_action('admin_init', [$this, 'register_label_overrides']);
        add_action('add_option_petitioner_label_overrides', [$this, 'register_label_overrides']);
        add_action('update_option_petitioner_label_overrides', [$this, 'register_label_overrides']);

        /**
         * These filters translate the fields on the frontend.
         */
        add_filter('av_petitioner_form_field', [$this, 'translate_field'], 20, 3);
        add_filter('av_petitioner_title', [$this, 'translate_title'], 10, 2);
        add_filter('av_petitioner_subject', [$this, 'translate_subject'], 10, 2);
        add_filter('av_petitioner_letter', [$this, 'translate_letter'], 10, 2);
        add_filter('av_petitioner_success_message_title', [$this, 'translate_success_message_title'], 10, 2);
        add_filter('av_petitioner_success_message', [$this, 'translate_success_message'], 10, 2);
        add_filter('av_petitioner_redirect_url', [$this, 'translate_redirect_url'], 10, 4);
        add_filter('av_petitioner_select_option_label', [$this, 'translate_select_option_label'], 10, 4);
        add_filter('av_petitioner_label', [$this, 'translate_label'], 10, 2);
        add_filter('av_petitioner_email_string', [$this, 'translate_email_string'], 10, 4);
        add_filter('av_petitioner_info_settings', [$this, 'add_translation_integrations']);

        /**
         * Persist the posted language on the submission and pass it to mailers.
         */
        add_filter('av_petitioner_submission_data_pre_save', [$this, 'store_lang'], 20, 2);
        add_filter('av_petitioner_mailer_settings', [$this, 'add_lang_to_mailer'], 10, 2);
        add_filter('av_petitioner_confirmation_mailer_settings', [$this, 'add_lang_to_confirmation_mailer'], 10, 2);
        add_action('av_petitioner_before_email_prep', [$this, 'switch_email_locale'], 10, 2);
        add_action('av_petitioner_after_send_ty_email', [$this, 'restore_locale']);
        add_action('av_petitioner_after_send_rep_email', [$this, 'restore_locale']);
    }

    /**
     * Register all existing forms with the translator plugin.
     */
    public function register_all_forms()
    {
        if (!has_action('av_petitioner_register_translation')) {
            return;
        }

        $register_form_args = [
            'post_type'      => 'petitioner-petition',
            'post_status'    => ['publish', 'draft', 'private'],
            'posts_per_page' => -1,
            'fields'         => 'ids',
        ];

        /**
         * Filter to modify the arguments passed to get_posts() when registering all forms.
         * 
         * @since 0.8.7
         * @param array $args The arguments passed to get_posts().
         * @return array The modified arguments.
         * 
         */
        $filtered_args = apply_filters('av_petitioner_translations_register_form_args', $register_form_args);

        if (is_array($filtered_args)) {
            $register_form_args = $filtered_args;
        } else {
            av_ptr_error_log(
                'av_petitioner_translations_register_form_args must return an array. Falling back to defaults. Got: ' . gettype($filtered_args)
            );
        }

        $form_ids = get_posts($register_form_args);

        foreach ($form_ids as $form_id) {
            $this->register_form($form_id);
        }
    }

    /**
     * Register site-wide label overrides with the translator plugin.
     */
    public function register_label_overrides()
    {
        if (!has_action('av_petitioner_register_translation')) {
            return;
        }

        $raw = get_option('petitioner_label_overrides', '{}');

        if (!is_string($raw)) {
            return;
        }

        $overrides = json_decode($raw, true);

        if (!is_array($overrides)) {
            return;
        }

        foreach ($overrides as $key => $value) {
            $this->register_string(0, 'label.' . $key, $value);
        }
    }

    /**
     * Register the form fields with the translator plugin.
     * 
     * @param int $form_id
     */
    public function register_form($form_id)
    {
        if (wp_is_post_revision($form_id) || wp_is_post_autosave($form_id)) {
            return;
        }

        $form_id = absint($form_id);

        $this->register_string($form_id, 'title', get_post_meta($form_id, '_petitioner_title', true));
        $this->register_string($form_id, 'subject', get_post_meta($form_id, '_petitioner_subject', true));
        $this->register_string($form_id, 'letter', get_post_meta($form_id, '_petitioner_letter', true), true);
        $this->register_string($form_id, 'success_message_title', get_post_meta($form_id, '_petitioner_success_message_title', true));
        $this->register_string($form_id, 'success_message', get_post_meta($form_id, '_petitioner_success_message', true), true);
        $this->register_string($form_id, 'ty_email_subject', get_post_meta($form_id, '_petitioner_ty_email_subject', true));
        $this->register_string($form_id, 'ty_email', get_post_meta($form_id, '_petitioner_ty_email', true), true);
        $this->register_string($form_id, 'redirect_url', get_post_meta($form_id, '_petitioner_redirect_url', true));
        $this->register_string($form_id, 'confirm_success_url', get_post_meta($form_id, '_petitioner_confirm_success_url', true));
        $this->register_string($form_id, 'confirm_error_url', get_post_meta($form_id, '_petitioner_confirm_error_url', true));

        $fields = get_post_meta($form_id, '_petitioner_form_fields', true);
        $fields = is_string($fields) ? json_decode($fields, true) : $fields;

        if (!is_array($fields)) {
            return;
        }

        foreach ($fields as $key => $field) {

            if (!is_array($field)) {
                continue;
            }

            if (!empty($field['label'])) {
                $this->register_string($form_id, "field.{$key}.label", $field['label']);
            }
            if (!empty($field['placeholder'])) {
                $this->register_string($form_id, "field.{$key}.placeholder", $field['placeholder']);
            }
            if (($field['type'] ?? '') === 'wysiwyg' && !empty($field['value'])) {
                $this->register_string($form_id, "field.{$key}.value", $field['value'], true);
            }
            if (($field['type'] ?? '') === 'select' && $key !== 'country' && is_array($field['options'] ?? null)) {
                foreach ($field['options'] as $option) {
                    if (is_string($option)) {
                        $value = $label = $option;
                    } elseif (is_array($option)) {
                        $value = isset($option['value']) && is_string($option['value']) ? $option['value'] : '';
                        $label = isset($option['label']) && is_string($option['label']) ? $option['label'] : '';

                        if ($value === '') {
                            $value = $label;
                        }

                        if ($label === '') {
                            $label = $value;
                        }
                    } else {
                        continue;
                    }

                    if ($label === '') {
                        continue;
                    }

                    $this->register_string($form_id, "field.{$key}.option.{$value}", $label);
                }
            }
        }
    }

    /**
     * Register a translation string with the translator plugin.
     * 
     * @param int $form_id
     * @param string $name
     * @param string $value
     * @param boolean $multiline
     */
    public function register_string($form_id, $name, $value, $multiline = false)
    {
        if (!is_string($value) || $value === '') {
            return;
        }

        do_action('av_petitioner_register_translation', $form_id, $name, $value, $multiline); // hook to be implemented by translator plugins
    }

    /**
     * Polylang / WPML group name.
     *
     * @param int $form_id
     * @return string
     */
    public static function string_group($form_id)
    {
        $form_id = absint($form_id);

        return $form_id ? sprintf('Petitioner #%d', $form_id) : 'Petitioner Labels';
    }

    /**
     * Polylang / WPML string name.
     *
     * @param int    $form_id
     * @param string $name
     * @return string
     */
    public static function string_name($form_id, $name)
    {
        $form_id = absint($form_id);

        return $form_id ? $form_id . ':' . $name : $name;
    }

    /**
     * Translate the petition title.
     *
     * @param string $title
     * @param int    $form_id
     * @return string
     */
    public function translate_title($title, $form_id)
    {
        return $this->maybe_translate($form_id, 'title', $title);
    }

    /**
     * Translate the petition subject.
     *
     * @param string $subject
     * @param int    $form_id
     * @return string
     */
    public function translate_subject($subject, $form_id)
    {
        return $this->maybe_translate($form_id, 'subject', $subject);
    }

    /**
     * Translate the petition letter.
     *
     * @param string $letter
     * @param int    $form_id
     * @return string
     */
    public function translate_letter($letter, $form_id)
    {
        return $this->maybe_translate($form_id, 'letter', $letter);
    }

    /**
     * Translate the custom success message title.
     *
     * @param string $title
     * @param int    $form_id
     * @return string
     */
    public function translate_success_message_title($title, $form_id)
    {
        return $this->maybe_translate($form_id, 'success_message_title', $title);
    }

    /**
     * Translate the custom success message.
     *
     * @param string $message
     * @param int    $form_id
     * @return string
     */
    public function translate_success_message($message, $form_id)
    {
        return $this->maybe_translate($form_id, 'success_message', $message);
    }

    /**
     * Translate a saved redirect URL for the current language.
     *
     * @since 0.8.7
     *
     * @param string       $url
     * @param int          $form_id
     * @param string       $name
     * @param object|array|null $submission Signature, when this redirect follows one. Its lang is used.
     * @return string
     */
    public function translate_redirect_url($url, $form_id, $name, $submission = null)
    {
        $lang = self::lang_from_submission($submission);

        return $this->maybe_translate($form_id, $name, $url, $lang !== '' ? $lang : null);
    }

    /**
     * Translate the visible text of a select choice.
     *
     * Custom choices use the translation plugin. Country names use gettext.
     *
     * @since 0.8.7
     *
     * @param string      $label
     * @param string      $key
     * @param int         $form_id
     * @param string|null $value Saved value. Legacy choices use the label text.
     * @return string
     */
    public function translate_select_option_label($label, $key, $form_id, $value = null)
    {
        if (!is_string($label) || $label === '') {
            return $label;
        }

        if ($key === 'country') {
            $code = is_string($value) && $value !== '' ? $value : $label;
            $codes = av_petitioner_get_country_codes();
            $name = $codes[$code] ?? '';

            if ($name === '') {
                return $label;
            }

            $translated = __($name, 'petitioner');

            return is_string($translated) && $translated !== '' ? $translated : $name;
        }

        $option_id = is_string($value) && $value !== '' ? $value : $label;

        return $this->maybe_translate($form_id, "field.{$key}.option.{$option_id}", $label);
    }

    /**
     * Translate a site-wide label override.
     *
     * @param string $label
     * @param string $key
     * @return string
     */
    public function translate_label($label, $key)
    {
        if (is_admin() && !wp_doing_ajax()) {
            return $label;
        }

        return $this->maybe_translate(0, 'label.' . $key, $label);
    }

    /**
     * Switch gettext to the locale for the email that is about to be built.
     *
     * @since 0.8.7
     *
     * @param AV_Petitioner_Mailer $mailer
     * @param string               $lang
     */
    public function switch_email_locale($mailer, $lang)
    {
        $this->switch_locale(is_string($lang) ? $lang : '');
    }

    /**
     * Switch gettext to the locale for a language slug.
     *
     * @param string $lang
     */
    public function switch_locale($lang)
    {
        if (!is_string($lang) || $lang === '' || $this->locale_switched) {
            return;
        }

        /**
         * Locale for a language slug.
         *
         * @since 0.8.7
         *
         * @param string $locale
         * @param string $lang
         */
        $locale = apply_filters('av_petitioner_locale', '', $lang);

        if (!is_string($locale) || $locale === '') {
            return;
        }

        $this->locale_switched = switch_to_locale($locale);

        if ($this->locale_switched) {
            AV_Petitioner_Labels::clear_cache();
        }
    }

    /**
     * Restore the locale after an email is built.
     *
     * @since 0.8.7
     */
    public function restore_locale()
    {
        if (!$this->locale_switched) {
            return;
        }

        restore_previous_locale();
        AV_Petitioner_Labels::clear_cache();
        $this->locale_switched = false;
    }

    /**
     * Translate an email string into a specific language slug.
     *
     * An empty slug keeps the source text.
     *
     * @param string $value
     * @param string $name
     * @param int    $form_id
     * @param string $lang
     * @return string
     */
    public function translate_email_string($value, $name, $form_id, $lang)
    {
        if (!is_string($lang) || $lang === '') {
            return $value;
        }

        return $this->maybe_translate($form_id, $name, $value, $lang);
    }

    /**
     * Translate the field right before it renders.
     *
     * @param array  $field
     * @param string $key
     * @param int    $form_id
     * @return array
     */
    public function translate_field($field, $key, $form_id)
    {
        if (!is_array($field)) {
            return $field;
        }

        if (!empty($field['label'])) {
            $field['label'] = $this->maybe_translate($form_id, "field.{$key}.label", $field['label']);
        }
        if (!empty($field['placeholder'])) {
            $field['placeholder'] = $this->maybe_translate($form_id, "field.{$key}.placeholder", $field['placeholder']);
        }
        if (($field['type'] ?? '') === 'wysiwyg' && !empty($field['value'])) {
            $field['value'] = $this->maybe_translate($form_id, "field.{$key}.value", $field['value']);
        }

        return $field;
    }

    /**
     * Prepare the string for translation. "Maybe" because relies on a translation plugin.
     * 
     * @param int         $form_id
     * @param string      $name
     * @param string      $value
     * @param string|null $lang Language slug. Null uses the current language.
     * @return string
     */
    public function maybe_translate($form_id, $name, $value, $lang = null)
    {
        if (!is_string($value) || $value === '') {
            return $value;
        }

        /**
         * Filter to translate a string with the translator plugin.
         * 
         * @param string      $value The string to translate.
         * @param string      $name The name of the string.
         * @param int         $form_id The form ID.
         * @param string|null $lang Language slug, or null for the current language.
         * @return string The translated string.
         */
        $translated = apply_filters('av_petitioner_translate_string', $value, $name, $form_id, $lang);

        return is_string($translated) ? $translated : $value;
    }

    /**
     * Tell the settings screen which translation plugins are active.
     *
     * @param mixed $info
     * @return mixed
     */
    public function add_translation_integrations($info)
    {
        if (!is_array($info)) {
            return $info;
        }

        $info['translation_integrations'] = [
            'polylang' => AV_Petitioner_Polylang::is_active(),
            'wpml' => AV_Petitioner_WPML::is_active(),
            'translatepress' => function_exists('trp_translate'),
        ];

        return $info;
    }

    /**
     * Store the posted language slug on the submission.
     *
     * @param array $data
     * @param array $post
     * @return array
     */
    public function store_lang($data, $post)
    {
        if (!is_array($data) || !is_array($post)) {
            return $data;
        }

        $lang = self::sanitize_lang(isset($post['lang']) ? wp_unslash($post['lang']) : '');

        if ($lang === '') {
            return $data;
        }

        $data['lang'] = $lang;

        return $data;
    }

    /**
     * Add the stored (or posted) language to mailer settings.
     *
     * @param array $settings
     * @param array $data
     * @return array
     */
    public function add_lang_to_mailer($settings, $data)
    {
        if (!is_array($settings)) {
            return $settings;
        }

        $lang = self::lang_from_submission($data);

        if ($lang === '') {
            $lang = self::sanitize_lang(isset($_POST['lang']) ? wp_unslash($_POST['lang']) : '');
        }

        $settings['lang'] = $lang;

        return $settings;
    }

    /**
     * Add the stored language to confirmation mailer settings.
     *
     * @param array  $settings
     * @param object $submission
     * @return array
     */
    public function add_lang_to_confirmation_mailer($settings, $submission)
    {
        if (!is_array($settings)) {
            return $settings;
        }

        $settings['lang'] = self::lang_from_submission($submission);

        return $settings;
    }

    /**
     * @param mixed $lang
     * @return string
     */
    public static function sanitize_lang($lang)
    {
        if (!is_string($lang)) {
            return '';
        }

        $lang = sanitize_text_field($lang);

        return is_string($lang) ? $lang : '';
    }

    /**
     * @param array|object $submission
     * @return string
     */
    public static function lang_from_submission($submission)
    {
        if (is_object($submission)) {
            return isset($submission->lang) && is_string($submission->lang) ? $submission->lang : '';
        }

        if (is_array($submission)) {
            return isset($submission['lang']) && is_string($submission['lang']) ? $submission['lang'] : '';
        }

        return '';
    }
}
