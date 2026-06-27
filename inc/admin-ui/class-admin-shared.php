<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * @since 0.6.0
 */
class AV_Petitioner_Admin_Shared
{
    public function __construct()
    {
        add_action('av_petitioner_info_settings', array($this, 'set_active_tabs'), 10, 1);
        add_action('av_petitioner_info_edit', array($this, 'set_active_tabs'), 10, 1);
        add_filter('redirect_post_location', array($this, 'preserve_active_tab_on_redirect'), 10, 1);
    }

    /**
     * Ensuring that the active tab param is preserved on save
     * 
     * Check if it was part of referrer and re-add it to the redirect
     * @param mixed $location
     */
    public function preserve_active_tab_on_redirect($location)
    {
        $referer = wp_get_referer();
        
        if ($referer) {
            $parsed = wp_parse_url($referer);
            if (!empty($parsed['query'])) {
                wp_parse_str($parsed['query'], $query_args);
                if (!empty($query_args['ptr_active_tab'])) {
                    $location = add_query_arg('ptr_active_tab', sanitize_key($query_args['ptr_active_tab']), $location);
                }
            }
        }
        
        return $location;
    }

    public function set_active_tabs($petitioner_info = [])
    {
        $active_tab = !empty($_GET['ptr_active_tab']) ? sanitize_key(wp_unslash($_GET['ptr_active_tab'])) : '';

        $petitioner_info['active_tab'] = $active_tab;

        return $petitioner_info;
    }
}
