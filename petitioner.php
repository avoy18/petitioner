<?php

/**
 * Plugin Name:       Petitioner WP
 * Description:       A WordPress plugin for collecting petitions.
 * Requires at least: 5.9
 * Requires PHP:      8.0
 * Version:           0.0.1
 * Author:            Anton Voytenko
 * License:           Apache-2.0 license
 * License URI:       https://github.com/avoy18/petitioner/blob/main/LICENSE
 * Text Domain:       petitioner-wp
 */

define('PTR_PLUGIN_DIR', plugin_dir_path(__FILE__));

define('PTR_VERSION', '0.0.1');

function petitioner_wp_admin_styles($hook)
{
    wp_enqueue_style('petitioner-css', plugin_dir_url(__FILE__) . '/petitioner.css', array(), PTR_VERSION);
}

add_action('admin_enqueue_scripts', 'petitioner_wp_admin_styles');

function petitioner_plugin_activate()
{
    add_option('petitioner_plugin_version', PTR_VERSION);
}

register_activation_hook(__FILE__, 'petitioner_plugin_activate');

function petitioner_plugin_deactivate()
{
    flush_rewrite_rules();
}

register_deactivation_hook(__FILE__, 'petitioner_plugin_deactivate');

function petitioner_plugin_uninstall()
{
    delete_option('petitioner_plugin_version');
}

register_uninstall_hook(__FILE__, 'petitioner_plugin_uninstall');

function petitioner_enqueue_scripts()
{
    wp_enqueue_style('petitioner-style', plugin_dir_url(__FILE__) . 'css/petitioner.css', array(), PTR_VERSION);
    wp_enqueue_script('petitioner-script', plugin_dir_url(__FILE__) . 'js/petitioner.js', array(), PTR_VERSION, true);
}

add_action('admin_enqueue_scripts', 'petitioner_enqueue_scripts');

add_action('wp_enqueue_scripts', 'petitioner_enqueue_scripts');

function petitioner_register_post_type()
{
    $args = array(
        'public'       => true,
        'label'        => 'Petitions',
        'supports'     => array('title'),
        'has_archive'  => true,
    );

    register_post_type('petitioner-petition', $args);
}

add_action('init', 'petitioner_register_post_type');
