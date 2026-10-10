<?php

use WorDBless\BaseTestCase;

class Test_Form_UI extends BaseTestCase
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
    // GET_EXTRA_ATTRIBUTES TESTS
    // ============================================

    public function test_get_extra_attributes_includes_required()
    {
        $form_ui = new AV_Petitioner_Form_UI(1);
        $field = ['required' => true];

        $result = $form_ui->get_extra_attributes($field);

        $this->assertStringContainsString('required', $result);
    }

    public function test_get_extra_attributes_includes_placeholder()
    {
        $form_ui = new AV_Petitioner_Form_UI(1);
        $field = ['placeholder' => 'Enter your name'];

        $result = $form_ui->get_extra_attributes($field);

        $this->assertStringContainsString('placeholder="Enter your name"', $result);
    }

    public function test_get_extra_attributes_includes_both()
    {
        $form_ui = new AV_Petitioner_Form_UI(1);
        $field = [
            'required' => true,
            'placeholder' => 'Test placeholder'
        ];

        $result = $form_ui->get_extra_attributes($field);

        $this->assertStringContainsString('required', $result);
        $this->assertStringContainsString('placeholder="Test placeholder"', $result);
    }

    public function test_get_extra_attributes_applies_filter()
    {
        $form_ui = new AV_Petitioner_Form_UI(1);
        $field = ['required' => true];

        add_filter('av_petitioner_get_field_attributes', function ($attributes, $field) {
            return $attributes . ' data-custom="test"';
        }, 10, 2);

        $result = $form_ui->get_extra_attributes($field);

        $this->assertStringContainsString('data-custom="test"', $result);

        remove_all_filters('av_petitioner_get_field_attributes');
    }

    public function test_get_extra_attributes_returns_empty_for_empty_field()
    {
        $form_ui = new AV_Petitioner_Form_UI(1);
        $field = [];

        $result = $form_ui->get_extra_attributes($field);

        $this->assertEmpty($result);
    }

    // ============================================
    // RENDER_SELECT_FIELD TESTS
    // ============================================

    public function test_render_select_field_placeholder_is_selected_and_disabled()
    {
        $form_ui = new AV_Petitioner_Form_UI(1);
        $field = [
            'label'   => 'Organization',
            'options' => ['Org A', 'Org B'],
        ];

        ob_start();
        $form_ui->render_select_field('organization', $field);
        $output = ob_get_clean();

        $this->assertStringContainsString('<option value="" selected disabled>', $output);
        $this->assertStringNotContainsString('default disabled', $output);
        $this->assertStringContainsString('Select', $output);
        $this->assertStringContainsString('value="Org A"', $output);
        $this->assertStringContainsString('value="Org B"', $output);
    }

    // ============================================
    // LANG HIDDEN FIELD
    // ============================================

    public function test_render_fields_omits_lang_by_default()
    {
        $form_ui = $this->make_form_ui();

        ob_start();
        $form_ui->render_fields();
        $output = ob_get_clean();

        $this->assertStringNotContainsString('name="lang"', $output);
        $this->assertStringContainsString('name="form_id"', $output);
    }

    public function test_render_fields_includes_lang_from_filter()
    {
        $form_ui = $this->make_form_ui();

        add_filter('av_petitioner_current_lang', function () {
            return 'fr';
        });

        ob_start();
        $form_ui->render_fields();
        $output = ob_get_clean();

        remove_all_filters('av_petitioner_current_lang');

        $this->assertStringContainsString('name="lang"', $output);
        $this->assertStringContainsString('value="fr"', $output);
    }

    public function test_render_fields_omits_lang_when_filter_returns_non_string()
    {
        $form_ui = $this->make_form_ui();

        add_filter('av_petitioner_current_lang', function () {
            return ['fr'];
        });

        ob_start();
        $form_ui->render_fields();
        $output = ob_get_clean();

        remove_all_filters('av_petitioner_current_lang');

        $this->assertStringNotContainsString('name="lang"', $output);
    }

    private function make_form_ui(): AV_Petitioner_Form_UI
    {
        $form_id = wp_insert_post([
            'post_type'   => 'petitioner-petition',
            'post_status' => 'publish',
        ]);

        update_post_meta($form_id, '_petitioner_form_fields', '{}');

        return new AV_Petitioner_Form_UI($form_id);
    }
}
