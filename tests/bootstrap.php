<?php

/**
 * Bootstrap file for PHPUnit tests
 */

use WorDBless\Load;

// Define ABSPATH if not already defined
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/../wordpress/');
}

// Create necessary WordPress directories
$wp_content_dir = dirname(__DIR__) . '/wordpress/wp-content';
if (!file_exists($wp_content_dir)) {
    mkdir($wp_content_dir, 0755, true);
}

if (!file_exists($wp_content_dir . '/plugins')) {
    mkdir($wp_content_dir . '/plugins', 0755, true);
}

// Copy dbless-wpdb.php
$dbless_file = dirname(__DIR__) . '/vendor/automattic/wordbless/src/dbless-wpdb.php';
$db_file = $wp_content_dir . '/db.php';
if (file_exists($dbless_file) && !file_exists($db_file)) {
    copy($dbless_file, $db_file);
}

// Create symlink to plugin
$plugin_src = realpath(dirname(__DIR__));
$plugin_dest = $wp_content_dir . '/plugins/petitioner';
if (is_dir($plugin_src) && !file_exists($plugin_dest)) {
    symlink($plugin_src, $plugin_dest);
}

// Load Composer autoloader
require_once dirname(__DIR__) . '/vendor/autoload.php';

// Load WordBless
Load::load();

// Load plugin
require_once dirname(__DIR__) . '/petitioner.php';
