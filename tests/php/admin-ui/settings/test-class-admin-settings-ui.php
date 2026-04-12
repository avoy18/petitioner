<?php

use WorDBless\BaseTestCase;

class Test_Admin_Settings_UI extends BaseTestCase
{
    public function set_up()
    {
        parent::set_up();
    }

    public function tear_down()
    {
        parent::tear_down();
        // Clean up any filters we added during tests
        remove_all_filters('av_petitioner_settings_schema');
    }

    public function test_get_settings_schema_returns_valid_structure()
    {
        $schema = AV_Petitioner_Admin_Settings_UI::get_settings_schema();

        // Ensure the schema loads from the external file
        $this->assertIsArray($schema);
        $this->assertNotEmpty($schema);

        $this->assertArrayHasKey('show_letter', $schema);
        $this->assertArrayHasKey('label_overrides', $schema);

        // Verify the strict formatting required by the sanitization engine
        $this->assertArrayHasKey('meta_key', $schema['show_letter']);
        $this->assertArrayHasKey('type', $schema['show_letter']);

        $this->assertEquals('petitioner_show_letter', $schema['show_letter']['meta_key']);
        $this->assertEquals('checkbox', $schema['show_letter']['type']);
    }

    public function test_settings_schema_is_extensible_by_pro_plugins()
    {
        // Mock a Pro plugin attempting to register a new integration
        add_filter('av_petitioner_settings_schema', function ($schema) {
            $schema['mock_integration_enabled'] = [
                'meta_key' => 'petitioner_mock_integration_enabled',
                'type'     => 'checkbox'
            ];
            return $schema;
        });

        // Resolve the schema through the core class
        $schema = AV_Petitioner_Admin_Settings_UI::get_settings_schema();

        // Verify the external injection was successful
        $this->assertArrayHasKey('mock_integration_enabled', $schema);
        $this->assertEquals('petitioner_mock_integration_enabled', $schema['mock_integration_enabled']['meta_key']);
        $this->assertEquals('checkbox', $schema['mock_integration_enabled']['type']);
    }
}
