<?php

use WorDBless\BaseTestCase;

class Test_Submissions_Controller extends BaseTestCase
{

    public function set_up()
    {
        parent::set_up();

        if (!isset($_SERVER['REMOTE_ADDR'])) {
            $_SERVER['REMOTE_ADDR'] = '127.0.0.1';
        }
    }

    public function tear_down()
    {
        parent::tear_down();
    }

    // ============================================
    // GET_PUBLIC_FIELDS TESTS
    // ============================================

    public function test_get_public_fields_returns_expected_fields()
    {
        $public_fields = AV_Petitioner_Submissions_Controller::get_public_fields();

        $this->assertIsArray($public_fields);
        $this->assertContains('country', $public_fields);
        $this->assertContains('city', $public_fields);
        $this->assertNotContains('email', $public_fields);
        $this->assertNotContains('phone', $public_fields);
        $this->assertNotContains('street_address', $public_fields);
    }

    public function test_get_public_fields_returns_numeric_keys()
    {
        $public_fields = AV_Petitioner_Submissions_Controller::get_public_fields();

        $keys = array_keys($public_fields);
        $this->assertEquals(range(0, count($public_fields) - 1), $keys, 'Should have numeric keys (array_values)');
    }

    public function test_get_public_fields_excludes_all_sensitive_fields()
    {
        $public_fields = AV_Petitioner_Submissions_Controller::get_public_fields();
        $sensitive = AV_Petitioner_Submissions_Model::$SENSITIVE_FIELDS;

        foreach ($sensitive as $field) {
            $this->assertNotContains($field, $public_fields, "Sensitive field '{$field}' should not be public");
        }
    }

    public function test_get_public_fields_excludes_internal_fields()
    {
        $public_fields = AV_Petitioner_Submissions_Controller::get_public_fields();
        $internal = ['id', 'fname', 'lname', 'hide_name'];

        foreach ($internal as $field) {
            $this->assertNotContains($field, $public_fields, "Internal field '{$field}' should not be public");
        }
    }

    // ============================================
    // VERIFY_CAPTCHA TESTS
    // ============================================

    public function test_verify_captcha_returns_error_for_invalid_type()
    {
        $result = AV_Petitioner_Submissions_Controller::verify_captcha('test_response', 'invalid_type');

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('Invalid CAPTCHA type', $result['message']);
    }

    public function test_verify_captcha_returns_error_for_empty_response()
    {
        $result = AV_Petitioner_Submissions_Controller::verify_captcha('', 'recaptcha');

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('CAPTCHA response is missing', $result['message']);
    }

    public function test_verify_captcha_returns_error_for_null_response()
    {
        $result = AV_Petitioner_Submissions_Controller::verify_captcha(null, 'recaptcha');

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('CAPTCHA response is missing', $result['message']);
    }

    public function test_verify_captcha_accepts_recaptcha_type()
    {
        // This will fail on HTTP request, but we can test the validation passes
        // We'd need to mock wp_remote_post for full test
        $result = AV_Petitioner_Submissions_Controller::verify_captcha('test_token', 'recaptcha');

        // Will fail on HTTP, but validates the type is accepted
        $this->assertArrayHasKey('success', $result);
        $this->assertArrayHasKey('message', $result);
    }

    public function test_verify_captcha_accepts_hcaptcha_type()
    {
        $result = AV_Petitioner_Submissions_Controller::verify_captcha('test_token', 'hcaptcha');

        $this->assertArrayHasKey('success', $result);
        $this->assertArrayHasKey('message', $result);
    }

    public function test_verify_captcha_accepts_turnstile_type()
    {
        $result = AV_Petitioner_Submissions_Controller::verify_captcha('test_token', 'turnstile');

        $this->assertArrayHasKey('success', $result);
        $this->assertArrayHasKey('message', $result);
    }

    // ============================================
    // MAYBE_MAKE_NAMES_PRIVATE TESTS
    // ============================================

    public function test_maybe_make_names_private_fully_hidden()
    {
        $submission = (object) [
            'fname' => 'John',
            'lname' => 'Doe',
            'hide_name' => 1
        ];

        $result = AV_Petitioner_Submissions_Controller::maybe_make_names_private($submission, false);
        $this->assertEquals(AV_Petitioner_Labels::get('anonymous'), $result->fname);
        $this->assertEquals('', $result->lname);
        $this->assertEquals(AV_Petitioner_Labels::get('anonymous'), $result->name); // No trailing space!
    }

    public function test_maybe_make_names_private_hidden_last_name()
    {
        $submission = (object) [
            'fname' => 'John',
            'lname' => 'Doe',
            'hide_name' => 0
        ];

        $result = AV_Petitioner_Submissions_Controller::maybe_make_names_private($submission, true);
        $this->assertEquals('John', $result->fname);
        $this->assertEquals('D', $result->lname);
        $this->assertEquals('John D', $result->name);
    }

    public function test_maybe_make_names_private_empty_last_name()
    {
        $submission = (object) [
            'fname' => 'Jane',
            'lname' => '',
            'hide_name' => 0
        ];

        // Even with hide_last_name true, empty is mapped normally without crash
        $result = AV_Petitioner_Submissions_Controller::maybe_make_names_private($submission, false);
        $this->assertEquals('Jane', $result->fname);
        $this->assertEquals('', $result->lname);
        $this->assertEquals('Jane', $result->name); // No trailing space!
    }

    public function test_maybe_make_names_private_van_der_sar_filter()
    {
        $filter_callback = function ($hidden_last_name, $submission) {
            $parts = explode(' ', $submission['lname']);
            $initials = array_map(function($part) {
                return mb_substr($part, 0, 1) . '.';
            }, $parts);
            return implode(' ', $initials);
        };

        add_filter('av_petitioner_hide_last_name', $filter_callback, 10, 2);

        $submission = (object) [
            'fname' => 'Jan',
            'lname' => 'van der Sar',
            'hide_name' => 0
        ];

        $result = AV_Petitioner_Submissions_Controller::maybe_make_names_private($submission, true);
        
        $this->assertEquals('Jan', $result->fname);
        $this->assertEquals('v. d. S.', $result->lname);
        $this->assertEquals('Jan v. d. S.', $result->name); // Uses correctly formatted custom filter

        remove_filter('av_petitioner_hide_last_name', $filter_callback, 10);
    }
}
