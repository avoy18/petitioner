<?php

class Petitioner_Submissions
{
    public function __construct()
    {
    }


    public function handle_form_submit()
    {
        // Check if the nonce is valid (security check).
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'petitioner_form_nonce')) {
            wp_send_json_error('Invalid nonce');
            wp_die();
        }

        // Sanitize and validate form data.
        $email = sanitize_email($_POST['petitioner_email']);
        $form_id = sanitize_text_field($_POST['form_id']);

        // Prepare the post data
        $new_petition = array(
            'post_title' => $email . ' - ' . $form_id,
            'post_status' => 'publish',
            'post_type' => 'petitioner-entry',
            'meta_input' => array(
                'email' => $email,
                'fname' => sanitize_text_field($_POST['petitioner_fname']) ?? '',
                'lname' => sanitize_text_field($_POST['petitioner_lname']) ?? '',
            ),
        );

        // Insert the post into the database
        $post_id = wp_insert_post($new_petition);

        if (is_wp_error($post_id)) {
            wp_send_json_error('Error creating petition.');
        } else {
            wp_send_json_success('Petition created successfully!');
        }

        wp_die();
    }

    public function get_goal($id = '8'){

        $current_petition = get_post($id);

        print_r($current_petition);


    }

}