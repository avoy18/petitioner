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

    public function test_build_where_clause_handles_contains_operator()
    {
        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            1,
            [['field' => 'comments', 'operator' => 'contains', 'value' => 'test%value_']],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS
        );

        $this->assertStringContainsString('`comments` LIKE %s', $result['where']);
        $this->assertContains('%test\\%value\\_%', $result['params']);
        $this->assertCount(2, $result['params']); // form_id + value
    }

    public function test_build_where_clause_handles_does_not_contain_operator()
    {
        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            1,
            [['field' => 'comments', 'operator' => 'does_not_contain', 'value' => 'spam']],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS
        );

        $this->assertStringContainsString('`comments` NOT LIKE %s', $result['where']);
        $this->assertContains('%spam%', $result['params']);
        $this->assertCount(2, $result['params']); // form_id + value
    }
}
