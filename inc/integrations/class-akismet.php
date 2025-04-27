<?php
/**
 * Class AV_Petitioner_Akismet
 *
 * This class integrates the Akismet service with the Petitioner plugin.
 * Akismet is used to detect and filter spam submissions.
 *
*/
class AV_Petitioner_Akismet
{
    public static function check_with_akismet($email, $fname, $lname, $country, $form_id)
    {
        $enable_akismet = get_option('petitioner_enable_akismet');

        // skip if the plugin or the integration are not enabled
        if (!function_exists('akismet_http_post') || !$enable_akismet) {
            return false;
        }

        $akismet_api_key = get_option('wordpress_api_key');

        if (empty($akismet_api_key)) {
            return false;
        }

        $blog = get_option('home');

        $full_name = trim($fname . ' ' . $lname);

        $query = [
            'blog'                 => $blog,
            'user_ip'              => $_SERVER['REMOTE_ADDR'],
            'user_agent'           => $_SERVER['HTTP_USER_AGENT'],
            'referrer'             => $_SERVER['HTTP_REFERER'] ?? '',
            'comment_type'         => 'signup',
            'comment_author'       => $full_name,
            'comment_author_email' => $email,
            'comment_author_url'   => '',
            'comment_content'      => 'Country: ' . $country . '. Form ID: ' . $form_id,
        ];

        $path = '/1.1/comment-check';
        $response = akismet_http_post(http_build_query($query), $akismet_api_key . '.rest.akismet.com', $path);

        if (! empty($response[1]) && trim($response[1]) === 'true') {
            return true;
        }

        return false;
    }
}
