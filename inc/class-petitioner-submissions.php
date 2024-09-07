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

    /**
     * Static function used for the API
     * @return void
     */
    public static function api_handle_form_submit()
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

    public static function api_fetch_form_submissions()
    {
        global $wpdb;

        // Get the form ID and pagination info from the request
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $per_page = isset($_GET['per_page']) ? intval($_GET['per_page']) : 10;
        $offset = ($page - 1) * $per_page;
        $form_id = isset($_GET['form_id']) ? intval($_GET['form_id']) : 0;

        // Check if form_id is valid
        if (!$form_id) {
            wp_send_json_error('Invalid form ID.');
            wp_die();
        }

        // Get the submissions for the specified form_id with LIMIT and OFFSET for pagination
        $table_name = $wpdb->prefix . 'petitioner_submissions';
        $submissions = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT fname AS name, email FROM $table_name WHERE form_id = %d LIMIT %d OFFSET %d",
                $form_id,
                $per_page,
                $offset
            )
        );

        // Get the total count of submissions for the form
        $total_submissions = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM $table_name WHERE form_id = %d",
                $form_id
            )
        );

        // Calculate the total number of pages
        $total_pages = ceil($total_submissions / $per_page);

        // Return the results as a JSON response
        wp_send_json_success(array(
            'submissions' => $submissions,
            'total' => $total_submissions,
            'total_pages' => $total_pages,
            'current_page' => $page,
            'per_page' => $per_page,
        ));

        wp_die();
    }

    public function get_submission_count()
    {
        global $wpdb;
        $total_entries = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}petitioner_submissions");
        return $total_entries;
    }

    public function get_goal()
    {

        return get_post_meta($this->form_id, '_petitioner_goal', true);
    }
}
