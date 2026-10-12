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
        remove_action('admin_init', [$this->translations, 'register_all_forms']);
        remove_action('admin_init', [$this->translations, 'register_label_overrides']);
        remove_action('add_option_petitioner_label_overrides', [$this->translations, 'register_label_overrides']);
        remove_action('update_option_petitioner_label_overrides', [$this->translations, 'register_label_overrides']);
        delete_option('petitioner_label_overrides');
        AV_Petitioner_Labels::clear_cache();
        remove_filter('av_petitioner_form_field', [$this->translations, 'translate_field'], 20);
        remove_filter('av_petitioner_title', [$this->translations, 'translate_title']);
        remove_filter('av_petitioner_subject', [$this->translations, 'translate_subject']);
        remove_filter('av_petitioner_letter', [$this->translations, 'translate_letter']);
        remove_filter('av_petitioner_success_message_title', [$this->translations, 'translate_success_message_title']);
        remove_filter('av_petitioner_success_message', [$this->translations, 'translate_success_message']);
        remove_filter('av_petitioner_redirect_url', [$this->translations, 'translate_redirect_url']);
        remove_filter('av_petitioner_select_option_label', [$this->translations, 'translate_select_option_label'], 10);
        remove_filter('av_petitioner_label', [$this->translations, 'translate_label']);
        remove_filter('av_petitioner_email_string', [$this->translations, 'translate_email_string']);
        remove_filter('av_petitioner_info_settings', [$this->translations, 'add_translation_integrations']);
        remove_filter('av_petitioner_submission_data_pre_save', [$this->translations, 'store_lang'], 20);
        remove_filter('av_petitioner_mailer_settings', [$this->translations, 'add_lang_to_mailer']);
        remove_filter('av_petitioner_confirmation_mailer_settings', [$this->translations, 'add_lang_to_confirmation_mailer']);

        remove_all_filters('av_petitioner_translate_string');
        remove_all_filters('av_petitioner_translations_register_form_args');
        remove_all_filters('posts_pre_query');
        remove_all_actions('av_petitioner_register_translation');
        wp_delete_post($this->form_id, true);
        parent::tear_down();
    }

    public function test_settings_screen_reports_which_translation_plugins_are_active()
    {
        $info = apply_filters('av_petitioner_info_settings', []);

        $this->assertSame(
            [
                'polylang' => function_exists('pll_register_string'),
                'wpml' => class_exists('SitePress'),
                'translatepress' => function_exists('trp_translate'),
            ],
            $info['translation_integrations']
        );
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

    public function test_translate_success_overrides()
    {
        add_filter('av_petitioner_translate_string', function ($value, $name) {
            return $name . ':' . $value;
        }, 10, 2);

        $this->assertSame(
            'success_message_title:Merci!',
            $this->translations->translate_success_message_title('Merci!', $this->form_id)
        );
        $this->assertSame(
            'success_message:<p>We got it.</p>',
            $this->translations->translate_success_message('<p>We got it.</p>', $this->form_id)
        );
        $this->assertSame(
            'redirect_url:https://example.com/thanks',
            $this->translations->translate_redirect_url('https://example.com/thanks', $this->form_id, 'redirect_url')
        );
    }

    public function test_confirm_redirect_uses_the_language_on_the_signature()
    {
        $seen = null;
        add_filter('av_petitioner_translate_string', function ($value, $name, $form_id, $lang) use (&$seen) {
            $seen = [$name, $lang];
            return $value;
        }, 10, 4);

        $this->translations->translate_redirect_url('https://example.com/thanks', $this->form_id, 'redirect_url');
        $this->assertSame(['redirect_url', null], $seen);

        $this->translations->translate_redirect_url(
            'https://example.com/confirmed',
            $this->form_id,
            'confirm_success_url',
            (object) ['lang' => 'de_DE']
        );
        $this->assertSame(['confirm_success_url', 'de_DE'], $seen);

        $seen = null;
        $this->translations->translate_letter('Dear minister', $this->form_id);
        $this->assertSame(['letter', null], $seen);
    }

    public function test_register_form_fires_action_for_meta_and_fields()
    {
        update_post_meta($this->form_id, '_petitioner_title', 'Save the bees');
        update_post_meta($this->form_id, '_petitioner_subject', 'Please help');
        update_post_meta($this->form_id, '_petitioner_letter', 'Dear minister');
        update_post_meta($this->form_id, '_petitioner_success_message_title', 'Merci!');
        update_post_meta($this->form_id, '_petitioner_success_message', '<p>We got it.</p>');
        update_post_meta($this->form_id, '_petitioner_ty_email_subject', 'Thanks for signing');
        update_post_meta($this->form_id, '_petitioner_ty_email', '<p>Thanks {{user_name}}</p>');
        update_post_meta($this->form_id, '_petitioner_redirect_url', 'https://example.com/thanks');
        update_post_meta($this->form_id, '_petitioner_confirm_success_url', 'https://example.com/confirmed');
        update_post_meta($this->form_id, '_petitioner_confirm_error_url', 'https://example.com/invalid');
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
            'organization' => [
                'type'    => 'select',
                'label'   => 'Organization',
                'options' => ['Org A', ['value' => 'org-b', 'label' => 'Org B']],
            ],
            'country' => [
                'type'    => 'select',
                'label'   => 'Country',
                'options' => ['Canada'],
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
        $this->assertSame('Merci!', $by_name['success_message_title']['value']);
        $this->assertFalse($by_name['success_message_title']['multiline']);
        $this->assertSame('<p>We got it.</p>', $by_name['success_message']['value']);
        $this->assertTrue($by_name['success_message']['multiline']);
        $this->assertSame('Thanks for signing', $by_name['ty_email_subject']['value']);
        $this->assertFalse($by_name['ty_email_subject']['multiline']);
        $this->assertSame('<p>Thanks {{user_name}}</p>', $by_name['ty_email']['value']);
        $this->assertTrue($by_name['ty_email']['multiline']);
        $this->assertSame('https://example.com/thanks', $by_name['redirect_url']['value']);
        $this->assertSame('https://example.com/confirmed', $by_name['confirm_success_url']['value']);
        $this->assertSame('https://example.com/invalid', $by_name['confirm_error_url']['value']);
        $this->assertSame('First name', $by_name['field.fname.label']['value']);
        $this->assertSame('Jane', $by_name['field.fname.placeholder']['value']);
        $this->assertSame('<p>Terms</p>', $by_name['field.legal.value']['value']);
        $this->assertTrue($by_name['field.legal.value']['multiline']);
        $this->assertArrayNotHasKey('field.fname.value', $by_name);
        $this->assertArrayNotHasKey('field.legal.label', $by_name);
        $this->assertSame('Org A', $by_name['field.organization.option.Org A']['value']);
        $this->assertSame('Org B', $by_name['field.organization.option.org-b']['value']);
        $this->assertArrayNotHasKey('field.country.option.Canada', $by_name);
    }

    public function test_translate_select_option_label_uses_the_saved_choice()
    {
        $names = [];
        add_filter('av_petitioner_translate_string', function ($value, $name) use (&$names) {
            $names[] = $name;

            return 'Translated ' . $value;
        }, 10, 2);

        $this->assertSame(
            'Translated Org A',
            $this->translations->translate_select_option_label('Org A', 'organization', $this->form_id)
        );
        $this->assertSame(['field.organization.option.Org A'], $names);
    }

    public function test_country_option_value_stays_english()
    {
        $filter = function ($translation, $text, $domain) {
            if ($domain === 'petitioner' && $text === 'Canada') {
                return 'Канада';
            }

            return $translation;
        };
        add_filter('gettext', $filter, 10, 3);

        $this->assertSame('ca', AV_Petitioner_Select_Option_Migrator::country_code('ca'));
        $this->assertSame('ca', AV_Petitioner_Select_Option_Migrator::country_code('Canada'));
        $this->assertSame('ca', AV_Petitioner_Select_Option_Migrator::country_code('Канада'));
        $this->assertSame('Канада', $this->translations->translate_select_option_label('ca', 'country', $this->form_id, 'ca'));
        $this->assertSame(
            ['value' => 'Org A', 'label' => 'Org A'],
            AV_Petitioner_Select_Option_Migrator::normalize_option('Org A')
        );
        $this->assertSame(
            ['value' => 'ca', 'label' => 'Канада'],
            AV_Petitioner_Select_Option_Migrator::normalize_option('Canada', 'country')
        );

        remove_filter('gettext', $filter, 10);
    }

    public function test_register_label_overrides_registers_non_empty()
    {
        update_option('petitioner_label_overrides', wp_json_encode([
            'already_signed'    => 'You already signed',
            'could_not_submit'  => '',
        ]));

        $registered = [];
        add_action('av_petitioner_register_translation', function ($form_id, $name, $value, $multiline) use (&$registered) {
            $registered[] = compact('form_id', 'name', 'value', 'multiline');
        }, 10, 4);

        $this->translations->register_label_overrides();

        $by_name = [];
        foreach ($registered as $row) {
            $by_name[$row['name']] = $row;
        }

        $this->assertSame(0, $by_name['label.already_signed']['form_id']);
        $this->assertSame('You already signed', $by_name['label.already_signed']['value']);
        $this->assertFalse($by_name['label.already_signed']['multiline']);
        $this->assertArrayNotHasKey('label.could_not_submit', $by_name);
    }

    public function test_register_label_overrides_skips_non_string_option()
    {
        update_option('petitioner_label_overrides', ['already_signed' => 'You already signed']);

        $called = false;
        add_action('av_petitioner_register_translation', function () use (&$called) {
            $called = true;
        });

        $this->translations->register_label_overrides();
        $this->assertFalse($called);
    }

    public function test_maybe_translate_passes_lang()
    {
        add_filter('av_petitioner_translate_string', function ($value, $name, $form_id, $lang) {
            return $lang . ':' . $name . ':' . $value;
        }, 10, 4);

        $this->assertSame(
            'fr:letter:Dear minister',
            $this->translations->maybe_translate($this->form_id, 'letter', 'Dear minister', 'fr')
        );
    }

    public function test_translate_email_string_uses_lang()
    {
        add_filter('av_petitioner_translate_string', function ($value, $name, $form_id, $lang) {
            return $lang . ':' . $value;
        }, 10, 4);

        $this->assertSame(
            'fr:Dear minister',
            $this->translations->translate_email_string('Dear minister', 'letter', $this->form_id, 'fr')
        );
    }

    public function test_translate_email_string_keeps_source_when_lang_empty()
    {
        add_filter('av_petitioner_translate_string', function () {
            return 'FR';
        });

        $this->assertSame(
            'Dear minister',
            $this->translations->translate_email_string('Dear minister', 'letter', $this->form_id, '')
        );
    }

    public function test_translate_label()
    {
        add_filter('av_petitioner_translate_string', function ($value, $name) {
            return $name . ':' . $value;
        }, 10, 2);

        $this->assertSame(
            'label.already_signed:You already signed',
            $this->translations->translate_label('You already signed', 'already_signed')
        );
    }

    public function test_translate_label_skips_admin_screens()
    {
        add_filter('av_petitioner_translate_string', function () {
            return 'FR';
        });

        $GLOBALS['current_screen'] = new class {
            public function in_admin()
            {
                return true;
            }
        };

        $this->assertSame(
            'You already signed',
            $this->translations->translate_label('You already signed', 'already_signed')
        );

        unset($GLOBALS['current_screen']);
    }

    public function test_string_group_and_name()
    {
        $this->assertSame('Petitioner #12', AV_Petitioner_Translations::string_group(12));
        $this->assertSame('12:title', AV_Petitioner_Translations::string_name(12, 'title'));
        $this->assertSame('Petitioner Labels', AV_Petitioner_Translations::string_group(0));
        $this->assertSame('label.already_signed', AV_Petitioner_Translations::string_name(0, 'label.already_signed'));
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

    public function test_register_all_forms_falls_back_when_query_args_not_array()
    {
        update_post_meta($this->form_id, '_petitioner_title', 'Save the bees');

        $called = false;
        add_action('av_petitioner_register_translation', function () use (&$called) {
            $called = true;
        });
        add_filter('av_petitioner_translations_register_form_args', function () {
            return 'nope';
        });
        add_filter('posts_pre_query', function ($posts, $query) {
            if ($query->get('post_type') === 'petitioner-petition') {
                return [$this->form_id];
            }
            return $posts;
        }, 10, 2);

        $this->translations->register_all_forms();
        $this->assertTrue($called);
    }

    public function test_store_lang_writes_slug_on_submission()
    {
        $data = $this->translations->store_lang(['form_id' => $this->form_id], ['lang' => 'fr']);

        $this->assertSame('fr', $data['lang']);
        $this->assertArrayNotHasKey('custom_properties', $data);
    }

    public function test_store_lang_leaves_custom_properties_alone()
    {
        $data = $this->translations->store_lang([
            'custom_properties' => wp_json_encode(['org' => 'Greenpeace']),
        ], ['lang' => 'fr']);

        $this->assertSame('fr', $data['lang']);
        $this->assertSame('Greenpeace', AV_Petitioner_Custom_Properties::decode($data['custom_properties'])['org']);
    }

    public function test_store_lang_skips_empty_and_non_string()
    {
        $this->assertArrayNotHasKey('lang', $this->translations->store_lang([], []));
        $this->assertArrayNotHasKey('lang', $this->translations->store_lang([], ['lang' => '']));
        $this->assertArrayNotHasKey('lang', $this->translations->store_lang([], ['lang' => ['fr']]));
    }

    public function test_add_lang_to_mailer_reads_stored_lang()
    {
        $settings = $this->translations->add_lang_to_mailer([], [
            'lang' => 'fr',
        ]);

        $this->assertSame('fr', $settings['lang']);
    }

    public function test_add_lang_to_mailer_falls_back_to_post()
    {
        $_POST['lang'] = 'fr';

        $settings = $this->translations->add_lang_to_mailer([], []);

        unset($_POST['lang']);

        $this->assertSame('fr', $settings['lang']);
    }

    public function test_add_lang_to_confirmation_mailer_reads_submission()
    {
        $settings = $this->translations->add_lang_to_confirmation_mailer([], (object) [
            'lang' => 'fr',
        ]);

        $this->assertSame('fr', $settings['lang']);
    }
}
