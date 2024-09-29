<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class AV_Petitioner_Submissions
{
    public $form_id = null;
    public function __construct($id  = null)
    {
        $this->form_id = $id;
    }

    public static function create_db_table()
    {
        global $wpdb;

        $sql = 'CREATE TABLE ' . $wpdb->prefix . 'av_petitioner_submissions';
        $sql .= " (
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
        )";
        $sql .= ' ' . $wpdb->get_charset_collate() . ';';

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
        $wpnonce = !empty($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';

        if (!isset($wpnonce) || !wp_verify_nonce($wpnonce, 'petitioner_form_nonce')) {
            wp_send_json_error('Invalid nonce');
            wp_die();
        }

        global $wpdb;

        $email   = isset($_POST['petitioner_email']) ? sanitize_email(wp_unslash($_POST['petitioner_email'])) : '';
        $form_id = isset($_POST['form_id']) ? sanitize_text_field(wp_unslash($_POST['form_id'])) : '';
        $fname   = isset($_POST['petitioner_fname']) ? sanitize_text_field(wp_unslash($_POST['petitioner_fname'])) : '';
        $lname   = isset($_POST['petitioner_lname']) ? sanitize_text_field(wp_unslash($_POST['petitioner_lname'])) : '';
        $bcc     = !empty($_POST['petitioner_bcc']) && sanitize_text_field(wp_unslash($_POST['petitioner_bcc'])) === 'on';

        // todo: add these
        $hide_name = false;
        $newsletter_opt_in = false;
        $accept_tos = false;

        // Insert into the custom table

        // Query the custom table to check if the email already exists
        $email_findings = $wpdb->get_var($wpdb->prepare(
            'SELECT COUNT(*) FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE email = %s AND form_id = %d',
            $email,
            $form_id
        ));

        $email_exists = $email_findings > 0;

        if ($email_exists) {
            wp_send_json_error(__('Looks like you\'ve already signed this petition!', 'petitioner'));
        }

        $data = array(
            'form_id'      => $form_id,
            'email'        => $email,
            'fname'        => $fname,
            'lname'        => $lname,
            'bcc_yourself' => $bcc ? 1 : 0,
            'newsletter'   => $newsletter_opt_in ? 1 : 0,
            'hide_name'    => $hide_name ? 1 : 0,
            'accept_tos'   => $accept_tos ? 1 : 0,
            'submitted_at' => current_time('mysql'),
        );

        $inserted = $wpdb->insert(
            $wpdb->prefix . 'av_petitioner_submissions',
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


        $mailer_settings = array(
            'target_email' => get_post_meta($form_id, '_petitioner_email', true),
            'target_cc_emails' => get_post_meta($form_id, '_petitioner_cc_emails', true),
            'user_email' => $email,
            'user_name' => $fname . ' ' . $lname,
            'letter' => get_post_meta($form_id, '_petitioner_letter', true),
            'subject' => get_post_meta($form_id, '_petitioner_subject', true),
            'bcc' => $bcc,
            'send_to_representative' => get_post_meta($form_id, '_petitioner_send_to_representative', true),
        );

        $mailer = new AV_Petitioner_Mailer($mailer_settings);

        $send_emails = $mailer->send_emails();

        // Check if the insert was successful
        if ($inserted === false || $send_emails === false) {
            wp_send_json_error(__('Error saving submission. Please try again.', 'petitioner'));
        } else {
            wp_send_json_success(__('Your signature has been added!', 'petitioner'));
        }

        wp_die();
    }

    public static function api_fetch_form_submissions()
    {
        global $wpdb;

        // Get the form ID and pagination info from the request
        $page = isset($_GET['page']) ? intval($_GET['page']) : 1;
        $per_page = isset($_GET['per_page']) ? intval($_GET['per_page']) : 1000;
        $offset = ($page - 1) * $per_page;
        $form_id = isset($_GET['form_id']) ? intval($_GET['form_id']) : 0;

        // Check if form_id is valid
        if (!$form_id) {
            wp_send_json_error('Invalid form ID.');
            wp_die();
        }

        // Get the submissions for the specified form_id with LIMIT and OFFSET for pagination
        $submissions = $wpdb->get_results(
            $wpdb->prepare(
                'SELECT * FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE form_id = %d LIMIT %d OFFSET %d',
                $form_id,
                $per_page,
                $offset
            )
        );

        // Get the total count of submissions for the form
        $total_submissions = $wpdb->get_var(
            $wpdb->prepare(
                'SELECT COUNT(*) FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE form_id = %d',
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

    public static function api_petitioner_export_csv()
    {
        global $wpdb;

        $form_id = isset($_GET['form_id']) ? intval($_GET['form_id']) : 0;

        $results = $wpdb->get_results(
            $wpdb->prepare(
                'SELECT * FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE form_id = %d',
                $form_id,
            )
        );

        if (empty($results)) {
            wp_die('No submissions available.');
        }

        // Set the headers to force download
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=petition_submissions.csv');

        // Open output stream for writing
        $output = fopen('php://output', 'w');

        // Output the column headings (customize as per your table structure)
        fputcsv($output, array('ID', 'First Name', 'Last Name', 'Email', 'Country', 'Salutation', 'BCC Yourself', 'Newsletter', 'Hide Name', 'Accept TOS', 'Submitted At'));

        // Loop over the rows and output them as CSV
        foreach ($results as $row) {
            fputcsv($output, array(
                $row->id,
                $row->fname,
                $row->lname,
                $row->email,
                $row->country,
                $row->salutation,
                $row->bcc_yourself,
                $row->newsletter,
                $row->hide_name,
                $row->accept_tos,
                $row->submitted_at
            ));
        }

        // Close the output stream
        fclose($output);

        // Prevent any further output (like HTML or errors)
        exit;
    }

    public function get_submission_count()
    {
        global $wpdb;

        // Get the total count of submissions for the form
        $total_submissions = $wpdb->get_var(
            $wpdb->prepare(
                'SELECT COUNT(*) FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE form_id = %d',
                $this->form_id
            )
        );

        return $total_submissions;
    }
}
