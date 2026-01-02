<?php

use WorDBless\BaseTestCase;

class Test_Submissions_Model extends BaseTestCase
{

    public function set_up()
    {
        parent::set_up();

        // Create the submissions table
        AV_Petitioner_Submissions_Model::create_db_table();
    }

    public function tear_down()
    {
        parent::tear_down();
    }

    // ============================================
    // GET_PUBLIC_FIELDS TESTS
    // ============================================

    public function test_get_public_fields_returns_expected_fields()
    {
        $public_fields = AV_Petitioner_Submissions_Model::get_public_fields();

        $this->assertIsArray($public_fields);
        $this->assertContains('country', $public_fields);
        $this->assertContains('city', $public_fields);
        $this->assertNotContains('email', $public_fields);
        $this->assertNotContains('phone', $public_fields);
        $this->assertNotContains('street_address', $public_fields);
    }

    public function test_get_public_fields_excludes_all_sensitive_fields()
    {
        $public_fields = AV_Petitioner_Submissions_Model::get_public_fields();
        $sensitive = AV_Petitioner_Submissions_Model::$SENSITIVE_FIELDS;

        foreach ($sensitive as $field) {
            $this->assertNotContains($field, $public_fields, "Sensitive field '{$field}' should not be public");
        }
    }

    public function test_get_public_fields_excludes_internal_fields()
    {
        $public_fields = AV_Petitioner_Submissions_Model::get_public_fields();
        $internal = ['id', 'fname', 'lname', 'hide_name'];

        foreach ($internal as $field) {
            $this->assertNotContains($field, $public_fields, "Internal field '{$field}' should not be public");
        }
    }

    public function test_get_public_fields_returns_numeric_keys()
    {
        $public_fields = AV_Petitioner_Submissions_Model::get_public_fields();

        $keys = array_keys($public_fields);
        $this->assertEquals(range(0, count($public_fields) - 1), $keys, 'Should have numeric keys (array_values)');
    }

    // ============================================
    // BUILD_WHERE_CLAUSE TESTS
    // ============================================

    public function test_build_where_clause_includes_form_id()
    {
        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            123,
            [],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS
        );

        $this->assertStringContainsString('form_id = %d', $result['where']);
        $this->assertEquals([123], $result['params']);
    }

    public function test_build_where_clause_handles_equals_operator()
    {
        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            1,
            [['field' => 'approval_status', 'operator' => 'equals', 'value' => 'Confirmed']],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS
        );

        $this->assertStringContainsString('`approval_status` = %s', $result['where']);
        $this->assertContains('Confirmed', $result['params']);
        $this->assertCount(2, $result['params']); // form_id + value
    }

    public function test_build_where_clause_handles_not_equals_operator()
    {
        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            1,
            [['field' => 'approval_status', 'operator' => 'not_equals', 'value' => 'Declined']],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS
        );

        $this->assertStringContainsString('`approval_status` != %s', $result['where']);
        $this->assertContains('Declined', $result['params']);
    }

    public function test_build_where_clause_handles_is_empty_operator()
    {
        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            1,
            [['field' => 'comments', 'operator' => 'is_empty', 'value' => '']],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS
        );

        $this->assertStringContainsString('IS NULL', $result['where']);
        $this->assertStringContainsString("= ''", $result['where']);
        $this->assertCount(1, $result['params']); // Only form_id, no value param
    }

    public function test_build_where_clause_handles_is_not_empty_operator()
    {
        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            1,
            [['field' => 'comments', 'operator' => 'is_not_empty', 'value' => '']],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS
        );

        $this->assertStringContainsString('IS NOT NULL', $result['where']);
        $this->assertStringContainsString("!= ''", $result['where']);
        $this->assertCount(1, $result['params']); // Only form_id, no value param
    }

    public function test_build_where_clause_handles_multiple_conditions_with_and()
    {
        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            1,
            [
                ['field' => 'approval_status', 'operator' => 'equals', 'value' => 'Confirmed'],
                ['field' => 'country', 'operator' => 'equals', 'value' => 'US']
            ],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS,
            'AND'
        );

        $this->assertStringContainsString('AND', $result['where']);
        $this->assertCount(3, $result['params']); // form_id + 2 values
    }

    public function test_build_where_clause_handles_multiple_conditions_with_or()
    {
        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            1,
            [
                ['field' => 'approval_status', 'operator' => 'equals', 'value' => 'Confirmed'],
                ['field' => 'approval_status', 'operator' => 'equals', 'value' => 'Pending']
            ],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS,
            'OR'
        );

        $this->assertStringContainsString('OR', $result['where']);
        $this->assertCount(3, $result['params']); // form_id + 2 values
    }

    public function test_build_where_clause_ignores_invalid_fields()
    {
        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            1,
            [
                ['field' => 'invalid_field', 'operator' => 'equals', 'value' => 'test'],
                ['field' => 'approval_status', 'operator' => 'equals', 'value' => 'Confirmed']
            ],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS
        );

        $this->assertStringNotContainsString('invalid_field', $result['where']);
        $this->assertStringContainsString('approval_status', $result['where']);
        $this->assertCount(2, $result['params']); // form_id + only valid field value
    }

    public function test_build_where_clause_handles_lowercase_relation()
    {
        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            1,
            [
                ['field' => 'approval_status', 'operator' => 'equals', 'value' => 'Confirmed'],
                ['field' => 'country', 'operator' => 'equals', 'value' => 'US']
            ],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS,
            'and' // lowercase
        );

        $this->assertStringContainsString('AND', $result['where']); // Should be uppercase
    }

    public function test_build_where_clause_handles_uppercase_relation()
    {
        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            1,
            [
                ['field' => 'approval_status', 'operator' => 'equals', 'value' => 'Confirmed'],
                ['field' => 'country', 'operator' => 'equals', 'value' => 'US']
            ],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS,
            'OR' // uppercase
        );

        $this->assertStringContainsString('OR', $result['where']);
    }
}
