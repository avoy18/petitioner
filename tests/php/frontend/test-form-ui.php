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
}
