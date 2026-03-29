<?php

use WorDBless\BaseTestCase;

class Test_Custom_Properties extends BaseTestCase
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
    // GET_PROPERTY_TYPES TESTS
    // ============================================

    public function test_get_property_types_returns_array()
    {
        $types = AV_Petitioner_Custom_Properties::get_property_types();
        $this->assertIsArray($types);
    }

    // ============================================
    // DECODE TESTS
    // ============================================

    public function test_decode_returns_array_for_valid_json()
    {
        $json = '{"key1":"value1","key2":"value2"}';
        $result = AV_Petitioner_Custom_Properties::decode($json);

        $this->assertIsArray($result);
        $this->assertEquals('value1', $result['key1']);
        $this->assertEquals('value2', $result['key2']);
    }

    public function test_decode_returns_empty_array_for_empty_string()
    {
        $result = AV_Petitioner_Custom_Properties::decode('');
        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function test_decode_returns_empty_array_for_null()
    {
        $result = AV_Petitioner_Custom_Properties::decode(null);
        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function test_decode_handles_invalid_json()
    {
        $result = AV_Petitioner_Custom_Properties::decode('invalid json');
        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    // ============================================
    // GET_CUSTOM_PROPERTIES TESTS
    // ============================================

    public function test_get_custom_properties_returns_empty_array_when_no_properties_registered()
    {
        $post_data = ['petitioner_custom_field' => 'value'];
        $result = AV_Petitioner_Custom_Properties::get_custom_properties($post_data);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function test_get_custom_properties_uses_prefix_when_use_prefix_true()
    {
        // Register a custom property type via filter
        add_filter('av_petitioner_get_custom_property_types', function ($types) {
            return ['custom_field' => ['sanitize_callback' => 'sanitize_text_field']];
        });

        $post_data = ['petitioner_custom_field' => 'test value'];
        $result = AV_Petitioner_Custom_Properties::get_custom_properties($post_data, true);

        $this->assertArrayHasKey('custom_field', $result);
        $this->assertEquals('test value', $result['custom_field']);
    }

    public function test_get_custom_properties_skips_prefix_when_use_prefix_false()
    {
        add_filter('av_petitioner_get_custom_property_types', function ($types) {
            return ['custom_field' => ['sanitize_callback' => 'sanitize_text_field']];
        });

        $post_data = ['custom_field' => 'test value'];
        $result = AV_Petitioner_Custom_Properties::get_custom_properties($post_data, false);

        $this->assertArrayHasKey('custom_field', $result);
        $this->assertEquals('test value', $result['custom_field']);
    }

    // ============================================
    // HYDRATE_SUBMISSION TESTS
    // ============================================

    public function test_hydrate_submission_adds_custom_properties_to_object()
    {
        $submission = (object) [
            'id' => 1,
            'fname' => 'John',
            'custom_properties' => '{"custom_field":"custom_value"}'
        ];

        $result = AV_Petitioner_Custom_Properties::hydrate_submission($submission);

        $this->assertEquals('custom_value', $result->custom_field);
        $this->assertObjectNotHasProperty('custom_properties', $result);
    }

    public function test_hydrate_submission_skips_conflicting_properties()
    {
        $submission = (object) [
            'id' => 1,
            'fname' => 'John',
            'custom_field' => 'existing_value',
            'custom_properties' => '{"custom_field":"new_value"}'
        ];

        $result = AV_Petitioner_Custom_Properties::hydrate_submission($submission);

        // Should keep existing value, not overwrite
        $this->assertEquals('existing_value', $result->custom_field);
    }

    public function test_hydrate_submission_handles_empty_custom_properties()
    {
        $submission = (object) [
            'id' => 1,
            'fname' => 'John',
            'custom_properties' => ''
        ];

        $result = AV_Petitioner_Custom_Properties::hydrate_submission($submission);

        $this->assertEquals(1, $result->id);
        $this->assertEquals('John', $result->fname);
    }

    // ============================================
    // HYDRATE_SUBMISSIONS TESTS
    // ============================================

    public function test_hydrate_submissions_processes_array()
    {
        $submissions = [
            (object) ['id' => 1, 'custom_properties' => '{"field1":"value1"}'],
            (object) ['id' => 2, 'custom_properties' => '{"field2":"value2"}']
        ];

        $result = AV_Petitioner_Custom_Properties::hydrate_submissions($submissions);

        $this->assertCount(2, $result);
        $this->assertEquals('value1', $result[0]->field1);
        $this->assertEquals('value2', $result[1]->field2);
    }

    public function test_hydrate_submissions_handles_empty_array()
    {
        $result = AV_Petitioner_Custom_Properties::hydrate_submissions([]);

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    // ============================================
    // QUERY FILTER TESTS
    // ============================================

    public function test_filter_query_allowed_fields_appends_custom_property_keys()
    {
        add_filter('av_petitioner_get_custom_property_types', function () {
            return ['favorite_color' => ['sanitize_callback' => 'sanitize_text_field']];
        });

        $instance = new AV_Petitioner_Custom_Properties();
        $fields = $instance->filter_query_allowed_fields(['fname', 'lname']);

        $this->assertContains('favorite_color', $fields);
        $this->assertContains('fname', $fields);
    }

    public function test_filter_query_field_column_returns_json_extract_for_custom_property()
    {
        add_filter('av_petitioner_get_custom_property_types', function () {
            return ['favorite_color' => ['sanitize_callback' => 'sanitize_text_field']];
        });

        $instance = new AV_Petitioner_Custom_Properties();
        $result = $instance->filter_query_field_column('`favorite_color`', 'favorite_color');

        $this->assertStringContainsString('JSON_UNQUOTE', $result);
        $this->assertStringContainsString('JSON_EXTRACT', $result);
        $this->assertStringContainsString('$."favorite_color"', $result);
    }

    public function test_filter_query_field_column_handles_keys_with_special_characters()
    {
        add_filter('av_petitioner_get_custom_property_types', function () {
            return ['my-field' => ['sanitize_callback' => 'sanitize_text_field']];
        });

        $instance = new AV_Petitioner_Custom_Properties();
        $result = $instance->filter_query_field_column('`my-field`', 'my-field');

        $this->assertStringContainsString('$."my-field"', $result);
    }

    public function test_filter_query_field_column_returns_default_for_non_custom_field()
    {
        add_filter('av_petitioner_get_custom_property_types', function () {
            return ['favorite_color' => ['sanitize_callback' => 'sanitize_text_field']];
        });

        $instance = new AV_Petitioner_Custom_Properties();
        $result = $instance->filter_query_field_column('`fname`', 'fname');

        $this->assertEquals('`fname`', $result);
    }

    public function test_build_where_clause_uses_json_extract_for_custom_fields()
    {
        add_filter('av_petitioner_get_custom_property_types', function () {
            return ['favorite_color' => ['sanitize_callback' => 'sanitize_text_field']];
        });

        // Instantiate to register hooks
        new AV_Petitioner_Custom_Properties();

        $result = AV_Petitioner_Submissions_Model::build_where_clause(
            1,
            [['field' => 'favorite_color', 'operator' => 'equals', 'value' => 'Blue']],
            AV_Petitioner_Submissions_Model::$ALLOWED_FIELDS
        );

        $this->assertStringContainsString('JSON_UNQUOTE', $result['where']);
        $this->assertStringContainsString('$."favorite_color"', $result['where']);
        $this->assertContains('Blue', $result['params']);
    }
}
