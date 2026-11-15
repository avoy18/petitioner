<?php

use WorDBless\BaseTestCase;

/**
 * Key lookup and spam checks when the Akismet plugin API is not loaded.
 */
class Test_Akismet_Key_Fallbacks extends BaseTestCase
{
    public function set_up()
    {
        parent::set_up();

        $_SERVER['REMOTE_ADDR'] = '127.0.0.1';
        $_SERVER['HTTP_USER_AGENT'] = 'PetitionerTest';
        $_SERVER['HTTP_REFERER'] = 'https://example.com/petition';

        delete_option('wordpress_api_key');
        delete_option('petitioner_enable_akismet');
    }

    public function tear_down()
    {
        delete_option('wordpress_api_key');
        delete_option('petitioner_enable_akismet');
        remove_all_filters('akismet_get_api_key');
        parent::tear_down();
    }

    public function test_key_from_option_when_akismet_is_not_loaded()
    {
        update_option('wordpress_api_key', 'option-key');

        $this->assertSame('option-key', AV_Petitioner_Akismet::get_api_key());
        $this->assertTrue(AV_Petitioner_Akismet::has_api_key());
    }

    public function test_blank_option_is_not_a_key()
    {
        update_option('wordpress_api_key', '   ');

        $this->assertSame('', AV_Petitioner_Akismet::get_api_key());
        $this->assertFalse(AV_Petitioner_Akismet::has_api_key());
    }

    public function test_non_string_option_is_not_a_key()
    {
        update_option('wordpress_api_key', ['not-a-key']);

        $this->assertSame('', AV_Petitioner_Akismet::get_api_key());
    }

    public function test_key_from_akismet_filter_when_option_is_empty()
    {
        add_filter('akismet_get_api_key', function () {
            return 'jetpack-key';
        });

        $this->assertSame('jetpack-key', AV_Petitioner_Akismet::get_api_key());
    }

    public function test_missing_key_skips_the_spam_check()
    {
        update_option('petitioner_enable_akismet', 1);

        $this->assertFalse(AV_Petitioner_Akismet::check_with_akismet(
            'akismet-guaranteed-spam@example.com',
            'akismet-guaranteed-spam',
            '',
            'US',
            15
        ));
    }

    public function test_settings_status_reports_whether_a_key_was_found()
    {
        $without_key = apply_filters('av_petitioner_info_settings', []);
        $this->assertFalse($without_key['akismet_has_api_key']);

        update_option('wordpress_api_key', 'option-key');

        $with_key = apply_filters('av_petitioner_info_settings', []);
        $this->assertTrue($with_key['akismet_has_api_key']);
    }

    public function test_settings_status_leaves_non_arrays_alone()
    {
        $this->assertSame('nope', AV_Petitioner_Akismet::add_settings_status('nope'));
    }
}

/**
 * The WPCOM_API_KEY constant cannot be undefined later, so these tests run
 * in their own process. They also cover the legacy procedural Akismet API.
 *
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class Test_Akismet_Constant_And_Legacy_Api extends BaseTestCase
{
    public function set_up()
    {
        parent::set_up();

        $_SERVER['REMOTE_ADDR'] = '127.0.0.1';
        $_SERVER['HTTP_USER_AGENT'] = 'PetitionerTest';
        $_SERVER['HTTP_REFERER'] = 'https://example.com/petition';

        delete_option('wordpress_api_key');
        delete_option('petitioner_enable_akismet');
    }

    public function tear_down()
    {
        delete_option('wordpress_api_key');
        delete_option('petitioner_enable_akismet');
        remove_all_filters('akismet_get_api_key');
        parent::tear_down();
    }

    public function test_key_from_wpcom_constant_when_option_is_empty()
    {
        if (!defined('WPCOM_API_KEY')) {
            define('WPCOM_API_KEY', 'constant-key');
        }

        update_option('wordpress_api_key', '');

        $this->assertSame('constant-key', AV_Petitioner_Akismet::get_api_key());
    }

    public function test_constant_wins_over_a_different_option()
    {
        if (!defined('WPCOM_API_KEY')) {
            define('WPCOM_API_KEY', 'constant-key');
        }

        update_option('wordpress_api_key', 'option-key');

        $this->assertSame('constant-key', AV_Petitioner_Akismet::get_api_key());
    }

    public function test_akismet_get_key_is_preferred_over_the_option()
    {
        update_option('wordpress_api_key', 'option-key');

        $this->define_akismet_get_key('function-key');

        $this->assertSame('function-key', AV_Petitioner_Akismet::get_api_key());
    }

    public function test_legacy_http_post_uses_the_constant_key_and_flags_spam()
    {
        if (!defined('WPCOM_API_KEY')) {
            define('WPCOM_API_KEY', 'constant-key');
        }

        update_option('petitioner_enable_akismet', 1);
        delete_option('wordpress_api_key');

        $this->define_legacy_http_post();

        $is_spam = AV_Petitioner_Akismet::check_with_akismet(
            'akismet-guaranteed-spam@example.com',
            'akismet-guaranteed-spam',
            'User',
            'US',
            42
        );

        $this->assertTrue($is_spam);
        $this->assertSame('constant-key.rest.akismet.com', $GLOBALS['petitioner_akismet_test']['host']);
        $this->assertSame('/1.1/comment-check', $GLOBALS['petitioner_akismet_test']['path']);

        $request = urldecode($GLOBALS['petitioner_akismet_test']['request']);
        $this->assertStringContainsString('akismet-guaranteed-spam@example.com', $request);
        $this->assertStringContainsString('akismet-guaranteed-spam User', $request);
    }

    public function test_disabled_integration_does_not_call_legacy_http_post()
    {
        if (!defined('WPCOM_API_KEY')) {
            define('WPCOM_API_KEY', 'constant-key');
        }

        update_option('petitioner_enable_akismet', 0);
        $this->define_legacy_http_post();

        $this->assertFalse(AV_Petitioner_Akismet::check_with_akismet(
            'person@example.com',
            'Pat',
            'Lee',
            'US',
            1
        ));
        $this->assertArrayNotHasKey('petitioner_akismet_test', $GLOBALS);
    }

    /**
     * @param string $key
     */
    private function define_akismet_get_key($key)
    {
        if (!function_exists('akismet_get_key')) {
            eval('function akismet_get_key() { return ' . var_export($key, true) . '; }');
        }
    }

    private function define_legacy_http_post()
    {
        if (function_exists('akismet_http_post')) {
            return;
        }

        eval(<<<'PHP'
function akismet_http_post($request, $host, $path, $port = 80, $ip = null) {
    $GLOBALS['petitioner_akismet_test'] = [
        'request' => $request,
        'host' => $host,
        'path' => $path,
        'port' => $port,
        'ip' => $ip,
    ];

    return ['headers', 'true'];
}
PHP);
    }
}

/**
 * Key lookup when Akismet itself is loaded. The stub stands in for
 * Akismet::get_api_key() and Akismet::http_post().
 *
 * @runTestsInSeparateProcesses
 * @preserveGlobalState disabled
 */
class Test_Akismet_With_Plugin extends BaseTestCase
{
    public function set_up()
    {
        parent::set_up();

        require_once __DIR__ . '/akismet-stub.php';

        Akismet::$override = null;
        Akismet::$response = ['', 'false'];
        Akismet::$last_call = null;

        $_SERVER['REMOTE_ADDR'] = '127.0.0.1';
        $_SERVER['HTTP_USER_AGENT'] = 'PetitionerTest';
        $_SERVER['HTTP_REFERER'] = 'https://example.com/petition';

        delete_option('wordpress_api_key');
        delete_option('petitioner_enable_akismet');
    }

    public function tear_down()
    {
        delete_option('wordpress_api_key');
        delete_option('petitioner_enable_akismet');
        remove_all_filters('akismet_get_api_key');
        parent::tear_down();
    }

    public function test_key_from_akismet_class_when_option_is_empty()
    {
        Akismet::$override = 'class-key';

        $this->assertFalse(get_option('wordpress_api_key'));
        $this->assertSame('class-key', AV_Petitioner_Akismet::get_api_key());
    }

    public function test_akismet_class_wins_over_the_option()
    {
        Akismet::$override = 'class-key';
        update_option('wordpress_api_key', 'option-key');

        $this->assertSame('class-key', AV_Petitioner_Akismet::get_api_key());
    }

    public function test_class_key_from_constant_is_used_when_option_is_empty()
    {
        if (!defined('WPCOM_API_KEY')) {
            define('WPCOM_API_KEY', 'constant-key');
        }

        Akismet::$override = null;
        update_option('wordpress_api_key', '');

        $this->assertSame('constant-key', AV_Petitioner_Akismet::get_api_key());
    }

    public function test_spam_response_rejects_guaranteed_spam_without_using_the_option()
    {
        Akismet::$override = 'class-key';
        Akismet::$response = ['headers', "true\n"];
        update_option('petitioner_enable_akismet', 1);
        delete_option('wordpress_api_key');

        $is_spam = AV_Petitioner_Akismet::check_with_akismet(
            'akismet-guaranteed-spam@example.com',
            'akismet-guaranteed-spam',
            '',
            'CA',
            9
        );

        $this->assertTrue($is_spam);
        $this->assertNotNull(Akismet::$last_call);
        $this->assertSame('comment-check', Akismet::$last_call['path']);
        $this->assertSame('class-key', Akismet::$last_call['key']);

        $request = urldecode(Akismet::$last_call['request']);
        $this->assertStringContainsString('akismet-guaranteed-spam@example.com', $request);
        $this->assertStringContainsString('comment_author=akismet-guaranteed-spam', $request);
    }

    public function test_ham_response_is_not_spam()
    {
        Akismet::$override = 'class-key';
        Akismet::$response = ['headers', 'false'];
        update_option('petitioner_enable_akismet', 1);

        $this->assertFalse(AV_Petitioner_Akismet::check_with_akismet(
            'person@example.com',
            'Pat',
            'Lee',
            'US',
            3
        ));
    }

    public function test_empty_class_key_does_not_fall_back_to_the_option()
    {
        Akismet::$override = '';
        update_option('wordpress_api_key', 'option-key');

        $this->assertSame('', AV_Petitioner_Akismet::get_api_key());
    }

    public function test_empty_class_key_skips_http_post_even_if_integration_is_enabled()
    {
        Akismet::$override = '';
        update_option('petitioner_enable_akismet', 1);

        $this->assertFalse(AV_Petitioner_Akismet::check_with_akismet(
            'akismet-guaranteed-spam@example.com',
            'akismet-guaranteed-spam',
            '',
            'US',
            9
        ));
        $this->assertNull(Akismet::$last_call);
    }

    public function test_settings_status_follows_the_class_key()
    {
        Akismet::$override = '';
        $inactive = apply_filters('av_petitioner_info_settings', []);
        $this->assertFalse($inactive['akismet_has_api_key']);

        Akismet::$override = 'class-key';
        $active = apply_filters('av_petitioner_info_settings', []);
        $this->assertTrue($active['akismet_has_api_key']);
    }
}
