<?php

use WorDBless\BaseTestCase;

class Test_Form_Migrator extends BaseTestCase
{
    public function set_up()
    {
        parent::set_up();

        if (has_filter('av_petitioner_form_fields', ['AV_Petitioner_Form_Migrator', 'migrate_form_fields']) === false) {
            AV_Petitioner_Form_Migrator::migrate_form_fields_to_builder_filters();
        }
    }

    public function test_empty_form_fields_are_built_from_old_meta()
    {
        $form_id = $this->make_form();
        update_post_meta($form_id, '_petitioner_show_country', '1');
        update_post_meta($form_id, '_petitioner_add_consent_checkbox', '1');
        update_post_meta($form_id, '_petitioner_consent_text', 'I agree to the custom terms');
        update_post_meta($form_id, '_petitioner_add_legal_text', '1');
        update_post_meta($form_id, '_petitioner_legal_text', 'Custom legal copy');

        $fields = apply_filters('av_petitioner_form_fields', '', $form_id);

        $this->assertSame(['fname', 'lname', 'email', 'country', 'accept_tos', 'legal', 'submit'], array_keys($fields));
        $this->assertSame('select', $fields['country']['type']);
        $this->assertArrayNotHasKey('options', $fields['country']);
        $this->assertSame('I agree to the custom terms', $fields['accept_tos']['label']);
        $this->assertSame('Custom legal copy', $fields['legal']['value']);

        $saved = json_decode(get_post_meta($form_id, '_petitioner_form_fields', true), true);
        $order = json_decode(get_post_meta($form_id, '_petitioner_field_order', true), true);

        $this->assertSame(array_keys($fields), array_keys($saved));
        $this->assertSame(array_keys($fields), $order);
    }

    public function test_country_consent_and_legal_stay_off_when_old_flags_are_empty()
    {
        $form_id = $this->make_form();

        $fields = apply_filters('av_petitioner_form_fields_admin', '{}', $form_id);

        $this->assertSame(['fname', 'lname', 'email', 'submit'], array_keys($fields));
    }

    public function test_existing_form_fields_are_left_alone()
    {
        $form_id = $this->make_form();
        update_post_meta($form_id, '_petitioner_show_country', '1');

        $fields = [
            'email' => [
                'type'  => 'email',
                'label' => 'Email',
            ],
        ];

        $this->assertSame($fields, apply_filters('av_petitioner_form_fields', $fields, $form_id));
        $this->assertSame($fields, apply_filters('av_petitioner_form_fields', wp_json_encode($fields), $form_id));
        $this->assertSame('', get_post_meta($form_id, '_petitioner_form_fields', true));
    }

    private function make_form()
    {
        return wp_insert_post([
            'post_type'   => 'petitioner-petition',
            'post_status' => 'publish',
        ]);
    }
}
