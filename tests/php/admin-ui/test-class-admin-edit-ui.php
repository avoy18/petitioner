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

    public function test_show_goal_override_is_saved_without_checkbox_coercion()
    {
        $user_id = wp_insert_user([
            'user_login' => 'petition_editor',
            'user_pass'  => 'password',
            'role'       => 'administrator',
        ]);
        wp_set_current_user($user_id);

        $post_id = wp_insert_post([
            'post_type'   => 'petitioner-petition',
            'post_status' => 'publish',
        ]);

        $_POST['petitioner_details_nonce'] = wp_create_nonce(AV_Petitioner_Admin_Edit_UI::$ADMIN_EDIT_NONCE_LABEL);

        $edit_ui = new AV_Petitioner_Admin_Edit_UI();

        $_POST['petitioner_show_goal'] = 'hide';
        $edit_ui->save_meta_box_data($post_id);
        $this->assertSame('hide', get_post_meta($post_id, '_petitioner_show_goal', true));

        $_POST['petitioner_show_goal'] = 'show';
        $edit_ui->save_meta_box_data($post_id);
        $this->assertSame('show', get_post_meta($post_id, '_petitioner_show_goal', true));

        $_POST['petitioner_show_goal'] = 'inherit';
        $edit_ui->save_meta_box_data($post_id);
        $this->assertSame('inherit', get_post_meta($post_id, '_petitioner_show_goal', true));

        unset($_POST['petitioner_show_goal'], $_POST['petitioner_details_nonce']);
        wp_delete_post($post_id, true);
        wp_set_current_user(0);
    }
}
