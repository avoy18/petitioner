<?php

class Petitioner_Admin_UI
{
    public function __construct()
    {
        // Hook into WordPress
        add_action('add_meta_boxes', [$this, 'add_meta_boxes']);
        add_action('save_post_petitioner-petition', [$this, 'save_meta_box_data']);

        add_filter('get_sample_permalink_html', [$this, 'hide_cpt_permalink'], 10, 4);
    }

    /**
     * Add Meta Boxes
     */
    public function add_meta_boxes()
    {
        // Admin fields
        add_meta_box(
            'petition_details',
            'Petition Details',
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
        $petitioner_email = get_post_meta($post->ID, '_petitioner_email', true);
        $petitioner_goal = get_post_meta($post->ID, '_petitioner_goal', true);

        // Output nonce for verification
        wp_nonce_field('save_petition_details', 'petitioner_details_nonce');

        // Display form fields
?>
        <div class="petitioner-admin__form">
            <p>
                <label for="petitioner_title">Petition Title:</label>
                <input type="text" name="petitioner_title" id="petitioner_title" value="<?php echo esc_attr($petitioner_title); ?>"
                    class="widefat">
            </p>
            <p>
                <label for="petitioner_email">Petition Contact Email:</label>
                <input type="email" name="petitioner_email" id="petitioner_email" value="<?php echo esc_attr($petitioner_email); ?>"
                    class="widefat">
            </p>
            <p>
                <label for="petitioner_goal">Signature Goal:</label>
                <input type="number" name="petitioner_goal" id="petitioner_goal" value="<?php echo esc_attr($petitioner_goal); ?>"
                    class="widefat">
            </p>
        </div>
    <?php
    }

    public function render_submissions($post)
    {

        $submission_settings = array(
            'formID' => $post->ID,
        );
    ?>

        <div id="petitioner_submissions" class="petitioner-admin__submissions" data-petitioner-submissions='<?php echo json_encode($submission_settings) ?>'>

            <h3>Submissions</h3>

            <div class="petitioner-admin__entries">
            </div>

            <div class="petitioner-admin__pagination">
                <button class="ptr-prev">pev</button>
                <button class="ptr-next">next</button>
            </div>
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
        echo $post_id;
        // Check if nonce is set
        if (!isset($_POST['petitioner_details_nonce'])) {
            return;
        }

        // Verify nonce
        if (!wp_verify_nonce($_POST['petitioner_details_nonce'], 'save_petition_details')) {
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
        if (isset($_POST['petitioner_title'])) {
            update_post_meta($post_id, '_petitioner_title', sanitize_text_field($_POST['petitioner_title']));
        }

        // Sanitize and save the email field
        if (isset($_POST['petitioner_email'])) {
            update_post_meta($post_id, '_petitioner_email', sanitize_email($_POST['petitioner_email']));
        }

        // Sanitize and save the goal field
        if (isset($_POST['petitioner_goal'])) {
            update_post_meta($post_id, '_petitioner_goal', intval($_POST['petitioner_goal']));
        }
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
}
