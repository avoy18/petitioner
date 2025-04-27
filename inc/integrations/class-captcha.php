<?php

class AV_Petitioner_Captcha
{
    public static function enqueue_scripts()
    {
        // Captcha
        $is_recaptcha_enabled   = get_option('petitioner_enable_recaptcha', false);
        $is_hcaptcha_enabled    = get_option('petitioner_enable_hcaptcha', false);
        $is_turnstile_enabled   = get_option('petitioner_enable_turnstile', false);
        $recaptcha_site_key     = get_option('petitioner_recaptcha_site_key');
        $hcaptcha_site_key      = get_option('petitioner_hcaptcha_site_key');
        $turnstile_site_key     = get_option('petitioner_turnstile_site_key');

        // Enqueue the appropriate captcha script based on the settings
        // only one can be enabled at a time
        if ($is_recaptcha_enabled && !empty($recaptcha_site_key)) {
            wp_enqueue_script('petitioner-google-recaptcha-v3', 'https://www.google.com/recaptcha/api.js?render=' . esc_attr($recaptcha_site_key), [], null, true);
        } else if ($is_hcaptcha_enabled && !empty($hcaptcha_site_key)) {
            wp_enqueue_script('hcaptcha', 'https://js.hcaptcha.com/1/api.js', [], null, true);
        } else if ($is_turnstile_enabled && !empty($turnstile_site_key)) {
            wp_enqueue_script('petitioner-turnstile', 'https://challenges.cloudflare.com/turnstile/v0/api.js', [], null, true);
        }

        wp_localize_script('petitioner-script', 'petitionerCaptcha', [
            'recaptchaSiteKey'  => $recaptcha_site_key,
            'hcaptchaSiteKey'   => $hcaptcha_site_key,
            'enableRecaptcha'   => $is_recaptcha_enabled,
            'enableHcaptcha'    => $is_hcaptcha_enabled,
            'enableTurnstile'   => $is_turnstile_enabled,
            'turnstileSiteKey'  => $turnstile_site_key,
        ]);
    }

    public static function render_inputs()
    {
        $is_recaptcha_enabled               = get_option('petitioner_enable_recaptcha', false);
        $is_hcaptcha_enabled                = get_option('petitioner_enable_hcaptcha', false);
        $is_turnstile_enabled               = get_option('petitioner_enable_turnstile', false);

?>
        <?php if ($is_turnstile_enabled): ?>
            <span class="petitioner-turnstile-container"></span>
            <input type="hidden" name="petitioner-turnstile-response" id="petitioner-turnstile-response">
        <?php endif; ?>

        <?php if ($is_recaptcha_enabled): ?>
            <input type="hidden" name="petitioner-g-recaptcha-response" id="petitioner-g-recaptcha-response">
            <p class="petitioner-disclaimer-text">
                <?php
                // translators: %1$s is the opening anchor tag, %2$s is the closing anchor tag
                printf(
                    esc_html__(
                        'This site is protected by reCAPTCHA and the Google %1$sPrivacy Policy%2$s and %3$sTerms of Service%4$s apply.',
                        'petitioner'
                    ),
                    '<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">',
                    '</a>',
                    '<a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">',
                    '</a>'
                );
                ?>
            </p>
        <?php endif; ?>

        <?php if ($is_hcaptcha_enabled): ?>
            <span class="petitioner-h-captcha-container"></span>
            <input type="hidden" name="petitioner-h-captcha-response" class="petitioner-h-captcha-response">
            <p class="petitioner-disclaimer-text">
                <?php
                // translators: %1$s is the opening anchor tag, %2$s is the closing anchor tag
                printf(
                    esc_html__(
                        'This site is protected by hCaptcha and its %1$sPrivacy Policy%2$s and %3$sTerms of Service%4$s apply.',
                        'petitioner'
                    ),
                    '<a href="https://www.hcaptcha.com/privacy" target="_blank" rel="noopener noreferrer">',
                    '</a>',
                    '<a href="https://www.hcaptcha.com/terms" target="_blank" rel="noopener noreferrer">',
                    '</a>'
                );
                ?>
            </p>
        <?php endif; ?>
<?php
    }

    public static function validate_captcha($captcha_response)
    {

        $recaptcha_enabled  = get_option('petitioner_enable_recaptcha', false);
        $hcaptcha_enabled   = get_option('petitioner_enable_hcaptcha', false);
        $turnstile_enabled   = get_option('petitioner_enable_turnstile', false);

        if ($recaptcha_enabled) {
            $recaptcha_response = isset($_POST['petitioner-g-recaptcha-response']) ? sanitize_text_field(wp_unslash($_POST['petitioner-g-recaptcha-response'])) : '';

            $recaptcha_result = self::verify_captcha($recaptcha_response, 'recaptcha');

            if (!$recaptcha_result['success']) {
                wp_send_json_error($recaptcha_result['message']);
                wp_die();
            }
        }

        if ($hcaptcha_enabled) {
            $hcaptcha_response = isset($_POST['petitioner-h-captcha-response']) ? sanitize_text_field(wp_unslash($_POST['petitioner-h-captcha-response'])) : '';

            $hcaptcha_result = self::verify_captcha($hcaptcha_response, 'hcaptcha');

            if (!$hcaptcha_result['success']) {
                wp_send_json_error($hcaptcha_result['message']);
                wp_die();
            }
        }

        if ($turnstile_enabled) {
            $turnstile_response = isset($_POST['petitioner-turnstile-response']) ? sanitize_text_field(wp_unslash($_POST['petitioner-turnstile-response'])) : '';

            $turnstile_result = self::verify_captcha($turnstile_response, 'turnstile');

            if (!$turnstile_result['success']) {
                wp_send_json_error($turnstile_result['message']);
                wp_die();
            }
        }

        return true;
    }

    /**
     * Verify the CAPTCHA response (Supports both Google reCAPTCHA v3 & hCaptcha).
     *
     * @param string $captcha_response The CAPTCHA response token from the form.
     * @param string $captcha_type The type of CAPTCHA ('recaptcha' or 'hcaptcha').
     * @return array Response array with 'success' boolean and 'message' string.
     * @since 0.2.3
     */
    public static function verify_captcha($captcha_response, $captcha_type = 'recaptcha')
    {
        // Lookup table for each CAPTCHA provider
        $providers = [
            'recaptcha' => [
                'secret_key_option' => 'petitioner_recaptcha_secret_key',
                'verify_url'        => 'https://www.google.com/recaptcha/api/siteverify',
            ],
            'hcaptcha' => [
                'secret_key_option' => 'petitioner_hcaptcha_secret_key',
                'verify_url'        => 'https://hcaptcha.com/siteverify',
            ],
            'turnstile' => [
                'secret_key_option' => 'petitioner_turnstile_secret_key',
                'verify_url'        => 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            ],
        ];

        // Validate captcha type
        if (! isset($providers[$captcha_type])) {
            return [
                'success' => false,
                'message' => __('Invalid CAPTCHA type.', 'petitioner'),
            ];
        }

        $provider = $providers[$captcha_type];
        $captcha_secret = get_option($provider['secret_key_option'], '');

        // Handle missing response
        if (empty($captcha_response)) {
            return [
                'success' => false,
                'message' => __('CAPTCHA response is missing.', 'petitioner'),
            ];
        }

        // Send request to verification API
        $api_response = wp_remote_post($provider['verify_url'], [
            'body' => [
                'secret'   => $captcha_secret,
                'response' => $captcha_response,
                'remoteip' => $_SERVER['REMOTE_ADDR'],
            ],
        ]);

        // Handle connection failure
        if (is_wp_error($api_response)) {
            return [
                'success' => false,
                'message' => __('CAPTCHA verification failed: Unable to connect.', 'petitioner'),
            ];
        }

        // Decode API response
        $body = json_decode(wp_remote_retrieve_body($api_response), true);

        // Validate general success
        if (! isset($body['success']) || ! $body['success']) {
            return [
                'success' => false,
                'message' => __('CAPTCHA verification failed.', 'petitioner'),
            ];
        }

        // Special case: Check reCAPTCHA v3 score
        if ($captcha_type === 'recaptcha' && isset($body['score']) && $body['score'] < 0.5) {
            return [
                'success' => false,
                'message' => __('reCAPTCHA score too low. Please try again.', 'petitioner'),
            ];
        }

        return [
            'success' => true,
            'message' => __('CAPTCHA verification completed.', 'petitioner'),
        ];
    }
}
