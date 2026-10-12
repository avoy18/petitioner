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
        AV_Petitioner_Labels::clear_cache();
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

    public function test_get_option_fields_returns_default_values_when_not_set()
    {
        $settings_ui = new AV_Petitioner_Admin_Settings_UI();
        $fields = $settings_ui->get_option_fields();

        $this->assertIsArray($fields);
        $this->assertArrayHasKey('show_letter', $fields);
        $this->assertEquals(true, $fields['show_letter']);
        $this->assertArrayHasKey('show_title', $fields);
        $this->assertEquals(true, $fields['show_title']);
        $this->assertArrayHasKey('show_goal', $fields);
    }

    public function test_saving_an_unchecked_goal_persists_off()
    {
        $user_id = wp_insert_user([
            'user_login' => 'settings_admin',
            'user_pass'  => 'password',
            'role'       => 'administrator',
        ]);
        wp_set_current_user($user_id);

        $_POST['petitioner_settings_nonce'] = wp_create_nonce('save_petition_settings');

        $settings_ui = new AV_Petitioner_Admin_Settings_UI();
        $this->assertTrue($settings_ui->save_meta_box_data());

        $fields = $settings_ui->get_option_fields();
        $this->assertSame(0, (int) $fields['show_goal']);

        unset($_POST['petitioner_settings_nonce']);
        delete_option('petitioner_show_goal');
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

    public function test_sanitize_array_handles_nested_objects()
    {
        $settings_ui = new AV_Petitioner_Admin_Settings_UI();

        $nested_json = '[{"fieldName": "FIRSTNAME", "mappedTo": "fname", "boldTag": "<b>bad</b>", "xssTag": "<script>alert(1)</script>"}]';

        // Return stringified json
        $sanitized_json = $settings_ui->sanitize_array($nested_json);
        $decoded = json_decode($sanitized_json, true);

        $this->assertIsArray($decoded);
        $this->assertCount(1, $decoded);
        $this->assertEquals('FIRSTNAME', $decoded[0]['fieldName']);
        $this->assertEquals('fname', $decoded[0]['mappedTo']);

        // Assert basic HTML tags are stripped but inner text remains
        $this->assertEquals('bad', $decoded[0]['boldTag']);

        // Assert dangerous <script> tags AND their inner contents are completely obliterated
        $this->assertEquals('', $decoded[0]['xssTag']);

        // Return raw array
        $sanitized_array = $settings_ui->sanitize_array($nested_json, false);
        $this->assertIsArray($sanitized_array);
        $this->assertEquals('FIRSTNAME', $sanitized_array[0]['fieldName']);
        $this->assertEquals('bad', $sanitized_array[0]['boldTag']);
        $this->assertEquals('', $sanitized_array[0]['xssTag']);
    }

    public function test_get_default_labels_does_not_expose_form_fields()
    {
        $settings_ui = new AV_Petitioner_Admin_Settings_UI();

        $labels = $settings_ui->get_default_labels();

        $this->assertIsArray($labels);

        // Ensure form field labels are NOT exposed in global settings
        $this->assertArrayNotHasKey('fname', $labels);
        $this->assertArrayNotHasKey('lname', $labels);
        $this->assertArrayNotHasKey('email', $labels);
        $this->assertArrayNotHasKey('country', $labels);
        $this->assertArrayNotHasKey('date_of_birth_desc', $labels);

        // Ensure expected core labels ARE present
        $this->assertArrayHasKey('success_message', $labels);
        $this->assertArrayHasKey('could_not_submit', $labels);
        $this->assertArrayHasKey('error_generic', $labels);
    }
}
