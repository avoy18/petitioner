<?php

use WorDBless\BaseTestCase;

class Test_Translations extends BaseTestCase
{
    private int $form_id;
    private AV_Petitioner_Translations $translations;

    public function set_up()
    {
        parent::set_up();

        $this->form_id = wp_insert_post([
            'post_type'   => 'petitioner-petition',
            'post_status' => 'publish',
        ]);

        $this->translations = new AV_Petitioner_Translations();
    }

    public function tear_down()
    {
        remove_action('save_post_petitioner-petition', [$this->translations, 'register_form'], 20);
        remove_filter('av_petitioner_form_field', [$this->translations, 'translate_field'], 20);
        remove_filter('av_petitioner_title', [$this->translations, 'translate_title']);
        remove_filter('av_petitioner_subject', [$this->translations, 'translate_subject']);
        remove_filter('av_petitioner_letter', [$this->translations, 'translate_letter']);

        remove_all_filters('av_petitioner_translate_string');
        remove_all_actions('av_petitioner_register_translation');
        wp_delete_post($this->form_id, true);
        parent::tear_down();
    }

    public function test_maybe_translate_returns_empty_unchanged()
    {
        $this->assertSame('', $this->translations->maybe_translate($this->form_id, 'title', ''));
        $this->assertNull($this->translations->maybe_translate($this->form_id, 'title', null));
    }

    public function test_maybe_translate_uses_filter()
    {
        add_filter('av_petitioner_translate_string', function ($value, $name, $form_id) {
            $this->assertSame('title', $name);
            $this->assertSame($this->form_id, $form_id);
            return 'Bonjour';
        }, 10, 3);

        $this->assertSame('Bonjour', $this->translations->maybe_translate($this->form_id, 'title', 'Hello'));
    }

    public function test_maybe_translate_keeps_original_if_filter_returns_non_string()
    {
        add_filter('av_petitioner_translate_string', function () {
            return ['nope'];
        });

        $this->assertSame('Hello', $this->translations->maybe_translate($this->form_id, 'title', 'Hello'));
    }

    public function test_translate_field_swaps_label_placeholder_and_wysiwyg()
    {
        add_filter('av_petitioner_translate_string', function ($value, $name) {
            return $name . ':' . $value;
        }, 10, 2);

        $field = $this->translations->translate_field([
            'type'        => 'wysiwyg',
            'label'       => 'Legal',
            'placeholder' => 'Type here',
            'value'       => '<p>Hi</p>',
        ], 'legal', $this->form_id);

        $this->assertSame('field.legal.label:Legal', $field['label']);
        $this->assertSame('field.legal.placeholder:Type here', $field['placeholder']);
        $this->assertSame('field.legal.value:<p>Hi</p>', $field['value']);
    }

    public function test_translate_field_returns_non_array()
    {
        $this->assertSame('x', $this->translations->translate_field('x', 'fname', $this->form_id));
    }

    public function test_register_form_fires_action_for_meta_and_fields()
    {
        update_post_meta($this->form_id, '_petitioner_title', 'Save the bees');
        update_post_meta($this->form_id, '_petitioner_subject', 'Please help');
        update_post_meta($this->form_id, '_petitioner_letter', 'Dear minister');
        update_post_meta($this->form_id, '_petitioner_form_fields', wp_json_encode([
            'fname' => [
                'type'        => 'text',
                'label'       => 'First name',
                'placeholder' => 'Jane',
            ],
            'legal' => [
                'type'  => 'wysiwyg',
                'value' => '<p>Terms</p>',
            ],
        ]));

        $registered = [];
        add_action('av_petitioner_register_translation', function ($form_id, $name, $value, $multiline) use (&$registered) {
            $registered[] = compact('form_id', 'name', 'value', 'multiline');
        }, 10, 4);

        $this->translations->register_form($this->form_id);

        $by_name = [];
        foreach ($registered as $row) {
            $by_name[$row['name']] = $row;
        }

        $this->assertSame($this->form_id, $by_name['title']['form_id']);
        $this->assertSame('Save the bees', $by_name['title']['value']);
        $this->assertSame('Please help', $by_name['subject']['value']);
        $this->assertSame('Dear minister', $by_name['letter']['value']);
        $this->assertTrue($by_name['letter']['multiline']);
        $this->assertSame('First name', $by_name['field.fname.label']['value']);
        $this->assertSame('Jane', $by_name['field.fname.placeholder']['value']);
        $this->assertSame('<p>Terms</p>', $by_name['field.legal.value']['value']);
        $this->assertTrue($by_name['field.legal.value']['multiline']);
        $this->assertArrayNotHasKey('field.fname.value', $by_name);
        $this->assertArrayNotHasKey('field.legal.label', $by_name);
    }

    public function test_register_string_skips_empty()
    {
        $called = false;
        add_action('av_petitioner_register_translation', function () use (&$called) {
            $called = true;
        });

        $this->translations->register_string($this->form_id, 'title', '');
        $this->assertFalse($called);
    }
}
