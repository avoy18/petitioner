<?php

/**
 * Bootstrap file for PHPUnit tests
 */

use WorDBless\Load;

// Define ABSPATH if not already defined
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/../wordpress/');
}

// Copy dbless-wpdb.php
$dbless_file = dirname(__DIR__) . '/vendor/automattic/wordbless/src/dbless-wpdb.php';
$db_file = $wp_content_dir . '/db.php';
if (file_exists($dbless_file) && !file_exists($db_file)) {
    copy($dbless_file, $db_file);
}

// Load Composer autoloader
require_once dirname(__DIR__) . '/vendor/autoload.php';

// Load WordBless
Load::load();

// Load plugin
require_once dirname(__DIR__) . '/petitioner.php';
