<?php

/**
 * Bootstrap file for PHPUnit tests
 */

use WorDBless\Load;

// Define ABSPATH if not already defined
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/../wordpress/');
}

// Load Composer autoloader
require_once dirname(__DIR__) . '/vendor/autoload.php';

// Load WordBless
Load::load();

// Load plugin
require_once dirname(__DIR__) . '/petitioner.php';

// WorDBless fires `init` before the plugin loads, so post types (and their feature supports) need registering here
$petitioner_setup->register_post_types();
