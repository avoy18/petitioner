<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class AV_Petitioner_Submissions_Model
{

    public static function table_name()
    {
        global $wpdb;
        return $wpdb->prefix . 'av_petitioner_submissions';
    }

    public static function create_db_table()
    {
        global $wpdb;

        $sql = 'CREATE TABLE ' . self::table_name();
        $sql .= " (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            form_id mediumint(9) NOT NULL,
            fname varchar(255) NOT NULL,
            lname varchar(255) NOT NULL,
            email varchar(255) NOT NULL,
            country varchar(255) NOT NULL,
            salutation varchar(255),
            phone varchar(50),
            street_address varchar(255),
            city varchar(255),
            postal_code varchar(50),
            bcc_yourself tinyint(1) DEFAULT 0,
            newsletter tinyint(1) DEFAULT 0,
            hide_name tinyint(1) DEFAULT 0,
            accept_tos tinyint(1) DEFAULT 0,
            approval_status varchar(255) DEFAULT 'Confirmed',
            submitted_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            confirmation_token varchar(64) DEFAULT NULL,
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
     * Retrieves form submissions with pagination and filtering options.
     *
     * This method fetches submissions for a specific form ID, allowing for pagination
     * and optional filtering based on provided settings.
     *
     * @param int $form_id The ID of the form to retrieve submissions for.
     * @param array $settings Optional settings for pagination and filtering.
     * @return array An array containing the submissions and total count.
     */
    public static function get_form_submissions($form_id, $settings)
    {
        global $wpdb;

        $per_page = isset($settings['per_page']) ? absint($settings['per_page']) : 10;
        $offset   = isset($settings['offset']) ? absint($settings['offset']) : 0;
        $fields   = isset($settings['fields']) ? $settings['fields'] : '*';
        $query    = isset($settings['query']) ? $settings['query'] : [];

        // Validate fields
        $allowed_fields = [
            'id',
            'form_id',
            'fname',
            'lname',
            'email',
            'country',
            'salutation',
            'phone',
            'street_address',
            'city',
            'postal_code',
            'bcc_yourself',
            'newsletter',
            'hide_name',
            'accept_tos',
            'approval_status',
            'submitted_at',
            'confirmation_token'
        ];

        if ($fields !== '*') {
            $fields_arr = array_intersect($fields, $allowed_fields);
            $fields = implode(', ', $fields_arr);
            if (empty($fields)) {
                $fields = '*';
            }
        }

        $where = ['form_id = %d'];
        $params = [$form_id];

        if (!empty($query)) {
            foreach ($query as $k => $v) {
                if (preg_match('/^[a-zA-Z0-9_]+$/', $k) && in_array($k, $allowed_fields)) {
                    $where[] = "`$k` = %s";
                    $params[] = $v;
                }
            }
        }
       
        $where_sql = implode(' AND ', $where);

        // Get submissions
        $sql = "SELECT $fields FROM {$wpdb->prefix}av_petitioner_submissions WHERE $where_sql LIMIT %d OFFSET %d";
        $params_with_limit = array_merge($params, [$per_page, $offset]);
        $submissions = $wpdb->get_results($wpdb->prepare($sql, ...$params_with_limit));

        // Get total count (do NOT include limit/offset)
        $count_sql = "SELECT COUNT(*) FROM {$wpdb->prefix}av_petitioner_submissions WHERE $where_sql";
        $total_submissions = $wpdb->get_var($wpdb->prepare($count_sql, ...$params));

        if ($total_submissions === null) {
            $total_submissions = 0; // Ensure we return 0 if no submissions found
        }

        return [
            'submissions'   => $submissions,
            'total'         => $total_submissions,
        ];
    }

    public static function get_unconfirmed_submissions($form_id)
    {
        global $wpdb;
        $table = $wpdb->prefix . 'av_petitioner_submissions';

        return $wpdb->get_results(
            $wpdb->prepare("
                SELECT * FROM $table
                WHERE form_id = %d AND approval_status = 'Declined' AND confirmation_token IS NOT NULL
            ", $form_id)
        );
    }

    /**
     * Update a single submission by ID.
     *
     * @param int $id Submission ID.
     * @param array $fields Associative array of fields to update (column => value).
     * @return int|false Number of rows updated or false on failure.
     */
    public static function update_submission($id, array $fields)
    {
        global $wpdb;

        $id = absint($id);
        if (!$id || empty($fields)) {
            return false;
        }

        $table = $wpdb->prefix . 'av_petitioner_submissions';

        return $wpdb->update(
            $table,
            $fields,           // what to update
            ['id' => $id],     // where clause
            null,              // formats (optional)
            ['%d']             // id is always int
        );
    }

    public static function get_submission_by_id($submission_id)
    {
        global $wpdb;

        // Get a single submission by its ID
        $submission = $wpdb->get_row(
            $wpdb->prepare(
                'SELECT * FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE id = %d',
                $submission_id
            )
        );

        return $submission;
    }

    /**
     * Create a new petition submission in the database.
     *
     * @param array $data Associative array of submission data.
     * @return int|false Inserted row ID on success, false on failure.
     */
    public static function create_submission(array $data)
    {
        global $wpdb;

        $table = $wpdb->prefix . 'av_petitioner_submissions';

        $formats = [
            '%d', // form_id
            '%s', // email
            '%s', // fname
            '%s', // lname
            '%s', // country
            '%d', // bcc_yourself
            '%s', // phone
            '%s', // street_address
            '%s', // city
            '%s', // postal_code
            '%d', // newsletter
            '%d', // hide_name
            '%d', // accept_tos
            '%s', // submitted_at
            '%s', // approval_status
            '%s', // confirmation_token (optional)
        ];

        // Only use formats up to the number of fields provided
        $used_formats = array_slice($formats, 0, count($data));

        $inserted = $wpdb->insert($table, $data, $used_formats);

        return $inserted ? $wpdb->insert_id : false;
    }

    /**
     * Retrieves the count of submissions for a specific form based on approval status.
     *
     * This method calculates the total number of submissions for the form identified
     * by `$this->form_id`. It considers the approval status of the submissions and
     * adjusts the count based on whether approval is required and the default approval
     * status of the form.
     *
     * @return int The total count of submissions matching the criteria.
     */
    public static function get_submission_count($form_id)
    {
        global $wpdb;

        $table_name = self::table_name();

        // Get the total count of submissions for the form
        return $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$table_name} WHERE form_id = %d AND approval_status = 'Confirmed'",
                $form_id,
            )
        );
    }

    /**
     * Retrieves the count of unverified submissions for a specific form.
     *
     * This method calculates the total number of unverified submissions for the
     * form identified by `$this->form_id`. It considers the approval status of
     * the submissions and returns the count of those that are pending approval.
     *
     * @return int The total count of unverified submissions.
     */
    public static function get_unconfirmed_count($form_id)
    {
        global $wpdb;

        $table_name = self::table_name();

        // Get the total count of unverified submissions for the form
        return $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$table_name} WHERE form_id = %d AND approval_status = 'Declined'",
                $form_id,
            )
        );
    }


    /**
     * Checks if a given email address is a duplicate for a specific form ID.
     *
     * This method queries a custom database table to determine if the provided
     * email address already exists for the specified form ID.
     *
     * @param string $email   The email address to check for duplicates.
     * @param int    $form_id The ID of the form to check against.
     *
     * @global wpdb $wpdb WordPress database abstraction object.
     *
     * @return bool True if the email is a duplicate, false otherwise.
     */
    public static function check_duplicate_email($email, $form_id)
    {
        global $wpdb;

        // Query the custom table to check if the email already exists
        $email_findings = $wpdb->get_var($wpdb->prepare(
            'SELECT COUNT(*) FROM ' . $wpdb->prefix . 'av_petitioner_submissions' . ' WHERE email = %s AND form_id = %d',
            $email,
            $form_id
        ));

        return $email_findings > 0;
    }
}
