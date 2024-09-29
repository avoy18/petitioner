<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class AV_Petitioner_Admin_Edit_UI
{
    public function __construct()
    {
        // Hook into WordPress
        add_action('add_meta_boxes', [$this, 'add_meta_boxes']);
        add_action('save_post_petitioner-petition', [$this, 'save_meta_box_data']);

        add_filter('get_sample_permalink_html', [$this, 'hide_cpt_permalink'], 10, 4);
        add_filter('post_row_actions', [$this, 'remove_view_link'], 10, 4);
    }

    /**
     * Add Meta Boxes
     */
    public function add_meta_boxes()
    {
        // Admin fields
        add_meta_box(
            'petition_details',
            'Petition details',
            [$this, 'display_meta_box'],
            'petitioner-petition',
            'normal',
            'default'
        );
    }

    public function render_form_fields($post)
    {
        // Retrieve current meta field values
        $petitioner_title = get_post_meta($post->ID, '_petitioner_title', true);
        $send_to_representative = get_post_meta($post->ID, '_petitioner_send_to_representative', true);
        $petitioner_email = get_post_meta($post->ID, '_petitioner_email', true);
        $petitioner_cc_emails = get_post_meta($post->ID, '_petitioner_cc_emails', true);
        $petitioner_goal = get_post_meta($post->ID, '_petitioner_goal', true);
        $petitioner_letter = get_post_meta($post->ID, '_petitioner_letter', true);
        $petitioner_subject = get_post_meta($post->ID, '_petitioner_subject', true);
        // Output nonce for verification
        wp_nonce_field('save_petition_details', 'petitioner_details_nonce');

        // Display form fields
?>
        <div class="petitioner-admin__form">

            <?php if ($post->ID): ?>
                <p>
                    <label for="petitioner_shortcode">Your petition shortcode:</label>
                    <input disabled type="text" name="petitioner_shortcode" id="petitioner_shortcode" value='[petitioner-form id="<?php echo esc_attr($post->ID) ?>"]'
                        class="widefat">
                </p>
            <?php endif; ?>

            <p>
                <label for="petitioner_title">Petition title *:</label>
                <input type="text" required name="petitioner_title" id="petitioner_title" value="<?php echo esc_attr($petitioner_title); ?>"
                    class="widefat">
            </p>

            <p>
                <input type="checkbox" name="petitioner_send_to_representative" id="petitioner_send_to_representative" <?php checked(1, $send_to_representative, true); ?>
                    class="widefat">
                <label for="petitioner_send_to_representative">Send this email to representative?</label>
            </p>
            <p>
                <label for="petitioner_email">Petition target email:</label>
                <input type="email" name="petitioner_email" id="petitioner_email" value="<?php echo esc_attr($petitioner_email); ?>"
                    class="widefat">
            </p>
            <p>
                <label for="petitioner_cc_emails">Petition CC emails <small>(can have multiple - separated by comma)</small>:</label>
                <input type="text" name="petitioner_cc_emails" id="petitioner_cc_emails" value="<?php echo esc_attr($petitioner_cc_emails); ?>"
                    class="widefat">
            </p>
            <p>
                <label for="petitioner_goal">Signature goal *:</label>
                <input type="number" required name="petitioner_goal" id="petitioner_goal" value="<?php echo esc_attr($petitioner_goal); ?>"
                    class="widefat">
            </p>
            <p>
                <label for="petitioner_subject">Petition subject *:</label>
                <input type="text" required name="petitioner_subject" id="petitioner_subject" value="<?php echo esc_attr($petitioner_subject); ?>"
                    class="widefat">
            </p>

            <h3 for="petitioner_letter">Petition letter:</h3>
            <?php
            // Load existing content (if any)
            $content = $petitioner_letter;

            // Unique ID for the editor
            $editor_id = 'petitioner_letter';

            // Settings for the editor
            $settings = array(
                'textarea_name' => 'petitioner_letter',
                'media_buttons' => false,
                'textarea_rows' => 8,
                'teeny' => false,
                'quicktags' => true,
                'tinymce' => array(
                    'toolbar1' => 'formatselect,bold,italic,bullist,numlist',
                    'block_formats' => 'Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5;Heading 6=h6',
                    'height' => 300,  // Set the editor height (optional)
                ),
            );

            // Display the editor
            wp_editor($content, $editor_id, $settings);
            ?>
        </div>
    <?php
    }

    public function render_submissions($post)
    {

        $submission_settings = array(
            'formID' => $post->ID,
        );
    ?>

        <div id="AV_Petitioner_Submissions" class="petitioner-admin__submissions" data-petitioner-submissions='<?php echo wp_json_encode($submission_settings) ?>'>

            <h3>Submissions</h3>

            <a href="<?php echo esc_attr(admin_url('admin-post.php') . '?action=petitioner_export_csv&form_id=' . $post->ID); ?>" class="button button-primary">Export Submissions as CSV</a>

            <div class="petitioner-admin__entries">
            </div>

            <div class="petitioner-admin__pagination"></div>
        </div>

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
            $this->render_submissions($post);
            ?>
        </div>
    <?php
    }

    /**
     * Save Meta Box Data
     */
    public function save_meta_box_data($post_id)
    {
        $wpnonce = !empty($_POST['petitioner_details_nonce']) ? sanitize_text_field(wp_unslash($_POST['petitioner_details_nonce'])) : '';

        // Check if nonce is set
        if (!isset($wpnonce)) {
            return;
        }

        // Verify nonce
        if (!wp_verify_nonce($wpnonce, 'save_petition_details')) {
            return;
        }

        // Check for autosave
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Check user permissions
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $petitioner_title           = isset($_POST['petitioner_title']) ? sanitize_text_field(wp_unslash($_POST['petitioner_title'])) : '';
        $send_to_representative     = isset($_POST['petitioner_send_to_representative']) ? sanitize_text_field(wp_unslash($_POST['petitioner_send_to_representative'])) : '';
        $petitioner_email           = isset($_POST['petitioner_email']) ? sanitize_email(wp_unslash($_POST['petitioner_email'])) : '';
        $petitioner_cc_emails       = isset($_POST['petitioner_cc_emails']) ? sanitize_text_field(wp_unslash($_POST['petitioner_cc_emails'])) : '';
        $petitioner_goal            = isset($_POST['petitioner_goal']) ? intval(wp_unslash($_POST['petitioner_goal'])) : 0;
        $petitioner_subject         = isset($_POST['petitioner_subject']) ? sanitize_text_field(wp_unslash($_POST['petitioner_subject'])) : '';
        $petitioner_letter          = isset($_POST['petitioner_letter']) ? wp_kses_post(wp_unslash($_POST['petitioner_letter'])) : '';

        if (!empty($petitioner_title)) {
            update_post_meta($post_id, '_petitioner_title', sanitize_text_field($petitioner_title));
        }
        
        if (!empty($send_to_representative) && $send_to_representative == 'on') {
            update_post_meta($post_id, '_petitioner_send_to_representative', 1);
        } else {
            update_post_meta($post_id, '_petitioner_send_to_representative', 0);
        }

        if (!empty($petitioner_email)) {
            update_post_meta($post_id, '_petitioner_email', sanitize_email($petitioner_email));
        }

        if (!empty($petitioner_cc_emails)) {
            $final_cc_emails = $this->sanitize_cc_emails($petitioner_cc_emails);

            update_post_meta($post_id, '_petitioner_cc_emails', $final_cc_emails);
        }

        // Sanitize and save the goal field
        if (isset($petitioner_goal)) {
            update_post_meta($post_id, '_petitioner_goal', intval($petitioner_goal));
        }

        // Sanitize and save the subject
        if (!empty($petitioner_subject)) {
            update_post_meta($post_id, '_petitioner_subject', sanitize_text_field($petitioner_subject));
        }

        if (!empty($petitioner_letter)) {
            update_post_meta($post_id, '_petitioner_letter', $petitioner_letter);
        }
    }

    public function sanitize_cc_emails($emails = '')
    {
        // Split the string into an array using commas
        $emails = explode(',', $emails);

        // Initialize an array to hold the sanitized emails
        $sanitized_emails = array();

        // Loop through each email
        foreach ($emails as $email) {
            // Trim any extra spaces and sanitize the email
            $email = sanitize_email(trim($email));

            // Validate the email and add it to the sanitized list if valid
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $sanitized_emails[] = $email;
            }
        }

        return implode(',', $sanitized_emails);
    }

    /**
     * Hide the permalink for a specific custom post type.
     */
    public function hide_cpt_permalink($permalink_html, $post_id, $new_title, $new_slug)
    {
        $post = get_post($post_id);
        if ('petitioner-petition' === $post->post_type) {
            return '';
        }

        return $permalink_html;
    }

    public function remove_view_link($actions, $post)
    {
        if ('petitioner-petition' === $post->post_type) {
            // Remove the "View" action
            unset($actions['view']);
        }

        return $actions;
    }
}
