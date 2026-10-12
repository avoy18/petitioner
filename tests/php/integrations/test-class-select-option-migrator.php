<?php

use WorDBless\BaseTestCase;

class Test_Select_Option_Migrator extends BaseTestCase
{
    private $form_id;

    public function set_up()
    {
        parent::set_up();
        do_action('init');

        if (has_filter('av_petitioner_form_fields', [AV_Petitioner_Select_Option_Migrator::class, 'migrate_form_fields']) === false) {
            AV_Petitioner_Select_Option_Migrator::migrate_to_key_value_split();
        }

        $this->form_id = wp_insert_post([
            'post_type'   => 'petitioner-petition',
            'post_status' => 'publish',
        ]);
    }

    public function tear_down()
    {
        remove_all_filters('gettext');
        parent::tear_down();
    }

    public function test_public_form_turns_country_names_into_codes_and_keeps_custom_choices()
    {
        $this->translate_canada();

        $fields = $this->saved_fields();
        $migrated = apply_filters('av_petitioner_form_fields', $fields, $this->form_id);

        $canada = ['value' => 'ca', 'label' => 'Канада'];
        $this->assertSame([$canada, $canada, $canada], $migrated['country']['options']);
        $this->assertSame(
            [
                ['value' => 'Org A', 'label' => 'Org A'],
                ['value' => 'org-b', 'label' => 'Org B'],
            ],
            $migrated['organization']['options']
        );
        $this->assertSame($migrated, apply_filters('av_petitioner_form_fields_admin', $fields, $this->form_id));
    }

    public function test_empty_country_list_is_filled_with_codes()
    {
        $options = apply_filters('av_petitioner_select_field_options', [], 'country', $this->form_id);

        $this->assertCount(count(av_petitioner_get_country_codes()), $options);
        $this->assertContains(['value' => 'ca', 'label' => 'Canada'], $options);
        $this->assertSame([], apply_filters('av_petitioner_select_field_options', [], 'organization', $this->form_id));
        $this->assertSame(['Org A'], apply_filters('av_petitioner_select_field_options', ['Org A'], 'organization', $this->form_id));
    }

    public function test_string_choices_keep_their_text_and_country_names_become_codes()
    {
        $this->assertSame(
            ['value' => 'Org A', 'label' => 'Org A'],
            apply_filters('av_petitioner_select_option', 'Org A', 'organization', $this->form_id)
        );
        $this->assertSame(
            ['value' => 'ca', 'label' => 'Canada'],
            apply_filters('av_petitioner_select_option', 'Canada', 'country', $this->form_id)
        );
    }

    public function test_posted_country_names_become_codes()
    {
        $this->translate_canada();

        $this->assertSame('ca', apply_filters('av_petitioner_normalize_country', 'ca'));
        $this->assertSame('ca', apply_filters('av_petitioner_normalize_country', 'CA'));
        $this->assertSame('ca', apply_filters('av_petitioner_normalize_country', ' Canada '));
        $this->assertSame('ca', apply_filters('av_petitioner_normalize_country', 'Канада'));
        $this->assertSame('', apply_filters('av_petitioner_normalize_country', ''));
        $this->assertSame('', apply_filters('av_petitioner_normalize_country', null));
        $this->assertSame('Narnia', apply_filters('av_petitioner_normalize_country', 'Narnia'));
        $this->assertSame('Канада', av_petitioner_get_country_label('ca'));
        $this->assertSame('United States', av_petitioner_get_country_label('us'));
        $this->assertSame('United States', apply_filters('av_petitioner_csv_field_value', 'US', 'country'));
        $this->assertSame('John', apply_filters('av_petitioner_csv_field_value', 'John', 'fname'));
    }

    public function test_rendered_country_uses_codes_and_custom_choices_keep_their_value()
    {
        $this->translate_canada();
        $form_ui = new AV_Petitioner_Form_UI($this->form_id);

        ob_start();
        $form_ui->render_select_field('country', [
            'label'   => 'Country',
            'options' => ['Canada', 'Канада'],
        ]);
        $country = ob_get_clean();

        $this->assertStringContainsString('value="ca"', $country);
        $this->assertStringContainsString('Канада', $country);
        $this->assertStringNotContainsString('value="Canada"', $country);
        $this->assertStringNotContainsString('value="Канада"', $country);

        ob_start();
        $form_ui->render_select_field('country', [
            'label'   => 'Country',
            'options' => [],
        ]);
        $fallback = ob_get_clean();

        $this->assertStringContainsString('value="ca"', $fallback);
        $this->assertStringContainsString('value="us"', $fallback);

        ob_start();
        $form_ui->render_select_field('organization', [
            'label'   => 'Organization',
            'options' => ['Org A', ['value' => 'org-b', 'label' => 'Org B']],
        ]);
        $custom = ob_get_clean();

        $this->assertStringContainsString('value="Org A"', $custom);
        $this->assertStringContainsString('value="org-b"', $custom);
        $this->assertStringContainsString('Org B', $custom);
        $this->assertStringNotContainsString('value="Org B"', $custom);
    }

    private function saved_fields()
    {
        return [
            'organization' => [
                'type'    => 'select',
                'options' => ['Org A', ['value' => 'org-b', 'label' => 'Org B']],
            ],
            'country' => [
                'type'    => 'select',
                'options' => ['Canada', ' CA ', 'Канада'],
            ],
        ];
    }

    private function translate_canada()
    {
        add_filter('gettext', function ($translation, $text, $domain) {
            if ($domain === 'petitioner' && $text === 'Canada') {
                return 'Канада';
            }

            return $translation;
        }, 10, 3);
    }
}
