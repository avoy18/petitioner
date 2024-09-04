<?php

class Petitioner_Admin_UI
{
    public function __construct()
    {
        // Hook into WordPress
        add_action('add_meta_boxes', [$this, 'add_meta_boxes']);
        add_action('save_post_petition', [$this, 'save_meta_box_data']);
    }

    /**
     * Add Meta Boxes
     */
    public function add_meta_boxes()
    {
        add_meta_box(
            'petition_details',                // ID of the meta box
            'Petition Details',                // Title of the meta box
            [$this, 'display_meta_box'],       // Callback function to display fields
            'petitioner-petition',
            'normal',                          // Context (normal, side, advanced)
            'default'                          // Priority
        );
    }

    /**
     * Display Meta Box Fields
     */
    public function display_meta_box($post)
    {
        // Retrieve current meta field values
        $petition_email = get_post_meta($post->ID, '_petition_email', true);
        $petition_goal = get_post_meta($post->ID, '_petition_goal', true);

        // Output nonce for verification
        wp_nonce_field('save_petition_details', 'petition_details_nonce');

        // Display form fields
        ?>
        <p>
            <label for="petition_email">Petition Contact Email:</label>
            <input type="email" name="petition_email" id="petition_email" value="<?php echo esc_attr($petition_email); ?>"
                class="widefat">
        </p>
        <p>
            <label for="petition_goal">Signature Goal:</label>
            <input type="number" name="petition_goal" id="petition_goal" value="<?php echo esc_attr($petition_goal); ?>"
                class="widefat">
        </p>
        <?php
    }

    /**
     * Save Meta Box Data
     */
    public function save_meta_box_data($post_id)
    {
        // Check if nonce is set
        if (!isset($_POST['petition_details_nonce'])) {
            return;
        }

        // Verify nonce
        if (!wp_verify_nonce($_POST['petition_details_nonce'], 'save_petition_details')) {
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

        // Sanitize and save the email field
        if (isset($_POST['petition_email'])) {
            update_post_meta($post_id, '_petition_email', sanitize_email($_POST['petition_email']));
        }

        // Sanitize and save the goal field
        if (isset($_POST['petition_goal'])) {
            update_post_meta($post_id, '_petition_goal', intval($_POST['petition_goal']));
        }
    }
}