<?php

if (!defined("ABSPATH")) {
    exit(); // Exit if accessed directly
}

class AV_Petitioner_Admin_Edit_UI
{
    public static $ADMIN_EDIT_NONCE_LABEL = 'save_petition_details';

    /**
     * Get the meta schema for petition forms.
     *
     * @return array
     */
    public static function get_meta_schema()
    {
        $schema = [
            'title'                     => ['meta_key' => '_petitioner_title', 'type' => 'text'],
            'send_to_representative'    => ['meta_key' => '_petitioner_send_to_representative', 'type' => 'checkbox'],
            'email'                     => ['meta_key' => '_petitioner_email', 'type' => 'emails'],
            'cc_emails'                 => ['meta_key' => '_petitioner_cc_emails', 'type' => 'emails'],
            'goal'                      => ['meta_key' => '_petitioner_goal', 'type' => 'json_goal'],
            'subject'                   => ['meta_key' => '_petitioner_subject', 'type' => 'text'],
            'show_country'              => ['meta_key' => '_petitioner_show_country', 'type' => 'checkbox'],
            'show_goal'                 => ['meta_key' => '_petitioner_show_goal', 'type' => 'checkbox'],
            'require_approval'          => ['meta_key' => '_petitioner_require_approval', 'type' => 'checkbox'],
            'approval_state'            => ['meta_key' => '_petitioner_approval_state', 'type' => 'text'],
            'letter'                    => ['meta_key' => '_petitioner_letter', 'type' => 'wysiwyg'],
            'add_consent_checkbox'      => ['meta_key' => '_petitioner_add_consent_checkbox', 'type' => 'checkbox'],
            'add_legal_text'            => ['meta_key' => '_petitioner_add_legal_text', 'type' => 'checkbox'],
            'consent_text'              => ['meta_key' => '_petitioner_consent_text', 'type' => 'text'],
            'legal_text'                => ['meta_key' => '_petitioner_legal_text', 'type' => 'wysiwyg'],
            'override_ty_email'         => ['meta_key' => '_petitioner_override_ty_email', 'type' => 'checkbox'],
            'ty_email'                  => ['meta_key' => '_petitioner_ty_email', 'type' => 'wysiwyg'],
            'ty_email_subject'          => ['meta_key' => '_petitioner_ty_email_subject', 'type' => 'text'],
            'override_success_message'  => ['meta_key' => '_petitioner_override_success_message', 'type' => 'checkbox'],
            'success_message'           => ['meta_key' => '_petitioner_success_message', 'type' => 'wysiwyg'],
            'success_message_title'     => ['meta_key' => '_petitioner_success_message_title', 'type' => 'text'],
            'from_field'                => ['meta_key' => '_petitioner_from_field', 'type' => 'text'],
            'from_name'                 => ['meta_key' => '_petitioner_from_name', 'type' => 'text'],
            'add_honeypot'              => ['meta_key' => '_petitioner_add_honeypot', 'type' => 'checkbox'],
            'form_fields'               => ['meta_key' => '_petitioner_form_fields', 'type' => 'json_form_fields'],
            'field_order'               => ['meta_key' => '_petitioner_field_order', 'type' => 'json_array'],
            'hide_last_names'           => ['meta_key' => '_petitioner_hide_last_names', 'type' => 'checkbox'],
            'csv_column_config'         => ['meta_key' => '_petitioner_csv_column_config', 'type' => 'json_csv_config'],
            'redirect_url'              => ['meta_key' => '_petitioner_redirect_url', 'type' => 'url'],
            'confirm_success_url'       => ['meta_key' => '_petitioner_confirm_success_url', 'type' => 'url'],
            'confirm_error_url'         => ['meta_key' => '_petitioner_confirm_error_url', 'type' => 'url'],
        ];

        return apply_filters('av_petitioner_edit_meta_schema', $schema);
    }

    public function __construct()
    {
        add_action("add_meta_boxes", [$this, "add_meta_boxes"]);
        add_action("save_post_petitioner-petition", [$this, "save_meta_box_data"]);
        add_filter("get_sample_permalink_html", [$this, "hide_cpt_permalink"], 10, 4);
        add_filter("post_row_actions", [$this, "remove_view_link"], 10, 4);
    }

    /**
     * Add Meta Boxes
     */
    public function add_meta_boxes()
    {
        add_meta_box(
            "petition_details",
            "Petition details",
            [$this, "display_meta_box"],
            "petitioner-petition",
            "normal",
            "default"
        );
    }

    /**
     * Fetch stored meta values from the database.
     */
    private function get_meta_fields($post_id)
    {
        $meta_values = [];
        foreach (self::get_meta_schema() as $key => $config) {
            $meta_values[$key] = get_post_meta($post_id, $config['meta_key'], true);
        }
        return $meta_values;
    }

    /**
     * Render form fields inside the meta box.
     */
    public function render_form_fields($post)
    {
        $ajax_nonce = wp_create_nonce(self::$ADMIN_EDIT_NONCE_LABEL);

        wp_nonce_field(self::$ADMIN_EDIT_NONCE_LABEL, "petitioner_details_nonce");
        // Retrieve current meta values
        $meta_values     = $this->get_meta_fields($post->ID);
        // Base non-meta data for the React app
        $petitioner_info = [
            "form_id"                       => (int) $post->ID,
            "export_url"                    => esc_url_raw(admin_url("admin-post.php?action=petitioner_export_csv&form_id=" . (int) $post->ID)),
            "default_values"                => [
                "ty_email_subject"              => AV_Petitioner_Labels::get('ty_email_subject'),
                "ty_email"                      => AV_Petitioner_Labels::get('ty_email'),
                'ty_email_subject_confirm'      => AV_Petitioner_Labels::get('ty_email_subject_confirm'),
                'ty_email_confirm'              => AV_Petitioner_Labels::get('ty_email_confirm'),
                'from_field'                    => AV_Petitioner_Labels::get('from_field'),
                'from_name'                     => AV_Petitioner_Labels::get('from_name'),
                'success_message_title'         => AV_Petitioner_Labels::get('success_message_title'),
                'success_message'               => AV_Petitioner_Labels::get('success_message'),
                "country_list"                  => av_petitioner_get_countries()
            ],
            "builder_config"                => AV_Petitioner_Field_Registry::get_all(),
            "ajax_nonce"                    => $ajax_nonce
        ];

        // Hydrate all fields from the schema automatically based on their type
        $schema = self::get_meta_schema();
        foreach ($schema as $key => $config) {
            $type  = $config['type'] ?? 'text';
            $value = $meta_values[$key] ?? '';

            if ($type === 'checkbox') {
                $petitioner_info[$key] = (bool) $value;
            } elseif ($type === 'wysiwyg') {
                $petitioner_info[$key] = wp_kses_post($value);
            } elseif ($type === 'emails' || $type === 'text') {
                // When rendering for JSON, sanitize_text_field is sufficient and avoids double-encoding entities.
                $petitioner_info[$key] = sanitize_text_field($value);
            } elseif ($type === 'url') {
                $petitioner_info[$key] = esc_url($value);
            } elseif ($type === 'json_goal') {
                $petitioner_info[$key] = AV_Petitioner_Goal_Milestones::normalize($value);
            } elseif ($type === 'json_csv_config') {
                $petitioner_info[$key] = AV_Petitioner_Column_Config::decode_meta_json($value);
            } elseif ($type === 'json_form_fields') {
                $petitioner_info[$key] = !empty($value) ? $this->sanitize_form_fields($value, false) : null;
            } elseif ($type === 'json_array') {
                $petitioner_info[$key] = !empty($value) ? $this->sanitize_array($value, false) : null;
            } elseif (str_contains($type, 'json')) {
                // Fallback for any other generic json types added by plugins
                $decoded = !empty($value) ? json_decode($value, true) : null;
                $petitioner_info[$key] = is_array($decoded) ? $decoded : [];
            } else {
                $petitioner_info[$key] = $value;
            }
        }

        /**
         * Filter to modify petitioner data that is sent to the edit screen
         * 
         *
         * @param array $petitioner_info Array of the data
         * @param int $form_id ID of the form being rendered.
         * @return array Modified $petitioner_info data.
         */
        $petitioner_info = apply_filters('av_petitioner_info_edit', $petitioner_info, $post->ID);

        /**
         * Filter to modify the form fields before rendering in the admin panel.
         *
         * This allows plugins or themes to add, remove, or modify fields.
         *
         * @param array $form_fields Array of form fields.
         * @param int $form_id ID of the form being rendered.
         * @return array Modified form fields.
         */
        $petitioner_info['form_fields'] = apply_filters('av_petitioner_form_fields_admin', $petitioner_info['form_fields'], $post->ID);

        $petitioner_info['active_tab']  = !empty($_GET['ptr_active_tab']) ? $_GET['ptr_active_tab'] : 'default';

        $data_attributes = wp_json_encode($petitioner_info, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>
        <div class="petitioner-admin__form ptr-is-loading">
            <script id="petitioner-json-data" type="text/json">
                <?php echo $data_attributes; ?>
            </script>
            <div id="petitioner-admin-form"></div>
        </div>
<?php
    }

    /**
     * Display Meta Box Fields
     */
    public function display_meta_box($post)
    {
        echo '<div class="petitioner-admin">';
        $this->render_form_fields($post);
        echo '</div>';
    }

    /**
     * Save Meta Box Data
     */
    public function save_meta_box_data($post_id)
    {
        if (
            !isset($_POST["petitioner_details_nonce"]) ||
            !wp_verify_nonce($_POST["petitioner_details_nonce"], self::$ADMIN_EDIT_NONCE_LABEL) ||
            (defined("DOING_AUTOSAVE") && DOING_AUTOSAVE) ||
            !current_user_can("edit_post", $post_id)
        ) {
            return;
        }

        // Process meta fields
        $meta_values = [];
        foreach (self::get_meta_schema() as $key => $config) {
            $meta_values[$key] = isset($_POST["petitioner_$key"])
                ? wp_unslash($_POST["petitioner_$key"])
                : '';
        }

        // Sanitize and update meta fields
        $this->update_meta_fields($post_id, $meta_values);
    }

    /**
     * Update meta fields in bulk.
     */
    private function update_meta_fields($post_id, $meta_values)
    {
        $schema = self::get_meta_schema();

        foreach ($meta_values as $key => $value) {
            if (!isset($schema[$key])) {
                continue;
            }

            $type = $schema[$key]['type'];
            $meta_key = $schema[$key]['meta_key'];

            if ($type === 'wysiwyg') {
                $value = wp_kses_post($value);
            } elseif ($type === 'emails') {
                $value = $this->sanitize_emails($value);
            } elseif ($type === 'checkbox') {
                $value = $value === "on" || $value === "1" || $value === 1 || $value === true ? 1 : 0;
            } elseif ($type === 'json_goal') {
                $value = AV_Petitioner_Goal_Milestones::sanitize_json($value);
            } elseif ($type === 'json_form_fields') {
                $value = $this->sanitize_form_fields($value);
            } elseif ($type === 'json_array') {
                $value = $this->sanitize_array($value);
            } elseif ($type === 'json_csv_config') {
                $value = AV_Petitioner_Column_Config::sanitize_payload_json($value);
            } elseif ($type === 'url') {
                $value = esc_url_raw($value);
            } else {
                $value = sanitize_text_field($value);
            }

            update_post_meta($post_id, $meta_key, $value);
        }
    }

    /**
     * Sanitize and validate email list.
     */
    private function sanitize_emails($emails)
    {
        $email_array = array_map('trim', explode(',', $emails));
        return implode(',', array_filter($email_array, 'is_email'));
    }

    /**
     * Hide the permalink for the custom post type.
     */
    public function hide_cpt_permalink($permalink_html, $post_id, $new_title, $new_slug)
    {
        return get_post($post_id)->post_type === "petitioner-petition" ? "" : $permalink_html;
    }

    /**
     * Remove "View" link from the petition post type in admin.
     */
    public function remove_view_link($actions, $post)
    {
        if ($post->post_type === "petitioner-petition") {
            unset($actions["view"]);
        }
        return $actions;
    }

    /**
     * Sanitize a JSON-encoded string representing form fields configuration.
     *
     * This method decodes the input JSON, sanitizes each field's sub-properties,
     * and re-encodes the structure. For fields of type 'wysiwyg', it allows limited HTML
     * in the 'value' key using wp_kses_post(). All other scalar values are sanitized
     * using sanitize_text_field().
     *
     * @param string $value JSON-encoded string of form fields.
     * @param bool   $returns_string Optional. Whether to return the sanitized data as a JSON-encoded string.
     *                               Defaults to false.
     * @return array|string Sanitized data. Returns an array if $returns_string is false, or a JSON-encoded
     *                      string if $returns_string is true. Returns an empty string if the input JSON is invalid.
     */
    public function sanitize_form_fields($value, $stringify = true)
    {
        if (!is_string($value)) {
            av_ptr_error_log('Error sanitizing the form fields - not a string');
            return '';
        }

        $decoded = json_decode($value, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            av_ptr_error_log('Error sanitizing the form fields - not a proper JSON');
            return '';
        }

        $sanitized = [];

        foreach ($decoded as $field_key => $field_data) {
            if (!is_array($field_data)) {
                continue;
            }

            $sanitized_field = [];

            foreach ($field_data as $sub_key => $sub_value) {
                $is_wysiwyg_value = $sub_key === 'value' &&
                    isset($field_data['type']) &&
                    $field_data['type'] === 'wysiwyg';

                $is_label = $sub_key === 'label';

                if (
                    $is_wysiwyg_value || $is_label
                ) {
                    $sanitized_field[$sub_key] = wp_kses_post($sub_value);
                } elseif (is_bool($sub_value) || is_numeric($sub_value)) {
                    $sanitized_field[$sub_key] = $sub_value; // Keep booleans and numbers as is
                } elseif (is_string($sub_value)) {
                    $sanitized_field[$sub_key] = sanitize_text_field($sub_value);
                } else {
                    $sanitized_field[$sub_key] = $sub_value;
                }
            }

            $sanitized[$field_key] = $sanitized_field;
        }

        if ($stringify) {
            return wp_slash(wp_json_encode($sanitized, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        }

        return $sanitized;
    }

    public function sanitize_array(string|array $json_items_raw, bool $stringify = true): string|array
    {
        if (is_array($json_items_raw)) {
            $array_items = $json_items_raw;
        } else {
            $array_items = json_decode($json_items_raw, true);
        }

        if (!is_array($array_items)) {
            av_ptr_error_log('Error sanitizing the array');
            return $stringify ? '[]' : [];
        }

        $sanitized = array_map(fn($item) => sanitize_text_field((string) $item), $array_items);

        return $stringify
            ? wp_slash(wp_json_encode($sanitized, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES))
            : $sanitized;
    }
}
