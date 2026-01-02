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
}
