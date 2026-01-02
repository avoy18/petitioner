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
// $plugin_src = realpath(dirname(__DIR__));
// $plugin_dest = $wp_content_dir . '/plugins/petitioner';

// if (is_dir($plugin_src) && !file_exists($plugin_dest)) {
//     // Try symlink first (faster, preferred)
//     $symlink_success = @symlink($plugin_src, $plugin_dest);

//     if (!$symlink_success) {
//         // Fallback: recursively copy the directory if symlink fails
//         // This handles CI environments where symlinks might not work
//         $copy_success = false;

//         if (is_dir($plugin_src)) {
//             $copy_success = true;
//             $iterator = new RecursiveIteratorIterator(
//                 new RecursiveDirectoryIterator($plugin_src, RecursiveDirectoryIterator::SKIP_DOTS),
//                 RecursiveIteratorIterator::SELF_FIRST
//             );

//             foreach ($iterator as $item) {
//                 $dest_path = $plugin_dest . DIRECTORY_SEPARATOR . str_replace($plugin_src . DIRECTORY_SEPARATOR, '', $item->getPathname());

//                 if ($item->isDir()) {
//                     if (!is_dir($dest_path)) {
//                         if (!mkdir($dest_path, 0755, true)) {
//                             $copy_success = false;
//                             break;
//                         }
//                     }
//                 } else {
//                     if (!copy($item, $dest_path)) {
//                         $copy_success = false;
//                         break;
//                     }
//                 }
//             }
//         }

//         if (!$copy_success) {
//             throw new RuntimeException(
//                 sprintf(
//                     'Failed to create plugin symlink or copy. Source: %s, Destination: %s',
//                     $plugin_src,
//                     $plugin_dest
//                 )
//             );
//         }
//     }
// }

// Load Composer autoloader
require_once dirname(__DIR__) . '/vendor/autoload.php';

// Load WordBless
Load::load();

// Load plugin
require_once dirname(__DIR__) . '/petitioner.php';
