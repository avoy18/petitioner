<?php

use WorDBless\BaseTestCase;

class Test_CSV_Exporter extends BaseTestCase
{

    public function set_up()
    {
        parent::set_up();
    }

    public function tear_down()
    {
        parent::tear_down();
    }

    // ============================================
    // SANITIZE_CSV_VALUE TESTS
    // ============================================

    public function test_sanitize_csv_value_handles_safe_values()
    {
        $this->assertEquals('John Doe', AV_Petitioner_CSV_Exporter::sanitize_csv_value('John Doe'));
        $this->assertEquals('123', AV_Petitioner_CSV_Exporter::sanitize_csv_value('123'));
        $this->assertEquals('test@example.com', AV_Petitioner_CSV_Exporter::sanitize_csv_value('test@example.com'));
    }

    public function test_sanitize_csv_value_prevents_formula_injection_with_equals()
    {
        $result = AV_Petitioner_CSV_Exporter::sanitize_csv_value('=1+1');
        $this->assertEquals("'=1+1", $result);
    }

    public function test_sanitize_csv_value_prevents_formula_injection_with_plus()
    {
        $result = AV_Petitioner_CSV_Exporter::sanitize_csv_value('+1+1');
        $this->assertEquals("'+1+1", $result);
    }

    public function test_sanitize_csv_value_prevents_formula_injection_with_minus()
    {
        $result = AV_Petitioner_CSV_Exporter::sanitize_csv_value('-1+1');
        $this->assertEquals("'-1+1", $result);
    }

    public function test_sanitize_csv_value_prevents_formula_injection_with_at()
    {
        $result = AV_Petitioner_CSV_Exporter::sanitize_csv_value('@SUM(A1:A10)');
        $this->assertEquals("'@SUM(A1:A10)", $result);
    }

    public function test_sanitize_csv_value_handles_leading_whitespace()
    {
        // Leading whitespace should be trimmed before checking dangerous chars
        $result = AV_Petitioner_CSV_Exporter::sanitize_csv_value('  =1+1');
        $this->assertEquals("'=1+1", $result);
    }

    public function test_sanitize_csv_value_handles_empty_string()
    {
        $this->assertEquals('', AV_Petitioner_CSV_Exporter::sanitize_csv_value(''));
    }

    public function test_sanitize_csv_value_handles_null()
    {
        $this->assertEquals('', AV_Petitioner_CSV_Exporter::sanitize_csv_value(null));
    }

    public function test_sanitize_csv_value_handles_integer()
    {
        $this->assertEquals('123', AV_Petitioner_CSV_Exporter::sanitize_csv_value(123));
    }

    public function test_sanitize_csv_value_does_not_escape_safe_equals()
    {
        // Only escapes if = is at the START (after trimming)
        $this->assertEquals('test=value', AV_Petitioner_CSV_Exporter::sanitize_csv_value('test=value'));
    }

    // ============================================
    // GET_CSV_HEADERS TESTS
    // ============================================

    public function test_get_csv_headers_returns_array()
    {
        $headers = AV_Petitioner_CSV_Exporter::get_csv_headers(1);
        $this->assertIsArray($headers);
    }

    public function test_get_csv_headers_excludes_custom_properties()
    {
        $headers = AV_Petitioner_CSV_Exporter::get_csv_headers(1);

        // Should not contain 'custom_properties' as a header
        // (it's handled separately via filter)
        $this->assertNotContains('custom_properties', $headers);
    }

    public function test_get_csv_headers_includes_standard_fields()
    {
        $headers = AV_Petitioner_CSV_Exporter::get_csv_headers(1);

        // Should include headers for standard fields
        $this->assertNotEmpty($headers);
        $this->assertGreaterThan(0, count($headers));
    }

    public function test_get_csv_headers_prevents_duplicate_headers()
    {
        // Mock labels to create duplicates
        add_filter('av_petitioner_get_form_labels', function ($labels, $form_id, $field_ids) {
            return ['fname' => 'Name', 'lname' => 'Name']; // Duplicate labels
        }, 10, 3);

        $headers = AV_Petitioner_CSV_Exporter::get_csv_headers(1);

        // Check for duplicates
        $unique_headers = array_unique($headers);
        $this->assertEquals(count($headers), count($unique_headers), 'Headers should be unique');

        remove_all_filters('av_petitioner_get_form_labels');
    }

    public function test_get_csv_headers_handles_empty_labels()
    {
        add_filter('av_petitioner_get_form_labels', function ($labels) {
            return ['fname' => '']; // Empty label
        }, 10, 1);

        $headers = AV_Petitioner_CSV_Exporter::get_csv_headers(1);

        // Should have fallback to field name format
        $this->assertNotEmpty($headers[0]);

        remove_all_filters('av_petitioner_get_form_labels');
    }

    // ============================================
    // GET_CSV_ROW TESTS
    // ============================================

    public function test_get_csv_row_returns_array()
    {
        $submission = (object) ['id' => 1, 'fname' => 'John'];
        $row = AV_Petitioner_CSV_Exporter::get_csv_row($submission);

        $this->assertIsArray($row);
    }

    public function test_get_csv_row_includes_all_allowed_fields()
    {
        $submission = (object) [
            'id' => 1,
            'form_id' => 1,
            'fname' => 'John',
            'lname' => 'Doe',
            'email' => 'john@example.com',
            'country' => 'US'
        ];

        $row = AV_Petitioner_CSV_Exporter::get_csv_row($submission);

        // Should have values for all allowed fields (minus custom_properties)
        $expected_count = count(AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS) - 1; // -1 for custom_properties
        $this->assertCount($expected_count, $row);
    }

    public function test_get_csv_row_excludes_custom_properties()
    {
        $submission = (object) [
            'id' => 1,
            'fname' => 'John',
            'custom_properties' => '{"key":"value"}'
        ];

        $row = AV_Petitioner_CSV_Exporter::get_csv_row($submission);

        // custom_properties should be skipped (handled via filter)
        // The row count should match allowed fields minus custom_properties
        $expected_count = count(AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS) - 1;
        $this->assertCount($expected_count, $row);
    }

    public function test_get_csv_row_handles_missing_fields()
    {
        $submission = (object) ['id' => 1]; // Only has id

        $row = AV_Petitioner_CSV_Exporter::get_csv_row($submission);

        // Should still return array with empty strings for missing fields
        $this->assertIsArray($row);
        $this->assertNotEmpty($row);
    }

    public function test_get_csv_row_sanitizes_values()
    {
        $submission = (object) [
            'id' => 1,
            'fname' => '=1+1', // Dangerous value
            'lname' => 'Doe'
        ];

        $row = AV_Petitioner_CSV_Exporter::get_csv_row($submission);

        // fname should be sanitized (prefixed with ')
        $this->assertStringStartsWith("'=", $row[2]); // fname is 3rd field (after id, form_id)
    }
}
