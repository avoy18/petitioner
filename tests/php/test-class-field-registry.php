<?php

use WorDBless\BaseTestCase;

class Test_AV_Petitioner_Field_Registry extends BaseTestCase
{

    public function set_up()
    {
        parent::set_up();
        // Reset the cached fields before each test to ensure test isolation
        $reflection = new ReflectionClass('AV_Petitioner_Field_Registry');
        $property = $reflection->getProperty('cached_fields');
        $property->setValue(null, null);
    }

    public function tear_down()
    {
        parent::tear_down();
    }

    public function test_get_defaults_returns_expected_core_fields()
    {
        $defaults = AV_Petitioner_Field_Registry::get_defaults();

        $this->assertIsArray($defaults);
        $this->assertArrayHasKey('fname', $defaults);
        $this->assertArrayHasKey('lname', $defaults);
        $this->assertArrayHasKey('email', $defaults);
        $this->assertArrayHasKey('submit', $defaults);

        $this->assertEquals('text', $defaults['fname']['type']);
        $this->assertEquals('text', $defaults['lname']['type']);
        $this->assertEquals('email', $defaults['email']['type']);
        $this->assertEquals('submit', $defaults['submit']['type']);

        $this->assertTrue($defaults['fname']['required']);
        $this->assertFalse($defaults['fname']['removable']);
    }

    public function test_get_draggable_returns_expected_fields()
    {
        $draggable = AV_Petitioner_Field_Registry::get_draggable();

        $this->assertIsArray($draggable);
        $this->assertNotEmpty($draggable);

        // Extract the field keys from the indexed array
        $field_keys = array_column($draggable, 'fieldKey');

        $this->assertContains('phone', $field_keys);
        $this->assertContains('date_of_birth', $field_keys);
        $this->assertContains('country', $field_keys);
        $this->assertContains('accept_tos', $field_keys);

        // Pick one to test specific properties
        $phone_field = array_filter($draggable, function ($f) {
            return $f['fieldKey'] === 'phone';
        });
        $phone_field = reset($phone_field);

        $this->assertEquals('tel', $phone_field['type']);
        $this->assertFalse($phone_field['required']);
        $this->assertTrue($phone_field['removable']);
    }

    public function test_get_all_returns_defaults_and_draggable_with_caching()
    {
        // First call should calculate
        $all_fields_1 = AV_Petitioner_Field_Registry::get_all();

        $this->assertIsArray($all_fields_1);
        $this->assertArrayHasKey('defaults', $all_fields_1);
        $this->assertArrayHasKey('draggable', $all_fields_1);
        $this->assertNotEmpty($all_fields_1['defaults']);
        $this->assertNotEmpty($all_fields_1['draggable']);

        // Second call should come from cache
        $all_fields_2 = AV_Petitioner_Field_Registry::get_all();
        $this->assertSame($all_fields_1, $all_fields_2);
    }

    public function test_get_returns_correct_field()
    {
        // Test fetching a default field (which are stored in an associative array)
        $fname = AV_Petitioner_Field_Registry::get('fname');
        $this->assertNotNull($fname);
        $this->assertEquals('fname', $fname['fieldKey']);
        $this->assertEquals('text', $fname['type']);

        // Test fetching a draggable field (which are stored in an indexed array)
        $phone = AV_Petitioner_Field_Registry::get('phone');
        $this->assertNotNull($phone);
        $this->assertEquals('phone', $phone['fieldKey']);
        $this->assertEquals('tel', $phone['type']);

        // Test non-existent field
        $non_existent = AV_Petitioner_Field_Registry::get('this_does_not_exist_at_all');
        $this->assertNull($non_existent);
    }

    public function test_register_form_field_adds_field_to_frontend_builder()
    {
        $custom_config = [
            'fieldKey'          => 'my_custom_color',
            'type'              => 'text',
            'fieldName'         => 'Favorite Color',
            'label'             => 'What is your favorite color?',
            'required'          => true,
            'removable'         => false,
            'sanitize_callback' => 'sanitize_text_field'
        ];

        AV_Petitioner_Field_Registry::register_form_field($custom_config);

        // Fetch the fields to fire the 'av_petitioner_builder_fields' hook
        $all_fields = AV_Petitioner_Field_Registry::get_all();

        $draggable = $all_fields['draggable'];

        $custom_field = array_filter($draggable, function ($f) {
            return isset($f['fieldKey']) && $f['fieldKey'] === 'my_custom_color';
        });

        $this->assertNotEmpty($custom_field, "Custom field was not added to draggable fields.");

        $custom_field = reset($custom_field);

        $this->assertEquals('my_custom_color', $custom_field['fieldKey']);
        $this->assertEquals('text', $custom_field['type']);
        $this->assertTrue($custom_field['required']);
        $this->assertFalse($custom_field['removable']);

        // Assert backend only variables got stripped off
        $this->assertArrayNotHasKey('sanitize_callback', $custom_field, "sanitize_callback should be removed for frontend UI config.");
    }

    public function test_register_form_field_adds_to_custom_property_types()
    {
        $custom_config = [
            'fieldKey'          => 'my_custom_color',
            'type'              => 'text',
            'fieldName'         => 'Favorite Color',
            'label'             => 'What is your favorite color?',
            'sanitize_callback' => 'my_custom_sanitize_function'
        ];

        AV_Petitioner_Field_Registry::register_form_field($custom_config);

        // Fire the hook to get properties
        $properties = apply_filters('av_petitioner_get_custom_property_types', []);

        $this->assertArrayHasKey('my_custom_color', $properties);
        $this->assertEquals('my_custom_sanitize_function', $properties['my_custom_color']['sanitize_callback']);
    }
}
