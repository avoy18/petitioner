<?php

if (!defined("ABSPATH")) {
    exit(); // Exit if accessed directly
}

class AV_Petitioner_Admin_Edit_UI
{
    public function __construct()
    {
        // Hook into WordPress
        add_action("add_meta_boxes", [$this, "add_meta_boxes"]);
        add_action("save_post_petitioner-petition", [
            $this,
            "save_meta_box_data",
        ]);

        add_filter(
            "get_sample_permalink_html",
            [$this, "hide_cpt_permalink"],
            10,
            4
        );
        add_filter("post_row_actions", [$this, "remove_view_link"], 10, 4);
    }

    /**
     * Add Meta Boxes
     */
    public function add_meta_boxes()
    {
        // Admin fields
        add_meta_box(
            "petition_details",
            "Petition details",
            [$this, "display_meta_box"],
            "petitioner-petition",
            "normal",
            "default"
        );
    }

    public function render_form_fields($post)
    {
        // Retrieve current meta field values
        $petitioner_title = get_post_meta($post->ID, "_petitioner_title", true);
        $send_to_representative = get_post_meta(
            $post->ID,
            "_petitioner_send_to_representative",
            true
        );
        $petitioner_email = get_post_meta($post->ID, "_petitioner_email", true);
        $petitioner_cc_emails = get_post_meta(
            $post->ID,
            "_petitioner_cc_emails",
            true
        );
        $petitioner_goal = get_post_meta($post->ID, "_petitioner_goal", true);
        $petitioner_letter = get_post_meta(
            $post->ID,
            "_petitioner_letter",
            true
        );
        $petitioner_subject = get_post_meta(
            $post->ID,
            "_petitioner_subject",
            true
        );
        $petitioner_show_country = get_post_meta(
            $post->ID,
            "_petitioner_show_country",
            true
        );
        $petitioner_require_approval = get_post_meta(
            $post->ID,
            "_petitioner_require_approval",
            true
        );
        $petitioner_approval_state = get_post_meta(
            $post->ID,
            "_petitioner_approval_state",
            true
        );
        // Output nonce for verification
        wp_nonce_field("save_petition_details", "petitioner_details_nonce");

        $petitioner_info = [
            "form_id" => $post->ID,
            "title" => esc_attr($petitioner_title),
            "send_to_representative" => (bool) $send_to_representative,
            "email" => esc_attr($petitioner_email),
            "cc_emails" => esc_attr($petitioner_cc_emails),
            "goal" => esc_attr($petitioner_goal),
            "show_country" => (bool) $petitioner_show_country,
            "subject" => esc_attr($petitioner_subject),
            "require_approval" => (bool) $petitioner_require_approval,
            "approval_state" => esc_attr($petitioner_approval_state),
            "export_url" => esc_attr(
                admin_url("admin-post.php") .
                    "?action=petitioner_export_csv&form_id=" .
                    $post->ID
            ),
        ];
        // Display form fields
?>
        <div class="petitioner-admin__form ptr-is-loading">

            <div data-av-ptr-info='<?php echo wp_json_encode(
                                        $petitioner_info
                                    ); ?>' id="petitioner-admin-form"></div>

            <div id="petitionerLetterArea">
                <h3 for="petitioner_letter">
                    <?php _e(
                        "Petition letter:",
                        "petitioner"
                    ); ?>
                </h3>
                <?php
                // Load existing content (if any)
                $content = $petitioner_letter;

                // Unique ID for the editor
                $editor_id = "petitioner_letter";

                // // Settings for the editor
                $settings = [
                    "textarea_name" => "petitioner_letter",
                    "media_buttons" => false,
                    "textarea_rows" => 8,
                    "teeny" => false,
                    "quicktags" => true,
                    "tinymce" => [
                        "toolbar1" => "formatselect,bold,italic,bullist,numlist",
                        "block_formats" =>
                        "Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6",
                        "height" => 300, // Set the editor height (optional)
                    ],
                ];

                wp_editor($content, $editor_id, $settings); ?>
            </div>
        </div>
    <?php
    }

    public function render_submissions($post)
    {
    ?>

        <div id="petitioner-submissions-container"></div>

    <?php
    }
    /**
     * Display Meta Box Fields
     */
    public function display_meta_box($post)
    {
    ?>
        <div class="petitioner-admin">
            <?php
            $this->render_form_fields($post);
            $this->render_submissions($post); ?>
        </div>
<?php
    }

    /**
     * Save Meta Box Data
     */
    public function save_meta_box_data($post_id)
    {
        $wpnonce = !empty($_POST["petitioner_details_nonce"])
            ? sanitize_text_field(
                wp_unslash($_POST["petitioner_details_nonce"])
            )
            : "";

        // Check if nonce is set
        if (!isset($wpnonce)) {
            return;
        }

        // Verify nonce
        if (!wp_verify_nonce($wpnonce, "save_petition_details")) {
            return;
        }

        // Check for autosave
        if (defined("DOING_AUTOSAVE") && DOING_AUTOSAVE) {
            return;
        }

        // Check user permissions
        if (!current_user_can("edit_post", $post_id)) {
            return;
        }

        $petitioner_title = isset($_POST["petitioner_title"])
            ? sanitize_text_field(wp_unslash($_POST["petitioner_title"]))
            : "";
        $send_to_representative = isset(
            $_POST["petitioner_send_to_representative"]
        )
            ? sanitize_text_field(
                wp_unslash($_POST["petitioner_send_to_representative"])
            )
            : "";
        $petitioner_email = isset($_POST["petitioner_email"])
            ? sanitize_text_field(wp_unslash($_POST["petitioner_email"]))
            : "";
        $petitioner_cc_emails = isset($_POST["petitioner_cc_emails"])
            ? sanitize_text_field(wp_unslash($_POST["petitioner_cc_emails"]))
            : "";
        $petitioner_goal = isset($_POST["petitioner_goal"])
            ? intval(wp_unslash($_POST["petitioner_goal"]))
            : 0;
        $petitioner_subject = isset($_POST["petitioner_subject"])
            ? sanitize_text_field(wp_unslash($_POST["petitioner_subject"]))
            : "";
        $petitioner_letter = isset($_POST["petitioner_letter"])
            ? wp_kses_post(wp_unslash($_POST["petitioner_letter"]))
            : "";
        $petitioner_show_country = isset($_POST["petitioner_show_country"])
            ? sanitize_text_field(wp_unslash($_POST["petitioner_show_country"]))
            : "";
        $petitioner_require_approval = isset(
            $_POST["petitioner_require_approval"]
        )
            ? sanitize_text_field(
                wp_unslash($_POST["petitioner_require_approval"])
            )
            : "";
        $petitioner_approval_state = isset($_POST["petitioner_approval_state"])
            ? sanitize_text_field(
                wp_unslash($_POST["petitioner_approval_state"])
            )
            : "approved";

        if (!empty($petitioner_title)) {
            update_post_meta(
                $post_id,
                "_petitioner_title",
                sanitize_text_field($petitioner_title)
            );
        }

        if (
            !empty($send_to_representative) &&
            $send_to_representative == "on"
        ) {
            update_post_meta($post_id, "_petitioner_send_to_representative", 1);
        } else {
            update_post_meta($post_id, "_petitioner_send_to_representative", 0);
        }

        if (
            !empty($petitioner_show_country) &&
            $petitioner_show_country == "on"
        ) {
            update_post_meta($post_id, "_petitioner_show_country", 1);
        } else {
            update_post_meta($post_id, "_petitioner_show_country", 0);
        }

        if (!empty($petitioner_email)) {
            update_post_meta($post_id, "_petitioner_email", $petitioner_email);
        }

        if (!empty($petitioner_cc_emails)) {
            $final_cc_emails = $this->sanitize_emails($petitioner_cc_emails);

            update_post_meta(
                $post_id,
                "_petitioner_cc_emails",
                $final_cc_emails
            );
        }

        // Sanitize and save the goal field
        if (isset($petitioner_goal)) {
            update_post_meta(
                $post_id,
                "_petitioner_goal",
                intval($petitioner_goal)
            );
        }

        // Sanitize and save the subject
        if (!empty($petitioner_subject)) {
            update_post_meta(
                $post_id,
                "_petitioner_subject",
                sanitize_text_field($petitioner_subject)
            );
        }

        if (
            !empty($petitioner_require_approval) &&
            $petitioner_require_approval == "on"
        ) {
            update_post_meta($post_id, "_petitioner_require_approval", 1);
        } else {
            update_post_meta($post_id, "_petitioner_require_approval", 0);
        }

        if (!empty($petitioner_approval_state)) {
            update_post_meta(
                $post_id,
                "_petitioner_approval_state",
                sanitize_text_field($petitioner_approval_state)
            );
        }

        if (!empty($petitioner_letter)) {
            update_post_meta(
                $post_id,
                "_petitioner_letter",
                $petitioner_letter
            );
        }
    }

    public function sanitize_emails($emails = "")
    {
        // Split the string into an array using commas
        $emails = explode(",", $emails);

        // Initialize an array to hold the sanitized emails
        $sanitized_emails = [];

        // Loop through each email
        foreach ($emails as $email) {
            // Trim any extra spaces and sanitize the email
            $email = sanitize_email(trim($email));

            // Validate the email and add it to the sanitized list if valid
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $sanitized_emails[] = $email;
            }
        }

        return implode(",", $sanitized_emails);
    }

    /**
     * Hide the permalink for a specific custom post type.
     */
    public function hide_cpt_permalink(
        $permalink_html,
        $post_id,
        $new_title,
        $new_slug
    ) {
        $post = get_post($post_id);
        if ("petitioner-petition" === $post->post_type) {
            return "";
        }

        return $permalink_html;
    }

    public function remove_view_link($actions, $post)
    {
        if ("petitioner-petition" === $post->post_type) {
            // Remove the "View" action
            unset($actions["view"]);
        }

        return $actions;
    }
}
