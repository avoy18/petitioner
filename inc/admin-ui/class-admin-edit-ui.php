<?php

if (!defined("ABSPATH")) {
    exit(); // Exit if accessed directly
}

class AV_Petitioner_Admin_Edit_UI
{
    /**
     * List of meta fields used in the form.
     */
    private const META_FIELDS = [
        'title'                   => '_petitioner_title',
        'send_to_representative'  => '_petitioner_send_to_representative',
        'email'                   => '_petitioner_email',
        'cc_emails'               => '_petitioner_cc_emails',
        'goal'                    => '_petitioner_goal',
        'subject'                 => '_petitioner_subject',
        'show_country'            => '_petitioner_show_country',
        'show_goal'               => '_petitioner_show_goal',
        'require_approval'        => '_petitioner_require_approval',
        'approval_state'          => '_petitioner_approval_state',
        'letter'                  => '_petitioner_letter',
        'add_consent_checkbox'    => '_petitioner_add_consent_checkbox',
        'add_legal_text'          => '_petitioner_add_legal_text',
        'consent_text'            => '_petitioner_consent_text',
        'legal_text'              => '_petitioner_legal_text',
        'override_ty_email'       => '_petitioner_override_ty_email',
        'ty_email'                => '_petitioner_ty_email',
        'ty_email_subject'        => '_petitioner_ty_email_subject',
        'from_field'              => '_petitioner_from_field',
        'add_honeypot'            => '_petitioner_add_honeypot',
        'form_fields'             => '_petitioner_form_fields',
        'field_order'             => '_petitioner_field_order',
    ];

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
        foreach (self::META_FIELDS as $key => $meta_key) {
            $meta_values[$key] = get_post_meta($post_id, $meta_key, true);
        }
        return $meta_values;
    }

    /**
     * Render form fields inside the meta box.
     */
    public function render_form_fields($post)
    {
        wp_nonce_field("save_petition_details", "petitioner_details_nonce");
        // Retrieve current meta values
        $meta_values     = $this->get_meta_fields($post->ID);
        // Sanitize values for safe use in HTML attributes
        $petitioner_info = [
            "form_id"                       => (int) $post->ID,
            "title"                         => esc_html($meta_values['title']),
            "send_to_representative"        => (bool) $meta_values['send_to_representative'],
            "email"                         => sanitize_text_field($meta_values['email']),
            "cc_emails"                     => sanitize_text_field($meta_values['cc_emails']),
            "show_goal"                     => (bool) $meta_values['show_goal'],
            "goal"                          => (int) $meta_values['goal'],
            "show_country"                  => (bool) $meta_values['show_country'],
            "subject"                       => esc_html($meta_values['subject']),
            "require_approval"              => (bool) $meta_values['require_approval'],
            "approval_state"                => esc_html($meta_values['approval_state']),
            "letter"                        => wp_kses_post($meta_values['letter']),
            "add_legal_text"                => (bool) $meta_values['add_legal_text'],
            "add_consent_checkbox"          => (bool) $meta_values['add_consent_checkbox'],
            "consent_text"                  => sanitize_text_field($meta_values['consent_text']),
            "legal_text"                    => wp_kses_post($meta_values['legal_text']),
            "export_url"                    => esc_url_raw(admin_url("admin-post.php?action=petitioner_export_csv&form_id=" . (int) $post->ID)),
            "override_ty_email"             => (bool) $meta_values['override_ty_email'],
            "ty_email"                      => wp_kses_post($meta_values['ty_email']),
            "ty_email_subject"              => sanitize_text_field($meta_values['ty_email_subject']),
            "from_field"                    => sanitize_text_field($meta_values['from_field']),
            "add_honeypot"                  => (bool) $meta_values['add_honeypot'],
            "default_values"                => [
                "ty_email_subject"              => AV_Petitioner_Email_Template::get_default_ty_subject(),
                "ty_email"                      => AV_Petitioner_Email_Template::get_default_ty_email(),
                'ty_email_subject_confirm'      => AV_Petitioner_Email_Template::get_default_ty_subject(true),
                'ty_email_confirm'              => AV_Petitioner_Email_Template::get_default_ty_email(true),
                "from_field"                    => AV_Petitioner_Email_Template::get_default_from_field(),
            ],
            // new way of handling the form fields
            "form_fields"                   =>  !empty($meta_values['form_fields']) ? $this->sanitize_form_fields($meta_values['form_fields'], false) : null,
            "field_order"                   =>  !empty($meta_values['field_order']) ? json_decode($meta_values['field_order']) : null,
        ];

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
            !wp_verify_nonce($_POST["petitioner_details_nonce"], "save_petition_details") ||
            (defined("DOING_AUTOSAVE") && DOING_AUTOSAVE) ||
            !current_user_can("edit_post", $post_id)
        ) {
            return;
        }

        // Process meta fields
        $meta_values = [];
        foreach (self::META_FIELDS as $key => $meta_key) {
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
        $checkboxes = [
            'send_to_representative',
            'show_country',
            'require_approval',
            'add_legal_text',
            'add_consent_checkbox',
            'show_goal',
            'add_honeypot',
        ];

        $wysiwyg_fields = [
            'letter',
            'legal_text',
            'ty_email',
        ];

        foreach ($meta_values as $key => $value) {
            if (in_array($key, $wysiwyg_fields)) {
                $value = wp_kses_post($value);
            } elseif ($key === 'cc_emails' || $key === 'email') {
                $value = $this->sanitize_emails($value);
            } elseif (in_array($key, $checkboxes)) {
                $value = $value === "on" ? 1 : 0;
            } elseif ($key === 'goal') {
                $value = (int) $value;
            } elseif ($key === 'form_fields') {
                $value = $this->sanitize_form_fields($value);
            } elseif ($key === 'field_order') {
                // $value = $this->sanitize_form_fields($value);
            } else {
                $value = sanitize_text_field($value);
            }
            update_post_meta($post_id, self::META_FIELDS[$key], $value);
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
            return '';
        }

        $decoded = json_decode($value, true);

        if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
            return '';
        }

        $sanitized = [];

        foreach ($decoded as $field_key => $field_data) {
            if (!is_array($field_data)) {
                continue;
            }

            $sanitized_field = [];

            foreach ($field_data as $sub_key => $sub_value) {
                if (
                    $sub_key === 'value' &&
                    isset($field_data['type']) &&
                    $field_data['type'] === 'wysiwyg'
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
}
