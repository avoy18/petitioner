<?php

/**
 * Stand-in for the Akismet plugin.
 *
 * get_api_key() follows Akismet's order: an explicit override for tests,
 * otherwise the WPCOM_API_KEY constant, otherwise the wordpress_api_key option,
 * then the akismet_get_api_key filter.
 *
 * Loaded only from tests that opt in, so the rest of the suite does not see it.
 */

if (!class_exists('Akismet')) {
    class Akismet
    {
        /**
         * When set, returned instead of the constant or option.
         *
         * @var string|null
         */
        public static $override = null;

        /**
         * @var array
         */
        public static $response = ['', 'false'];

        /**
         * @var array|null
         */
        public static $last_call = null;

        public static function get_api_key()
        {
            if (self::$override !== null) {
                $key = self::$override;
            } elseif (defined('WPCOM_API_KEY')) {
                $key = constant('WPCOM_API_KEY');
            } else {
                $option = get_option('wordpress_api_key');
                $key = is_string($option) ? $option : '';
            }

            return apply_filters('akismet_get_api_key', $key);
        }

        public static function http_post($request, $path, $ip = null)
        {
            self::$last_call = [
                'request' => $request,
                'path'    => $path,
                'ip'      => $ip,
                'key'     => self::get_api_key(),
            ];

            return self::$response;
        }
    }
}
