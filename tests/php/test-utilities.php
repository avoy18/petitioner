<?php

use WorDBless\BaseTestCase;

class Test_Utilities extends BaseTestCase
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
    // AV_PETITIONER_PARSE_CONDITIONAL_LOGIC TESTS
    // ============================================

    public function test_parse_conditional_logic_returns_null_for_empty_input()
    {
        $this->assertNull(av_petitioner_parse_conditional_logic(''));
        $this->assertNull(av_petitioner_parse_conditional_logic(null));
        $this->assertNull(av_petitioner_parse_conditional_logic(0));
        $this->assertNull(av_petitioner_parse_conditional_logic(false));
    }

    public function test_parse_conditional_logic_returns_null_for_invalid_json()
    {
        $invalid_json = '{invalid:json}';
        
        $result = av_petitioner_parse_conditional_logic($invalid_json);
        
        $this->assertNull($result);
    }

    public function test_parse_conditional_logic_returns_null_for_non_array_json()
    {
        // Valid JSON but parses to a string, not an array
        $json_string = '"just a string"';
        
        $result = av_petitioner_parse_conditional_logic($json_string);
        
        $this->assertNull($result);
    }

    public function test_parse_conditional_logic_returns_null_when_conditions_key_missing()
    {
        // Valid JSON array/object, but no 'conditions' key
        $json_missing_conditions = json_encode(['other_key' => 'value']);
        
        $result = av_petitioner_parse_conditional_logic($json_missing_conditions);
        
        $this->assertNull($result);
    }

    public function test_parse_conditional_logic_returns_parsed_array_for_valid_input()
    {
        $valid_data = [
            'conditions' => [
                [
                    'field'    => 'email',
                    'operator' => 'equals',
                    'value'    => 'test@example.com'
                ]
            ],
            'match'      => 'all'
        ];
        $valid_json = json_encode($valid_data);
        
        $result = av_petitioner_parse_conditional_logic($valid_json);
        
        $this->assertEquals($valid_data, $result);
    }

    // ============================================
    // AV_PETITIONER_BUILD_MODEL_QUERY TESTS
    // ============================================

    public function test_build_model_query_handles_contains_operator()
    {
        $conditional_logic = [
            'conditions' => [
                [
                    'field'    => 'name',
                    'operator' => 'contains',
                    'value'    => 'John'
                ]
            ]
        ];

        $result = av_petitioner_build_model_query($conditional_logic);

        $this->assertCount(1, $result);
        $this->assertEquals('name', $result[0]['field']);
        $this->assertEquals('contains', $result[0]['operator']);
        $this->assertEquals('John', $result[0]['value']);
    }

    public function test_build_model_query_handles_does_not_contain_operator()
    {
        $conditional_logic = [
            'conditions' => [
                [
                    'field'    => 'email',
                    'operator' => 'does_not_contain',
                    'value'    => '@spam.com'
                ]
            ]
        ];

        $result = av_petitioner_build_model_query($conditional_logic);

        $this->assertCount(1, $result);
        $this->assertEquals('email', $result[0]['field']);
        $this->assertEquals('does_not_contain', $result[0]['operator']);
        $this->assertEquals('@spam.com', $result[0]['value']);
    }

    public function test_build_model_query_ignores_empty_values_for_contains()
    {
        $conditional_logic = [
            'conditions' => [
                [
                    'field'    => 'name',
                    'operator' => 'contains',
                    'value'    => ''
                ]
            ]
        ];

        $result = av_petitioner_build_model_query($conditional_logic);

        $this->assertCount(0, $result);
    }

    public function test_build_model_query_ignores_null_values_for_does_not_contain()
    {
        $conditional_logic = [
            'conditions' => [
                [
                    'field'    => 'name',
                    'operator' => 'does_not_contain',
                    'value'    => null
                ]
            ]
        ];

        $result = av_petitioner_build_model_query($conditional_logic);

        $this->assertCount(0, $result);
    }
}
