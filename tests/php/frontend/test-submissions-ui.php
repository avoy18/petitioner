<?php

use WorDBless\BaseTestCase;

class Test_Submissions_UI extends BaseTestCase
{
    public function set_up()
    {
        parent::set_up();

        // get_submission_style_labels() memoises, so a label registered by one
        // test must not leak into the next.
        AV_Petitioner_Labels::clear_cache();
    }

    public function tear_down()
    {
        remove_all_filters('av_petitioner_submissions_styles');
        remove_all_filters('av_petitioner_submission_style_labels');
        remove_all_filters('av_petitioner_submission_style_editor_hints');
        remove_all_filters('av_petitioner_available_fields_shortcode');
        remove_all_filters('av_petitioner_public_fields');
        AV_Petitioner_Labels::clear_cache();

        parent::tear_down();
    }

    /**
     * Pull the JSON the renderer hands to the JS bundle back out of the markup.
     */
    private function get_rendered_settings($html)
    {
        $this->assertMatchesRegularExpression('/data-ptr-settings="([^"]*)"/', $html);

        preg_match('/data-ptr-settings="([^"]*)"/', $html, $matches);

        return json_decode(html_entity_decode($matches[1], ENT_QUOTES), true);
    }

    // ============================================
    // GET_DEFAULTS TESTS
    // ============================================

    public function test_defaults_expose_every_setting_the_renderer_reads()
    {
        $defaults = AV_Petitioner_Submissions_UI::get_defaults();

        $this->assertEqualsCanonicalizing(
            ['per_page', 'style', 'fields', 'show_pagination', 'hide_page_numbers'],
            array_keys($defaults)
        );
    }

    public function test_default_toggles_are_native_booleans()
    {
        $defaults = AV_Petitioner_Submissions_UI::get_defaults();

        // These used to be the strings 'true'/'false', which the block could not
        // consume without coercing first.
        $this->assertIsBool($defaults['show_pagination']);
        $this->assertIsBool($defaults['hide_page_numbers']);
    }

    public function test_default_style_is_available()
    {
        $this->assertContains(
            AV_Petitioner_Submissions_UI::get_defaults()['style'],
            AV_Petitioner_Submissions_UI::get_available_styles()
        );
    }

    // ============================================
    // RENDER_SUBMISSIONS_LIST TESTS
    // ============================================

    public function test_render_returns_empty_string_without_a_form_id()
    {
        $this->assertSame('', AV_Petitioner_Submissions_UI::render_submissions_list());
        $this->assertSame('', AV_Petitioner_Submissions_UI::render_submissions_list(0));
        $this->assertSame('', AV_Petitioner_Submissions_UI::render_submissions_list('not-an-id'));
    }

    public function test_render_outputs_wrapper_with_style_modifier()
    {
        $html = AV_Petitioner_Submissions_UI::render_submissions_list(42);

        $this->assertStringContainsString('class="petitioner petitioner-submissions petitioner-submissions--simple"', $html);
    }

    public function test_render_applies_defaults_when_no_atts_are_passed()
    {
        $settings = $this->get_rendered_settings(
            AV_Petitioner_Submissions_UI::render_submissions_list(42)
        );

        $defaults = AV_Petitioner_Submissions_UI::get_defaults();

        $this->assertSame(42, $settings['form_id']);
        $this->assertSame($defaults['per_page'], $settings['per_page']);
        $this->assertSame($defaults['style'], $settings['style']);
        $this->assertTrue($settings['show_pagination']);
        $this->assertFalse($settings['hide_page_numbers']);
    }

    public function test_render_lets_atts_override_defaults()
    {
        $settings = $this->get_rendered_settings(
            AV_Petitioner_Submissions_UI::render_submissions_list(42, [
                'per_page' => 5,
                'style'    => 'table',
            ])
        );

        $this->assertSame(5, $settings['per_page']);
        $this->assertSame('table', $settings['style']);
    }

    public function test_render_falls_back_to_default_style_when_style_is_unknown()
    {
        $settings = $this->get_rendered_settings(
            AV_Petitioner_Submissions_UI::render_submissions_list(42, ['style' => 'does-not-exist'])
        );

        $this->assertSame('simple', $settings['style']);
    }

    public function test_render_accepts_a_style_registered_through_the_filter()
    {
        add_filter('av_petitioner_submissions_styles', function ($styles) {
            $styles[] = 'pro-ticker';
            return $styles;
        });

        $html = AV_Petitioner_Submissions_UI::render_submissions_list(42, ['style' => 'pro-ticker']);

        $this->assertSame('pro-ticker', $this->get_rendered_settings($html)['style']);
        $this->assertStringContainsString('petitioner-submissions--pro-ticker', $html);
    }

    public function test_render_drops_fields_that_are_not_public()
    {
        $settings = $this->get_rendered_settings(
            AV_Petitioner_Submissions_UI::render_submissions_list(42, [
                'fields' => 'name,email,country',
            ])
        );

        // email is sensitive, so it must never reach the frontend.
        $this->assertSame('name,country', $settings['fields']);
    }

    public function test_render_tolerates_spaces_between_fields()
    {
        $settings = $this->get_rendered_settings(
            AV_Petitioner_Submissions_UI::render_submissions_list(42, [
                'fields' => 'name, country, submitted_at',
            ])
        );

        $this->assertSame('name,country,submitted_at', $settings['fields']);
    }

    public function test_render_coerces_shortcode_string_booleans()
    {
        $settings = $this->get_rendered_settings(
            AV_Petitioner_Submissions_UI::render_submissions_list(42, [
                'show_pagination'   => 'false',
                'hide_page_numbers' => 'true',
            ])
        );

        $this->assertFalse($settings['show_pagination']);
        $this->assertTrue($settings['hide_page_numbers']);
    }

    public function test_render_casts_form_id_to_an_integer()
    {
        $settings = $this->get_rendered_settings(
            AV_Petitioner_Submissions_UI::render_submissions_list('42')
        );

        $this->assertSame(42, $settings['form_id']);
    }

    public function test_render_escapes_the_settings_payload()
    {
        add_filter('av_petitioner_submissions_styles', function ($styles) {
            $styles[] = '"><script>alert(1)</script>';
            return $styles;
        });

        $html = AV_Petitioner_Submissions_UI::render_submissions_list(42, [
            'style' => '"><script>alert(1)</script>',
        ]);

        $this->assertStringNotContainsString('<script>', $html);
    }

    // ============================================
    // GET_AVAILABLE_STYLES TESTS
    // ============================================

    public function test_available_styles_ship_simple_and_table()
    {
        $this->assertSame(['simple', 'table'], AV_Petitioner_Submissions_UI::get_available_styles());
    }

    public function test_available_styles_can_be_extended_by_addons()
    {
        add_filter('av_petitioner_submissions_styles', function ($styles) {
            $styles[] = 'pro-ticker';
            return $styles;
        });

        $this->assertContains('pro-ticker', AV_Petitioner_Submissions_UI::get_available_styles());
    }

    // ============================================
    // GET_STYLE_CHOICES TESTS
    // ============================================

    public function test_style_choices_pair_every_style_with_a_label()
    {
        $this->assertSame(
            [
                ['label' => 'Simple', 'value' => 'simple'],
                ['label' => 'Table',  'value' => 'table'],
            ],
            AV_Petitioner_Submissions_UI::get_style_choices()
        );
    }

    public function test_style_choices_use_the_label_registered_by_an_addon()
    {
        add_filter('av_petitioner_submissions_styles', function ($styles) {
            $styles[] = 'pro-ticker';
            return $styles;
        });

        add_filter('av_petitioner_submission_style_labels', function ($labels) {
            $labels['pro-ticker'] = 'Ticker';
            return $labels;
        });

        $this->assertContains(
            ['label' => 'Ticker', 'value' => 'pro-ticker'],
            AV_Petitioner_Submissions_UI::get_style_choices()
        );
    }

    public function test_style_choices_humanise_the_slug_when_no_label_is_registered()
    {
        add_filter('av_petitioner_submissions_styles', function ($styles) {
            $styles[] = 'pro-ticker';
            return $styles;
        });

        $this->assertContains(
            ['label' => 'Pro Ticker', 'value' => 'pro-ticker'],
            AV_Petitioner_Submissions_UI::get_style_choices()
        );
    }

    public function test_style_editor_hints_default_to_empty()
    {
        $this->assertSame([], AV_Petitioner_Submissions_UI::get_style_editor_hints());
    }

    public function test_style_editor_hints_can_be_registered_by_addons()
    {
        add_filter('av_petitioner_submission_style_editor_hints', function ($hints) {
            $hints['pro-ticker'] = 'Ticker hint';
            return $hints;
        });

        $this->assertSame(
            ['pro-ticker' => 'Ticker hint'],
            AV_Petitioner_Submissions_UI::get_style_editor_hints()
        );
    }

    // ============================================
    // GET_AVAILABLE_FIELDS TESTS
    // ============================================

    public function test_available_fields_lead_with_name()
    {
        $fields = AV_Petitioner_Submissions_UI::get_available_fields();

        $this->assertSame('name', $fields[0]);
    }

    public function test_available_fields_exclude_sensitive_columns()
    {
        $fields = AV_Petitioner_Submissions_UI::get_available_fields();

        $this->assertNotContains('email', $fields);
        $this->assertNotContains('phone', $fields);
        $this->assertNotContains('confirmation_token', $fields);
    }

    public function test_available_fields_can_be_extended_by_addons()
    {
        add_filter('av_petitioner_available_fields_shortcode', function ($fields) {
            $fields[] = 'nickname';
            return $fields;
        });

        $this->assertContains('nickname', AV_Petitioner_Submissions_UI::get_available_fields());
    }
}
