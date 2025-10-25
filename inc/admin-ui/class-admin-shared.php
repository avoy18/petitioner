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
    }

    public function set_active_tabs($petitioner_info = [])
    {
        $active_tab = !empty($_GET['ptr_active_tab']) ? sanitize_key(wp_unslash($_GET['ptr_active_tab'])) : '';

        $petitioner_info['active_tab'] = $active_tab;

        return $petitioner_info;
    }
}
