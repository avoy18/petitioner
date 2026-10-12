<?php

use WorDBless\BaseTestCase;

if (!function_exists('trp_translate')) {
    /**
     * @param string $content
     * @param string|null $language
     * @param bool $prevent_over_translation
     * @return mixed
     */
    function trp_translate($content, $language = null, $prevent_over_translation = true)
    {
        $GLOBALS['trp_test_calls'][] = [$content, $language, $prevent_over_translation];

        return array_key_exists('trp_test_return', $GLOBALS) ? $GLOBALS['trp_test_return'] : $content;
    }
}

class Test_TranslatePress extends BaseTestCase
{
    private AV_Petitioner_TranslatePress $adapter;

    public function set_up()
    {
        parent::set_up();
        $GLOBALS['trp_test_calls'] = [];
        unset($GLOBALS['trp_test_return'], $GLOBALS['TRP_LANGUAGE']);
        $this->adapter = new AV_Petitioner_TranslatePress();
    }

    public function tear_down()
    {
        remove_filter('av_petitioner_translate_string', [$this->adapter, 'translate_string'], 10);
        remove_filter('av_petitioner_locale', [$this->adapter, 'locale'], 10);
        remove_filter('av_petitioner_current_lang', [$this->adapter, 'current_lang']);
        unset($GLOBALS['trp_test_calls'], $GLOBALS['trp_test_return'], $GLOBALS['TRP_LANGUAGE']);
        parent::tear_down();
    }

    public function test_page_text_is_left_for_translatepress()
    {
        $GLOBALS['trp_test_return'] = 'Hallo';

        $this->assertSame('Hello', $this->adapter->translate_string('Hello', 'letter', 12, null));
        $this->assertSame('Hello', $this->adapter->translate_string('Hello', 'letter', 12, ''));
        $this->assertSame([], $GLOBALS['trp_test_calls']);
    }

    public function test_email_text_uses_the_stored_language()
    {
        $GLOBALS['trp_test_return'] = 'Hallo';

        $this->assertSame('Hallo', $this->adapter->translate_string('Hello', 'letter', 12, 'de_DE'));
        $this->assertSame([['Hello', 'de_DE', false]], $GLOBALS['trp_test_calls']);
    }

    public function test_empty_translation_keeps_the_source()
    {
        $GLOBALS['trp_test_return'] = '';

        $this->assertSame('Hello', $this->adapter->translate_string('Hello', 'letter', 12, 'de_DE'));

        $GLOBALS['trp_test_return'] = ['nope'];

        $this->assertSame('Hello', $this->adapter->translate_string('Hello', 'letter', 12, 'de_DE'));
    }

    public function test_redirect_and_success_use_the_current_language()
    {
        $GLOBALS['TRP_LANGUAGE'] = 'de_DE';
        $GLOBALS['trp_test_return'] = 'https://example.com/de/thanks';
        $translations = new AV_Petitioner_Translations();

        $this->assertSame(
            'https://example.com/de/thanks',
            $translations->translate_redirect_url('https://example.com/thanks', 4, 'redirect_url')
        );
        $this->assertSame('Dear', $this->adapter->translate_string('Dear', 'letter', 4, null));

        $GLOBALS['trp_test_calls'] = [];
        unset($GLOBALS['TRP_LANGUAGE']);
        $_POST['lang'] = 'fr_FR';
        $GLOBALS['trp_test_return'] = 'Merci';
        $this->assertSame('Merci', $this->adapter->translate_string('Thanks', 'success_message', 4, null));
        $this->assertSame([['Thanks', 'fr_FR', false]], $GLOBALS['trp_test_calls']);
        unset($_POST['lang']);

        $GLOBALS['trp_test_return'] = 'https://example.com/uk/confirmed';
        $this->assertSame(
            'https://example.com/uk/confirmed',
            $translations->translate_redirect_url('https://example.com/confirmed', 4, 'confirm_success_url', (object) ['lang' => 'uk'])
        );

        remove_action('save_post_petitioner-petition', [$translations, 'register_form'], 20);
        remove_action('admin_init', [$translations, 'register_all_forms']);
        remove_action('admin_init', [$translations, 'register_label_overrides']);
        remove_action('add_option_petitioner_label_overrides', [$translations, 'register_label_overrides']);
        remove_action('update_option_petitioner_label_overrides', [$translations, 'register_label_overrides']);
        remove_filter('av_petitioner_form_field', [$translations, 'translate_field'], 20);
        remove_filter('av_petitioner_title', [$translations, 'translate_title']);
        remove_filter('av_petitioner_subject', [$translations, 'translate_subject']);
        remove_filter('av_petitioner_letter', [$translations, 'translate_letter']);
        remove_filter('av_petitioner_success_message_title', [$translations, 'translate_success_message_title'], 10);
        remove_filter('av_petitioner_success_message', [$translations, 'translate_success_message'], 10);
        remove_filter('av_petitioner_redirect_url', [$translations, 'translate_redirect_url'], 10);
        remove_filter('av_petitioner_select_option_label', [$translations, 'translate_select_option_label'], 10);
        remove_filter('av_petitioner_label', [$translations, 'translate_label']);
        remove_filter('av_petitioner_email_string', [$translations, 'translate_email_string']);
        remove_filter('av_petitioner_submission_data_pre_save', [$translations, 'store_lang'], 20);
        remove_filter('av_petitioner_mailer_settings', [$translations, 'add_lang_to_mailer']);
        remove_filter('av_petitioner_confirmation_mailer_settings', [$translations, 'add_lang_to_confirmation_mailer']);
        remove_action('av_petitioner_before_email_prep', [$translations, 'switch_email_locale']);
        remove_action('av_petitioner_after_send_ty_email', [$translations, 'restore_locale']);
        remove_action('av_petitioner_after_send_rep_email', [$translations, 'restore_locale']);
    }

    public function test_current_language_is_the_translatepress_code()
    {
        $this->assertSame('', $this->adapter->current_lang(''));

        $GLOBALS['TRP_LANGUAGE'] = 'de_DE';

        $this->assertSame('de_DE', $this->adapter->current_lang(''));
        $this->assertSame('de_DE', $this->adapter->locale('', 'de_DE'));
        $this->assertSame('en_US', $this->adapter->locale('en_US', ''));
    }
}
