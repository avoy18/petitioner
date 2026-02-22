<?php

/**
 * Handles CSV column configuration resolution and sanitization.
 */
class AV_Petitioner_Column_Config
{
    /**
     * Fields hidden by default in the column configuration.
     * @var string[]
     */
    public static $DEFAULT_HIDDEN_FIELDS = ['id', 'form_id', 'bcc', 'keep_name_anonymous', 'accept_tos', 'confirmation_token', 'approval_status'];

    /**
     * Resolve user-provided payload into export-ready config.
     *
     * @param int   $form_id     Petition (form) ID.
     * @param array $raw_payload Decoded payload array from the request.
     * @return array{
     *   visible_columns: array<int, string>,
     *   labels: array<string, string>,
     *   mappings: array<string, array<int, array{raw: string, mapped: string}>>
     * }
     */
    public static function resolve($form_id, $raw_payload)
    {
        $allowed_fields = self::get_exportable_fields();
        $defaults = self::get_default_labels($form_id, $allowed_fields);
        $payload = self::sanitize_payload_array($raw_payload, $allowed_fields);

        $labels = $defaults;
        $mappings = [];
        $hidden = [];

        foreach ($payload as $item) {
            $field_id = $item['id'];
            $overrides = $item['overrides'] ?? [];

            if (!empty($overrides['hidden'])) {
                $hidden[$field_id] = true;
            }

            if (isset($overrides['label'])) {
                $labels[$field_id] = $overrides['label'];
            }

            if (!empty($overrides['mappings'])) {
                $mappings[$field_id] = array_map(static function ($mapping) {
                    return [
                        'raw'    => (string) $mapping['raw_value'],
                        'mapped' => (string) $mapping['mapped_value'],
                    ];
                }, $overrides['mappings']);
            }
        }

        $visible_columns = array_values(array_filter($allowed_fields, static function ($field_id) use ($hidden) {
            return !isset($hidden[$field_id]);
        }));

        return [
            'visible_columns' => $visible_columns,
            'labels'          => $labels,
            'mappings'        => $mappings,
        ];
    }

    /**
     * Basic JSON payload sanitization for storage.
     *
     * @param mixed $json_string Raw JSON string.
     * @return string Empty string on invalid payload, sanitized JSON string otherwise.
     */
    public static function sanitize_payload_json($json_string)
    {
        if (!is_string($json_string) || $json_string === '') {
            return '';
        }

        $decoded = json_decode($json_string, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            return '';
        }

        $sanitized = self::sanitize_payload_array($decoded, self::get_exportable_fields());
        $encoded = wp_json_encode($sanitized, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        if (!is_string($encoded)) {
            return '';
        }

        return $encoded;
    }

    /**
     * @param array<int, mixed>  $raw_payload
     * @param array<int, string> $allowed_fields
     * @return array<int, array{id: string, label?: string, overrides?: array<string, mixed>}>
     */
    private static function sanitize_payload_array($raw_payload, $allowed_fields)
    {
        if (!is_array($raw_payload)) {
            return [];
        }

        $allowed_lookup = array_fill_keys($allowed_fields, true);
        $sanitized = [];

        foreach ($raw_payload as $item) {
            $sanitized_item = self::sanitize_payload_item($item, $allowed_lookup);
            if ($sanitized_item === null) {
                continue;
            }

            $sanitized[] = $sanitized_item;
        }

        return $sanitized;
    }

    /**
     * @param mixed $item
     * @param array<string, bool> $allowed_lookup
     * @return array{id: string, label?: string, overrides?: array<string, mixed>}|null
     */
    private static function sanitize_payload_item($item, $allowed_lookup)
    {
        if (!is_array($item) || !isset($item['id']) || !is_string($item['id'])) {
            return null;
        }

        $field_id = sanitize_key($item['id']);
        if ($field_id === '' || !isset($allowed_lookup[$field_id])) {
            return null;
        }

        $sanitized_item = [
            'id' => $field_id,
        ];

        if (isset($item['label']) && is_string($item['label'])) {
            $sanitized_item['label'] = sanitize_text_field($item['label']);
        }

        if (isset($item['overrides']) && is_array($item['overrides'])) {
            $sanitized_overrides = self::sanitize_overrides($item['overrides']);
            if (!empty($sanitized_overrides)) {
                $sanitized_item['overrides'] = $sanitized_overrides;
            }
        }

        return $sanitized_item;
    }

    /**
     * @param array<string, mixed> $overrides
     * @return array<string, mixed>
     */
    private static function sanitize_overrides($overrides)
    {
        $sanitized_overrides = [];

        if (isset($overrides['label']) && is_string($overrides['label'])) {
            $sanitized_overrides['label'] = sanitize_text_field($overrides['label']);
        }

        if (array_key_exists('hidden', $overrides) && !is_array($overrides['hidden']) && !is_object($overrides['hidden'])) {
            $hidden_value = wp_validate_boolean($overrides['hidden']);
            if ($hidden_value === true) {
                $sanitized_overrides['hidden'] = true;
            }
        }

        if (isset($overrides['mappings']) && is_array($overrides['mappings'])) {
            $sanitized_mappings = self::sanitize_mappings($overrides['mappings']);
            if (!empty($sanitized_mappings)) {
                $sanitized_overrides['mappings'] = $sanitized_mappings;
            }
        }

        return $sanitized_overrides;
    }

    /**
     * @param array<int, mixed> $mappings
     * @return array<int, array{raw_value: string, mapped_value: string}>
     */
    private static function sanitize_mappings($mappings)
    {
        $sanitized_mappings = [];

        foreach ($mappings as $mapping) {
            if (!is_array($mapping) || !array_key_exists('raw_value', $mapping) || !array_key_exists('mapped_value', $mapping)) {
                continue;
            }

            $raw_value = $mapping['raw_value'];
            $mapped_value = $mapping['mapped_value'];

            if (is_array($raw_value) || is_object($raw_value) || is_array($mapped_value) || is_object($mapped_value)) {
                continue;
            }

            $sanitized_mappings[] = [
                'raw_value'    => sanitize_text_field((string) $raw_value),
                'mapped_value' => sanitize_text_field((string) $mapped_value),
            ];
        }

        return $sanitized_mappings;
    }

    /**
     * Decode a JSON meta value back into an array.
     *
     * Use this to read values that were stored via sanitize_payload_json().
     *
     * @param mixed $meta_value Raw value from get_post_meta().
     * @return array|null Decoded array, or null on empty/invalid input.
     */
    public static function decode_meta_json($meta_value): ?array
    {
        if (empty($meta_value) || !is_string($meta_value)) {
            return null;
        }

        $decoded = json_decode($meta_value, true);
        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            return null;
        }

        return $decoded;
    }

    /**
     * @return array<int, string>
     */
    public static function get_exportable_fields()
    {
        return array_values(array_filter(AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS, static function ($field_id) {
            return $field_id !== 'custom_properties';
        }));
    }

    /**
     * @param int   $form_id
     * @param array<int, string> $allowed_fields
     * @return array<string, string>
     */
    public static function get_default_labels($form_id, $allowed_fields)
    {
        $default_labels = AV_Petitioner_Labels::get_field_labels();
        $custom_labels = av_petitioner_get_form_labels($form_id, $allowed_fields);
        $all_labels = array_merge($default_labels, $custom_labels);
        $labels = [];

        foreach ($allowed_fields as $field_id) {
            $label = $all_labels[$field_id] ?? ucwords(str_replace('_', ' ', $field_id));
            $label = trim((string) $label);

            if ($label === '') {
                $label = ucwords(str_replace('_', ' ', $field_id));
            }

            $labels[$field_id] = $label;
        }

        return $labels;
    }

    /**
     * Get the default columns configuration for the frontend table heading editor.
     *
     * @param int $form_id Petition ID.
     * @return array<int, array{id: string, label: string}> Array of default column definitions.
     */
    public static function get_default_columns($form_id)
    {
        $allowed_fields = self::get_exportable_fields();
        $labels = self::get_default_labels($form_id, $allowed_fields);
        $columns = [];

        foreach ($allowed_fields as $field_id) {
            $column = [
                'id'    => $field_id,
                'label' => wp_strip_all_tags($labels[$field_id]),
            ];

            if (in_array($field_id, self::$DEFAULT_HIDDEN_FIELDS, true)) {
                $column['overrides'] = ['hidden' => true];
            }

            $columns[] = $column;
        }

        return $columns;
    }
}
