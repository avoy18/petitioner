<?php

/**
 * Plugin Name:       Petitioner
 * Description:       A WordPress plugin for collecting petitions.
 * Requires at least: 5.9
 * Requires PHP:      8.0
 * Version:           0.1.2
 * Author:            Anton Voytenko
 * License:           GPLv2 or later
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       petitioner
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

define('PTR_PLUGIN_DIR', plugin_dir_path(__FILE__));

define('PTR_ASSET_VERSION', '0.1.2');

require_once PTR_PLUGIN_DIR . 'inc/class-mailer.php';
require_once PTR_PLUGIN_DIR . 'inc/class-frontend.php';
require_once PTR_PLUGIN_DIR . 'inc/class-admin-edit-ui.php';
require_once PTR_PLUGIN_DIR . 'inc/class-submissions.php';
require_once PTR_PLUGIN_DIR . 'inc/class-setup.php';

$petitioner_setup = new Petition_Setup();

register_activation_hook(__FILE__, array('Petition_Setup', 'plugin_activation'));
register_deactivation_hook(__FILE__, array('Petition_Setup', 'plugin_deactivation'));
register_uninstall_hook(__FILE__, array('Petition_Setup', 'plugin_uninstall'));
