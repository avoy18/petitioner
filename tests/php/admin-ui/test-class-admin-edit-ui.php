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

    public function test_contact_schema_only_has_contact_fields()
    {
        $schema = AV_Petitioner_Admin_Edit_UI::get_meta_schema('contact');

        $this->assertEqualsCanonicalizing(
            ['title', 'email', 'cc_emails', 'subject', 'add_honeypot', 'from_field', 'from_name', 'redirect_url', 'form_fields', 'field_order'],
            array_keys($schema)
        );
    }

    public function test_contact_schema_shares_meta_keys_with_petition_schema()
    {
        $petition_schema = AV_Petitioner_Admin_Edit_UI::get_meta_schema('petition');

        foreach (AV_Petitioner_Admin_Edit_UI::get_meta_schema('contact') as $key => $config) {
            $this->assertSame($petition_schema[$key], $config, "Contact schema field '$key' drifted from the petition schema");
        }
    }

    public function test_edit_meta_schema_filter_receives_form_type()
    {
        $received = [];
        add_filter('av_petitioner_edit_meta_schema', function ($schema, $form_type) use (&$received) {
            $received[] = $form_type;
            return $schema;
        }, 10, 2);

        AV_Petitioner_Admin_Edit_UI::get_meta_schema();
        AV_Petitioner_Admin_Edit_UI::get_meta_schema('contact');

        $this->assertSame(['petition', 'contact'], $received);
    }

    public function test_saving_a_contact_form_ignores_petition_fields()
    {
        wp_set_current_user(1);
        $user = wp_get_current_user();
        $user->add_cap('edit_posts');
        $user->add_cap('edit_others_posts');

        $post_id = wp_insert_post(['post_type' => 'petitioner-contact', 'post_status' => 'publish']);

        $_POST = [
            'petitioner_details_nonce' => wp_create_nonce(AV_Petitioner_Admin_Edit_UI::$ADMIN_EDIT_NONCE_LABEL),
            'petitioner_title'         => 'Get in touch',
            'petitioner_email'         => 'admin@example.com',
            'petitioner_letter'        => 'Dear representative',
        ];

        (new AV_Petitioner_Admin_Edit_UI())->save_meta_box_data($post_id);

        $this->assertSame('Get in touch', get_post_meta($post_id, '_petitioner_title', true));
        $this->assertSame('admin@example.com', get_post_meta($post_id, '_petitioner_email', true));
        $this->assertSame('', get_post_meta($post_id, '_petitioner_letter', true));
        $this->assertFalse(metadata_exists('post', $post_id, '_petitioner_letter'));

        $_POST = [];
    }
}
