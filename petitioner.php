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

require_once PTR_PLUGIN_DIR . 'inc/class-petitioner-frontend.php';
require_once PTR_PLUGIN_DIR . 'inc/class-petitioner-admin-ui.php';
require_once PTR_PLUGIN_DIR . 'inc/class-petitioner-submissions.php';
require_once PTR_PLUGIN_DIR . 'inc/class-petitioner-setup.php';

$petitioner_setup = new Petition_Setup();

register_activation_hook(__FILE__, array('Petition_Setup', 'plugin_activation'));
register_deactivation_hook(__FILE__, array('Petition_Setup', 'plugin_deactivation'));
register_uninstall_hook(__FILE__, array('Petition_Setup', 'plugin_uninstall'));

