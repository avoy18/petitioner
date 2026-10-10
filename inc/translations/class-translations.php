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
        add_filter('av_petitioner_label', [$this, 'translate_label'], 10, 2);

        /**
         * Persist the posted language on the submission and pass it to mailers.
         */
        add_filter('av_petitioner_submission_data_pre_save', [$this, 'store_lang'], 20, 2);
        add_filter('av_petitioner_mailer_settings', [$this, 'add_lang_to_mailer'], 10, 2);
        add_filter('av_petitioner_confirmation_mailer_settings', [$this, 'add_lang_to_confirmation_mailer'], 10, 2);
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

        $overrides = json_decode(get_option('petitioner_label_overrides', '{}'), true);

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
     * @param int $form_id
     * @param string $name
     * @param string $value
     * @return string
     */
    public function maybe_translate($form_id, $name, $value)
    {
        if (!is_string($value) || $value === '') {
            return $value;
        }

        /**
         * Filter to translate a string with the translator plugin.
         * 
         * @param string $value The string to translate.
         * @param string $name The name of the string.
         * @param int $form_id The form ID.
         * @return string The translated string.
         */
        $translated = apply_filters('av_petitioner_translate_string', $value, $name, $form_id);

        return is_string($translated) ? $translated : $value;
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
