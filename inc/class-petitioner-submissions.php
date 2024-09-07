<?php

class Petitioner_Submissions
{
    public $form_id = null;
    public function __construct($id  = null)
    {
        $this->form_id = $id;
    }

    public static function create_db_table()
    {
        global $wpdb;

        $table_name = $wpdb->prefix . 'petitioner_submissions';

        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            form_id mediumint(9) NOT NULL,
            fname varchar(255) NOT NULL,
            lname varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            country varchar(255) NOT NULL,
            salutation varchar(255),
            bcc_yourself tinyint(1) DEFAULT 0,
            newsletter tinyint(1) DEFAULT 0,
            hide_name tinyint(1) DEFAULT 0,
            accept_tos tinyint(1) DEFAULT 0,
            submitted_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            KEY form_id (form_id)
        ) $charset_collate;";

        // Include the upgrade file for dbDelta
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');

        // Create the table
        dbDelta($sql);
    }

    public static function handle_form_submit()
    {
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'petitioner_form_nonce')) {
            wp_send_json_error('Invalid nonce');
            wp_die();
        }

        global $wpdb;

        $email = sanitize_email($_POST['petitioner_email']);
        $form_id = sanitize_text_field($_POST['form_id']);
        $fname = sanitize_text_field($_POST['petitioner_fname']) ?? '';
        $lname = sanitize_text_field($_POST['petitioner_lname']) ?? '';

        $data = array(
            'form_id'      => $form_id,
            'email'        => $email,
            'fname'        => $fname,
            'lname'        => $lname,
            'bcc_yourself' => isset($_POST['bcc_yourself']) ? 1 : 0,
            'newsletter'   => isset($_POST['newsletter']) ? 1 : 0,
            'hide_name'    => isset($_POST['hide_name']) ? 1 : 0,
            'accept_tos'   => isset($_POST['accept_tos']) ? 1 : 0,
            'submitted_at' => current_time('mysql'),
        );

        // Insert into the custom table
        $table_name = $wpdb->prefix . 'petitioner_submissions';
        $inserted = $wpdb->insert(
            $table_name,
            $data,
            array(
                '%d', // form_id
                '%s', // email
                '%s', // fname
                '%s', // lname
                '%d', // bcc_yourself
                '%d', // newsletter
                '%d', // hide_name
                '%d', // accept_tos
                '%s', // submitted_at
            )
        );

        // Check if the insert was successful
        if ($inserted === false) {
            wp_send_json_error('Error saving submission.');
        } else {
            wp_send_json_success('Submission saved successfully!');
        }

        wp_die();
    }

    public function get_submissions()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'petitioner_submissions';

        $results = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM $table_name WHERE form_id = %d",
                $this->form_id
            )
        );

        return $results;
    }

    public function get_submission_count()
    {
        $submissions = $this->get_submissions();
        return count($submissions);
    }

    public function get_goal()
    {

        return get_post_meta($this->form_id, '_petitioner_goal', true);
    }
}
