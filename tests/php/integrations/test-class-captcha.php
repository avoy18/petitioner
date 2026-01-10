<?php

use WorDBless\BaseTestCase;

class Test_Captcha extends BaseTestCase
{

    public function set_up()
    {
        parent::set_up();
        do_action('init');

        // Set REMOTE_ADDR to prevent undefined index errors
        if (!isset($_SERVER['REMOTE_ADDR'])) {
            $_SERVER['REMOTE_ADDR'] = '127.0.0.1';
        }
    }

    public function tear_down()
    {
        parent::tear_down();
        
        // Clean up any filters
        remove_all_filters('pre_http_request');
    }

    // ============================================
    // VERIFY_CAPTCHA VALIDATION TESTS
    // ============================================

    public function test_verify_captcha_returns_error_for_invalid_type()
    {
        $result = AV_Petitioner_Captcha::verify_captcha('test_response', 'invalid_type');
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('Invalid CAPTCHA type', $result['message']);
    }

    public function test_verify_captcha_returns_error_for_empty_response()
    {
        $result = AV_Petitioner_Captcha::verify_captcha('', 'recaptcha');
        
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('CAPTCHA response is missing', $result['message']);
    }

    public function test_verify_captcha_returns_error_for_null_response()
    {
        $result = AV_Petitioner_Captcha::verify_captcha(null, 'recaptcha');
        
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('CAPTCHA response is missing', $result['message']);
    }

    // ============================================
    // PROVIDER VALIDATION TESTS
    // ============================================

    public function test_verify_captcha_accepts_recaptcha_type()
    {
        // Mock successful API response
        add_filter('pre_http_request', function($preempt, $args, $url) {
            if (strpos($url, 'google.com/recaptcha') !== false) {
                return [
                    'response' => ['code' => 200],
                    'body' => json_encode(['success' => true, 'score' => 0.9])
                ];
            }
            return $preempt;
        }, 10, 3);

        $result = AV_Petitioner_Captcha::verify_captcha('test_token', 'recaptcha');
        
        $this->assertTrue($result['success']);
        $this->assertStringContainsString('CAPTCHA verification completed', $result['message']);
    }

    public function test_verify_captcha_accepts_hcaptcha_type()
    {
        add_filter('pre_http_request', function($preempt, $args, $url) {
            if (strpos($url, 'hcaptcha.com') !== false) {
                return [
                    'response' => ['code' => 200],
                    'body' => json_encode(['success' => true])
                ];
            }
            return $preempt;
        }, 10, 3);

        $result = AV_Petitioner_Captcha::verify_captcha('test_token', 'hcaptcha');
        
        $this->assertTrue($result['success']);
    }

    public function test_verify_captcha_accepts_turnstile_type()
    {
        add_filter('pre_http_request', function($preempt, $args, $url) {
            if (strpos($url, 'cloudflare.com/turnstile') !== false) {
                return [
                    'response' => ['code' => 200],
                    'body' => json_encode(['success' => true])
                ];
            }
            return $preempt;
        }, 10, 3);

        $result = AV_Petitioner_Captcha::verify_captcha('test_token', 'turnstile');
        
        $this->assertTrue($result['success']);
    }

    // ============================================
    // HTTP ERROR HANDLING TESTS
    // ============================================

    public function test_verify_captcha_handles_connection_failure()
    {
        // Mock wp_error response
        add_filter('pre_http_request', function($preempt, $args, $url) {
            return new WP_Error('connection_failed', 'Connection failed');
        }, 10, 3);

        $result = AV_Petitioner_Captcha::verify_captcha('test_token', 'recaptcha');
        
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('Unable to connect', $result['message']);
    }

    public function test_verify_captcha_handles_api_failure_response()
    {
        add_filter('pre_http_request', function($preempt, $args, $url) {
            return [
                'response' => ['code' => 200],
                'body' => json_encode(['success' => false])
            ];
        }, 10, 3);

        $result = AV_Petitioner_Captcha::verify_captcha('test_token', 'recaptcha');
        
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('CAPTCHA verification failed', $result['message']);
    }

    public function test_verify_captcha_handles_missing_success_key()
    {
        add_filter('pre_http_request', function($preempt, $args, $url) {
            return [
                'response' => ['code' => 200],
                'body' => json_encode(['error' => 'invalid-input-response'])
            ];
        }, 10, 3);

        $result = AV_Petitioner_Captcha::verify_captcha('test_token', 'recaptcha');
        
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('CAPTCHA verification failed', $result['message']);
    }

    // ============================================
    // RECAPTCHA V3 SCORE TESTS
    // ============================================

    public function test_verify_captcha_rejects_low_recaptcha_score()
    {
        add_filter('pre_http_request', function($preempt, $args, $url) {
            if (strpos($url, 'google.com/recaptcha') !== false) {
                return [
                    'response' => ['code' => 200],
                    'body' => json_encode(['success' => true, 'score' => 0.3])
                ];
            }
            return $preempt;
        }, 10, 3);

        $result = AV_Petitioner_Captcha::verify_captcha('test_token', 'recaptcha');
        
        $this->assertFalse($result['success']);
        $this->assertStringContainsString('reCAPTCHA score too low', $result['message']);
    }

    public function test_verify_captcha_accepts_high_recaptcha_score()
    {
        add_filter('pre_http_request', function($preempt, $args, $url) {
            if (strpos($url, 'google.com/recaptcha') !== false) {
                return [
                    'response' => ['code' => 200],
                    'body' => json_encode(['success' => true, 'score' => 0.8])
                ];
            }
            return $preempt;
        }, 10, 3);

        $result = AV_Petitioner_Captcha::verify_captcha('test_token', 'recaptcha');
        
        $this->assertTrue($result['success']);
    }

    public function test_verify_captcha_accepts_recaptcha_without_score()
    {
        // reCAPTCHA v2 doesn't return score
        add_filter('pre_http_request', function($preempt, $args, $url) {
            if (strpos($url, 'google.com/recaptcha') !== false) {
                return [
                    'response' => ['code' => 200],
                    'body' => json_encode(['success' => true])
                ];
            }
            return $preempt;
        }, 10, 3);

        $result = AV_Petitioner_Captcha::verify_captcha('test_token', 'recaptcha');
        
        $this->assertTrue($result['success']);
    }

    public function test_verify_captcha_accepts_recaptcha_with_exact_threshold_score()
    {
        // Score of exactly 0.5 should pass (threshold is < 0.5)
        add_filter('pre_http_request', function($preempt, $args, $url) {
            if (strpos($url, 'google.com/recaptcha') !== false) {
                return [
                    'response' => ['code' => 200],
                    'body' => json_encode(['success' => true, 'score' => 0.5])
                ];
            }
            return $preempt;
        }, 10, 3);

        $result = AV_Petitioner_Captcha::verify_captcha('test_token', 'recaptcha');
        
        $this->assertTrue($result['success']);
    }

    // ============================================
    // SECRET KEY HANDLING TESTS
    // ============================================

    public function test_verify_captcha_uses_correct_secret_key_option()
    {
        // Set secret key option
        update_option('petitioner_recaptcha_secret_key', 'test_secret_key');

        $captured_args = null;
        add_filter('pre_http_request', function($preempt, $args, $url) use (&$captured_args) {
            if (strpos($url, 'google.com/recaptcha') !== false) {
                $captured_args = $args;
                return [
                    'response' => ['code' => 200],
                    'body' => json_encode(['success' => true])
                ];
            }
            return $preempt;
        }, 10, 3);

        AV_Petitioner_Captcha::verify_captcha('test_token', 'recaptcha');
        
        $this->assertNotNull($captured_args);
        $this->assertEquals('test_secret_key', $captured_args['body']['secret']);
    }

    public function test_verify_captcha_handles_missing_secret_key()
    {
        // Ensure no secret key is set
        delete_option('petitioner_recaptcha_secret_key');

        add_filter('pre_http_request', function($preempt, $args, $url) {
            if (strpos($url, 'google.com/recaptcha') !== false) {
                return [
                    'response' => ['code' => 200],
                    'body' => json_encode(['success' => false, 'error-codes' => ['missing-input-secret']])
                ];
            }
            return $preempt;
        }, 10, 3);

        $result = AV_Petitioner_Captcha::verify_captcha('test_token', 'recaptcha');
        
        // Should still make the request, but API will return failure
        $this->assertFalse($result['success']);
    }
}