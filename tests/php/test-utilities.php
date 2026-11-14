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
    // FORM POST TYPE HELPERS
    // ============================================

    public function test_form_post_types_include_petition_and_contact()
    {
        $this->assertSame(['petitioner-petition', 'petitioner-contact'], av_petitioner_get_form_post_types());
        $this->assertTrue(av_petitioner_is_form_post_type('petitioner-petition'));
        $this->assertTrue(av_petitioner_is_form_post_type('petitioner-contact'));
        $this->assertFalse(av_petitioner_is_form_post_type('post'));
    }

    public function test_form_post_types_are_filterable()
    {
        $add_type = function ($post_types) {
            $post_types[] = 'petitioner-extra';
            return $post_types;
        };
        add_filter('av_petitioner_form_post_types', $add_type);

        $this->assertTrue(av_petitioner_is_form_post_type('petitioner-extra'));

        remove_filter('av_petitioner_form_post_types', $add_type);
    }

    public function test_is_form_post()
    {
        $form_id = wp_insert_post(['post_type' => 'petitioner-petition', 'post_status' => 'publish']);
        $post_id = wp_insert_post(['post_type' => 'post', 'post_status' => 'publish']);

        $this->assertTrue(av_petitioner_is_form_post($form_id));
        $this->assertTrue(av_petitioner_is_form_post(get_post($form_id)));
        $this->assertFalse(av_petitioner_is_form_post($post_id));
        $this->assertFalse(av_petitioner_is_form_post(0));
    }

    public function test_form_supports_is_opt_in_per_form_type()
    {
        $petition_id = wp_insert_post(['post_type' => 'petitioner-petition', 'post_status' => 'publish']);
        $contact_id  = wp_insert_post(['post_type' => 'petitioner-contact', 'post_status' => 'publish']);
        $post_id     = wp_insert_post(['post_type' => 'post', 'post_status' => 'publish']);

        foreach (['ptr-goal', 'ptr-letter', 'ptr-public-submissions', 'ptr-duplicate-check'] as $feature) {
            $this->assertTrue(av_petitioner_form_supports($petition_id, $feature), $feature);
            $this->assertFalse(av_petitioner_form_supports($contact_id, $feature), $feature);
        }

        add_post_type_support('post', 'ptr-goal');
        $this->assertFalse(av_petitioner_form_supports($post_id, 'ptr-goal'));
        remove_post_type_support('post', 'ptr-goal');

        $this->assertFalse(av_petitioner_form_supports(0, 'ptr-goal'));
    }

    public function test_get_form_type()
    {
        $petition_id = wp_insert_post(['post_type' => 'petitioner-petition', 'post_status' => 'publish']);
        $contact_id  = wp_insert_post(['post_type' => 'petitioner-contact', 'post_status' => 'publish']);

        $this->assertSame('petition', av_petitioner_get_form_type($petition_id));
        $this->assertSame('contact', av_petitioner_get_form_type($contact_id));
        $this->assertSame('contact', av_petitioner_get_form_type(get_post($contact_id)));
        $this->assertSame('petition', av_petitioner_get_form_type(0));
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
