<?php
if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Class AV_Petitioner_Akismet
 *
 * Integrates Akismet spam filtering with petition submissions.
 *
 * The API key is resolved the same way Akismet resolves it. On WordPress.com
 * and Jetpack-managed sites the key is often provided through
 * Akismet::get_api_key() (the WPCOM_API_KEY constant, Jetpack's
 * akismet_get_api_key filter, or both) and the wordpress_api_key option is empty.
 */
class AV_Petitioner_Akismet
{
    /**
     * Whether a signature should be rejected as spam.
     *
     * Returns false when the integration is off, Akismet cannot be called,
     * or no API key is available. A missing key skips the check.
     *
     * @param string     $email
     * @param string     $fname
     * @param string     $lname
     * @param string     $country
     * @param int|string $form_id
     * @return bool
     */
    public static function check_with_akismet($email, $fname, $lname, $country, $form_id)
    {
        if (!get_option('petitioner_enable_akismet') || !self::can_check()) {
            return false;
        }

        $api_key = self::get_api_key();

        if ($api_key === '') {
            return false;
        }

        $response = self::comment_check($api_key, $email, $fname, $lname, $country, $form_id);

        return self::response_is_spam($response);
    }

    /**
     * API key Akismet would use for this site, or an empty string.
     *
     * Prefers Akismet's public API. When that API is not loaded, falls back
     * to akismet_get_key(), the WPCOM_API_KEY constant, the wordpress_api_key
     * option, and Akismet's akismet_get_api_key filter (Jetpack / WordPress.com).
     *
     * @return string
     */
    public static function get_api_key()
    {
        if (is_callable(['Akismet', 'get_api_key'])) {
            return self::normalize_key(Akismet::get_api_key());
        }

        if (function_exists('akismet_get_key')) {
            return self::normalize_key(akismet_get_key());
        }

        $key = self::key_from_constant();

        if ($key === '') {
            $key = self::normalize_key(get_option('wordpress_api_key'));
        }

        /**
         * Akismet applies this filter inside Akismet::get_api_key().
         * Apply it here when that method is unavailable so Jetpack and
         * WordPress.com can still provide the key.
         */
        $filtered = apply_filters('akismet_get_api_key', $key);

        return self::normalize_key($filtered);
    }

    /**
     * Whether a usable Akismet API key was found.
     *
     * @return bool
     */
    public static function has_api_key()
    {
        return self::get_api_key() !== '';
    }

    /**
     * Tell the settings screen whether a usable Akismet key was found.
     *
     * @param mixed $info
     * @return mixed
     */
    public static function add_settings_status($info)
    {
        if (!is_array($info)) {
            return $info;
        }

        $info['akismet_has_api_key'] = self::has_api_key();

        return $info;
    }

    /**
     * @return bool
     */
    private static function can_check()
    {
        return is_callable(['Akismet', 'http_post']) || function_exists('akismet_http_post');
    }

    /**
     * @return string
     */
    private static function key_from_constant()
    {
        if (!defined('WPCOM_API_KEY')) {
            return '';
        }

        return self::normalize_key(constant('WPCOM_API_KEY'));
    }

    /**
     * @param mixed $key
     * @return string
     */
    private static function normalize_key($key)
    {
        if (!is_string($key)) {
            return '';
        }

        return trim($key);
    }

    /**
     * @param string     $api_key
     * @param string     $email
     * @param string     $fname
     * @param string     $lname
     * @param string     $country
     * @param int|string $form_id
     * @return array
     */
    private static function comment_check($api_key, $email, $fname, $lname, $country, $form_id)
    {
        $full_name = trim($fname . ' ' . $lname);

        $query = [
            'blog'                 => get_option('home'),
            'user_ip'              => $_SERVER['REMOTE_ADDR'] ?? '',
            'user_agent'           => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'referrer'             => $_SERVER['HTTP_REFERER'] ?? '',
            'comment_type'         => 'signup',
            'comment_author'       => $full_name,
            'comment_author_email' => $email,
            'comment_author_url'   => '',
            'comment_content'      => 'Country: ' . $country . '. Form ID: ' . $form_id,
        ];

        $request = http_build_query($query);

        if (is_callable(['Akismet', 'http_post'])) {
            return Akismet::http_post($request, 'comment-check');
        }

        if (function_exists('akismet_http_post')) {
            return akismet_http_post($request, $api_key . '.rest.akismet.com', '/1.1/comment-check');
        }

        return ['', ''];
    }

    /**
     * @param mixed $response
     * @return bool
     */
    private static function response_is_spam($response)
    {
        if (!is_array($response) || !isset($response[1])) {
            return false;
        }

        return trim((string) $response[1]) === 'true';
    }
}

add_filter('av_petitioner_info_settings', ['AV_Petitioner_Akismet', 'add_settings_status']);
