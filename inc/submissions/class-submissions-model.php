<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class AV_Petitioner_Submissions_Model
{
    public static $ALLOWED_FIELDS = [
        'id',
        'form_id',
        'fname',
        'lname',
        'email',
        'date_of_birth',
        'country',
        'salutation',
        'phone',
        'street_address',
        'city',
        'postal_code',
        'comments',
        'bcc_yourself',
        'newsletter',
        'hide_name',
        'accept_tos',
        'approval_status',
        'submitted_at',
        'confirmation_token',
    ];

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
            date_of_birth date DEFAULT NULL,
            country varchar(255) NOT NULL,
            salutation varchar(255),
            phone varchar(50),
            street_address varchar(255),
            city varchar(255),
            postal_code varchar(50),
            comments text,
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
     * Fetches submissions for a specific form ID with pagination and filtering capabilities.
     *
     * @param int $form_id The ID of the form to retrieve submissions for.
     * @param array $settings Optional settings for pagination and filtering. Supported keys:
     *   - 'per_page' (int, default: 10) - Number of submissions per page
     *   - 'offset' (int, default: 0) - Number of submissions to skip
     *   - 'fields' (string|array, default: '*') - Fields to select. Can be '*' for all fields or array of specific field names
     *   - 'query' (array, default: []) - Filter criteria as key-value pairs (field => value)
     *   - 'order' (string, default: 'DESC') - Sort order (ASC or DESC)
     * 
     * @return array Returns an associative array with:
     *   - 'submissions' (array) - Array of submission objects with the following properties:
     *     * id (int) - Unique submission ID
     *     * form_id (int) - ID of the form this submission belongs to
     *     * fname (string) - First name
     *     * lname (string) - Last name
     *     * email (string) - Email address
     *     * country (string) - Country
     *     * salutation (string) - Salutation/title
     *     * phone (string) - Phone number
     *     * street_address (string) - Street address
     *     * city (string) - City
     *     * postal_code (string) - Postal/ZIP code
     *     * comments (string) - Additional comments
     *     * bcc_yourself (int) - Whether to BCC the submitter (0 or 1)
     *     * newsletter (int) - Whether to subscribe to newsletter (0 or 1)
     *     * hide_name (int) - Whether to hide name publicly (0 or 1)
     *     * accept_tos (int) - Whether terms of service were accepted (0 or 1)
     *     * approval_status (string) - Status: 'Confirmed', 'Declined', or 'Pending'
     *     * submitted_at (string) - Submission timestamp (MySQL datetime format)
     *     * confirmation_token (string|null) - Token for email confirmation (null if confirmed)
     *   - 'total' (int) - Total number of submissions matching the criteria (ignores pagination)
     * 
     * @example
     * // Get first 20 submissions with specific fields
     * $result = AV_Petitioner_Submissions_Model::get_form_submissions(123, [
     *     'per_page' => 20,
     *     'fields' => ['id', 'fname', 'lname', 'email', 'submitted_at'],
     *     'order' => 'ASC'
     * ]);
     * 
     * @example
     * // Get confirmed submissions only
     * $result = AV_Petitioner_Submissions_Model::get_form_submissions(123, [
     *     'query' => [['field' => 'approval_status', 'operator' => 'equals', 'value' => 'Confirmed']]
     * ]);
     */
    public static function get_form_submissions($form_id, $settings)
    {
        global $wpdb;

        $per_page   = isset($settings['per_page']) ? absint($settings['per_page']) : 10;
        $offset     = isset($settings['offset']) ? absint($settings['offset']) : 0;
        $fields     = isset($settings['fields']) ? $settings['fields'] : '*';
        $query      = isset($settings['query']) ? $settings['query'] : [];
        $relation   = isset($settings['relation']) ? $settings['relation'] : 'AND';
        $order      = isset($settings['order']) ? $settings['order'] : 'DESC';
        $orderby    = isset($settings['orderby']) ? $settings['orderby'] : 'submitted_at';

        // Validate fields
        $allowed_fields = self::$ALLOWED_FIELDS;

        if ($fields !== '*') {
            $fields_arr = array_intersect($fields, $allowed_fields);
            $fields = implode(', ', $fields_arr);
            if (empty($fields)) {
                $fields = '*';
            }
        }

        $where_clause = self::build_where_clause($form_id, $query, $allowed_fields, $relation);
        $params = $where_clause['params'];

        $where_sql = $where_clause['where'];

        $orderby = in_array($orderby, $allowed_fields, true) ? $orderby : 'submitted_at';
        $order   = strtoupper($order) === 'ASC' ? 'ASC' : 'DESC';

        // Get submissions
        $sql = "SELECT $fields
                FROM {$wpdb->prefix}av_petitioner_submissions 
                WHERE $where_sql 
                ORDER BY $orderby $order 
                LIMIT %d OFFSET %d";

        $params_with_limit = array_merge($params, [$per_page, $offset]);
        $submissions = $wpdb->get_results(
            call_user_func_array([$wpdb, 'prepare'], array_merge([$sql], $params_with_limit))
        );

        // Get total count (do NOT include limit/offset)
        $count_sql = "SELECT COUNT(*) 
                      FROM {$wpdb->prefix}av_petitioner_submissions 
                      WHERE $where_sql";

        $prepared_count = !empty($params)
            ? call_user_func_array([$wpdb, 'prepare'], array_merge([$count_sql], $params))
            : $count_sql;
        $total_submissions = (int) $wpdb->get_var($prepared_count);

        if ($total_submissions === null) {
            $total_submissions = 0; // Ensure we return 0 if no submissions found
        }

        return [
            'submissions'   => $submissions,
            'total'         => $total_submissions,
        ];
    }

    /**
     * Build WHERE clause with parameters for submissions query
     * 
     * @param int $form_id Form ID
     * @param array $query Query conditions (can be simple key-value or operator arrays)
     * @param array $allowed_fields List of allowed field names
     * @return array ['where' => string, 'params' => array]
     * 
     * @since 0.7.0
     */
    public static function build_where_clause($form_id, $query, $allowed_fields, $relation = 'AND')
    {
        $relation = strtoupper($relation) === 'OR' ? 'OR' : 'AND';
        $where = ['form_id = %d'];
        $params = [$form_id];

        $conditions = [];

        foreach ($query as $condition) {
            $field = $condition['field'];
            $operator = $condition['operator'];
            $value = $condition['value'];

            if (!in_array($field, $allowed_fields)) continue;

            switch ($operator) {
                case 'equals':
                    $conditions[] = "`$field` = %s";
                    $params[] = $value;
                    break;
                case 'not_equals':
                    $conditions[] = "`$field` != %s";
                    $params[] = $value;
                    break;
                case 'is_empty':
                    $conditions[] = "(`$field` = '' OR `$field` IS NULL)";
                    break;
                case 'is_not_empty':
                    $conditions[] = "(`$field` != '' AND `$field` IS NOT NULL)";
                    break;
            }
        }

        if (!empty($conditions)) {
            $where[] = '(' . implode(' ' . $relation . ' ', $conditions) . ')';
        }

        return ['where' => implode(' AND ', $where), 'params' => $params];
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
     * @param int|string $id Submission ID.
     * @param array $fields Associative array of fields to update (column => value).
     * @return int|false Number of rows updated or false on failure.
     */
    public static function update_submission($id, $fields)
    {
        global $wpdb;

        $id = absint($id);
        if (!$id || empty($fields)) {
            av_ptr_error_log(AV_Petitioner_Labels::get('error_generic'));
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

    /**
     * Delete a single submission by ID.
     *
     * @param int|string $submission_id Submission ID.
     * @return int|false Number of rows deleted or false on failure.
     */
    public static function delete_submission($submission_id)
    {
        global $wpdb;
        $id = absint($submission_id);

        if (!$id) {
            return false;
        }

        $table = $wpdb->prefix . 'av_petitioner_submissions';

        return $wpdb->delete(
            $table,
            ['id' => $id],
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
    public static function create_submission($data)
    {
        global $wpdb;
        $table = $wpdb->prefix . 'av_petitioner_submissions';

        $field_formats = [
            'id'                => '%d',
            'form_id'           => '%d',
            'fname'             => '%s',
            'lname'             => '%s',
            'email'             => '%s',
            'date_of_birth'     => '%s',
            'country'           => '%s',
            'salutation'        => '%s',
            'phone'             => '%s',
            'street_address'    => '%s',
            'city'              => '%s',
            'postal_code'       => '%s',
            'comments'          => '%s',
            'bcc_yourself'      => '%d',
            'newsletter'        => '%d',
            'hide_name'         => '%d',
            'accept_tos'        => '%d',
            'approval_status'   => '%s',
            'submitted_at'      => '%s',
            'confirmation_token' => '%s',
        ];

        $formats = [];
        foreach ($data as $key => $value) {
            $formats[] = $field_formats[$key] ?? '%s'; // fallback safe
        }

        $inserted = $wpdb->insert($table, $data, $formats);
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
     * @param int $form_id Form ID
     * @param array $settings Optional settings for filtering and pagination. Supported keys:
     *   - 'query' (array, default: []) - Filter criteria as key-value pairs (field => value)
     *   - 'relation' (string, default: 'AND') - Logical relation between conditions (AND or OR)
     *   - 'per_page' (int, default: 10) - Number of submissions per page
     *   - 'offset' (int, default: 0) - Number of submissions to skip
     *   - 'fields' (string|array, default: '*') - Fields to select. Can be '*' for all fields or array of specific field names
     *   - 'order' (string, default: 'DESC') - Sort order (ASC or DESC)
     *   - 'orderby' (string, default: 'submitted_at') - Field to sort by
     * 
     * @return int The total count of submissions matching the criteria.
     */
    public static function get_submission_count($form_id, $settings = [])
    {
        global $wpdb;

        $table_name = self::table_name();
        $query = isset($settings['query']) ? $settings['query'] : [];
        $relation = isset($settings['relation']) ? $settings['relation'] : 'AND';

        // Default: only count confirmed submissions if no query is provided
        if (empty($query)) {
            $query = [
                ['field' => 'approval_status', 'operator' => 'equals', 'value' => 'Confirmed']
            ];
        }

        // Build WHERE clause
        $where_data = self::build_where_clause($form_id, $query, self::$ALLOWED_FIELDS, $relation);

        // Get the count
        $sql = "SELECT COUNT(*) FROM {$table_name} WHERE {$where_data['where']}";

        // Prepare query with params if any exist
        $prepared_sql = !empty($where_data['params'])
            ? call_user_func_array([$wpdb, 'prepare'], array_merge([$sql], $where_data['params']))
            : $sql;

        return (int) $wpdb->get_var($prepared_sql);
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
