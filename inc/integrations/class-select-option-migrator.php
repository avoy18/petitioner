<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Turns older select choices into value and label pairs.
 *
 * A string uses that text for both. A country name becomes its code, and the label is the country name.
 */
class AV_Petitioner_Select_Option_Migrator
{
    public static function migrate_to_key_value_split()
    {
        add_filter('av_petitioner_form_fields', [self::class, 'migrate_form_fields'], 20, 2);
        add_filter('av_petitioner_form_fields_admin', [self::class, 'migrate_form_fields'], 20, 2);
        add_filter('av_petitioner_select_field_options', [self::class, 'select_field_options'], 10, 2);
        add_filter('av_petitioner_select_option', [self::class, 'normalize_option'], 10, 2);
        add_filter('av_petitioner_normalize_country', [self::class, 'country_code']);
        add_filter('av_petitioner_csv_field_value', [self::class, 'csv_field_value'], 10, 2);
    }

    /**
     * @param mixed $form_fields
     * @param int   $form_id
     * @return mixed
     */
    public static function migrate_form_fields($form_fields, $form_id)
    {
        if (!is_array($form_fields)) {
            return $form_fields;
        }

        foreach ($form_fields as $key => $field) {
            if (!is_array($field) || ($field['type'] ?? '') !== 'select' || !is_array($field['options'] ?? null)) {
                continue;
            }

            $options = [];

            foreach ($field['options'] as $option) {
                $pair = self::normalize_option($option, $key);

                if (is_array($pair) && $pair['value'] !== '') {
                    $options[] = $pair;
                }
            }

            $form_fields[$key]['options'] = $options;
        }

        return $form_fields;
    }

    /**
     * Older country fields have no saved choices. Fill those with value and label pairs.
     *
     * @param mixed  $options
     * @param string $field_key
     * @return mixed
     */
    public static function select_field_options($options, $field_key)
    {
        if ($field_key !== 'country' || !is_array($options) || $options !== []) {
            return $options;
        }

        return av_petitioner_get_countries();
    }

    /**
     * @param mixed  $option
     * @param string $field_key
     * @return array{value: string, label: string}|mixed
     */
    public static function normalize_option($option, $field_key = '')
    {
        if (is_string($option)) {
            $value = $label = $option;
        } elseif (is_array($option)) {
            $value = is_string($option['value'] ?? null) ? $option['value'] : '';
            $label = is_string($option['label'] ?? null) ? $option['label'] : '';
            $value = $value !== '' ? $value : $label;
            $label = $label !== '' ? $label : $value;
        } else {
            return $option;
        }

        if ($field_key === 'country') {
            $code = self::country_code($value);

            $label_for_code = av_petitioner_get_country_label($code);

            if ($label_for_code !== '') {
                $value = $code;
                $label = $label_for_code;
            }
        }

        return [
            'value' => $value,
            'label' => $label,
        ];
    }

    /**
     * The country column in a CSV shows the country name. Other fields stay as saved.
     *
     * @param mixed  $value
     * @param string $field
     * @return mixed
     */
    public static function csv_field_value($value, $field)
    {
        if ($field !== 'country') {
            return $value;
        }

        $label = av_petitioner_get_country_label(self::country_code($value));

        if ($label !== '') {
            return $label;
        }

        return is_string($value) ? $value : '';
    }

    /**
     * @param mixed $value
     * @return string
     */
    public static function country_code($value)
    {
        if (!is_string($value)) {
            return '';
        }

        $value = trim($value);

        if ($value === '') {
            return '';
        }

        $codes = av_petitioner_get_country_codes();
        $code = strtolower($value);

        if (isset($codes[$code])) {
            return $code;
        }

        $by_name = array_flip($codes);

        if (isset($by_name[$value])) {
            return $by_name[$value];
        }

        foreach ($codes as $country_code => $name) {
            $translated = __($name, 'petitioner');

            if (is_string($translated) && $translated === $value) {
                return $country_code;
            }
        }

        $map = self::country_code_map();

        return $map[$value] ?? $value;
    }

    /**
     * Translated country name => code, for installed languages other than the current one.
     *
     * @return array<string, string>
     */
    private static function country_code_map()
    {
        static $map = null;

        if (is_array($map)) {
            return $map;
        }

        $map = [];
        $codes = av_petitioner_get_country_codes();
        $locales = function_exists('get_available_languages') ? get_available_languages() : [];

        if (!is_array($locales)) {
            return $map;
        }

        $current = function_exists('determine_locale') ? determine_locale() : get_locale();

        foreach ($locales as $locale) {
            if (!is_string($locale) || $locale === '' || $locale === $current) {
                continue;
            }

            if (!switch_to_locale($locale)) {
                continue;
            }

            foreach ($codes as $code => $name) {
                $translated = translate($name, 'petitioner');

                if (is_string($translated) && $translated !== '' && $translated !== $name) {
                    $map[$translated] = $code;
                }
            }

            restore_previous_locale();
        }

        return $map;
    }
}
