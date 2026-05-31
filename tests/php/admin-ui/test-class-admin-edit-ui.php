<?php

use WorDBless\BaseTestCase;

class Test_Admin_Edit_UI extends BaseTestCase
{
    public function set_up()
    {
        parent::set_up();
    }

    public function tear_down()
    {
        parent::tear_down();
        // Clean up any filters we added during tests
        remove_all_filters('av_petitioner_edit_meta_schema');
    }

    public function test_get_meta_schema_returns_valid_structure()
    {
        $schema = AV_Petitioner_Admin_Edit_UI::get_meta_schema();

        // Ensure the schema loads correctly
        $this->assertIsArray($schema);
        $this->assertNotEmpty($schema);

        // Verify some core fields exist
        $this->assertArrayHasKey('title', $schema);
        $this->assertArrayHasKey('redirect_url', $schema);

        // Verify the strict formatting required by the sanitization engine
        $this->assertArrayHasKey('meta_key', $schema['title']);
        $this->assertArrayHasKey('type', $schema['title']);

        $this->assertEquals('_petitioner_title', $schema['title']['meta_key']);
        $this->assertEquals('text', $schema['title']['type']);
    }

    public function test_edit_meta_schema_is_extensible_by_pro_plugins()
    {
        // Mock a Pro plugin attempting to register a new integration field
        add_filter('av_petitioner_edit_meta_schema', function ($schema) {
            $schema['pro_brevo_list_id_override'] = [
                'meta_key' => '_petitioner_pro_brevo_list_id_override',
                'type'     => 'text'
            ];
            return $schema;
        });

        // Resolve the schema through the core class
        $schema = AV_Petitioner_Admin_Edit_UI::get_meta_schema();

        // Verify the external injection was successful
        $this->assertArrayHasKey('pro_brevo_list_id_override', $schema);
        $this->assertEquals('_petitioner_pro_brevo_list_id_override', $schema['pro_brevo_list_id_override']['meta_key']);
        $this->assertEquals('text', $schema['pro_brevo_list_id_override']['type']);
    }
}
