<?php

/**
 * Plugin Name:       Petitioner
 * Description:       A WordPress plugin for collecting petitions.
 * Requires at least: 5.9
 * Requires PHP:      8.0
 * Version:           0.2.6
 * Author:            Anton Voytenko
 * License:           GPLv2 or later
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       petitioner
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

define('AV_PETITIONER_PLUGIN_DIR', plugin_dir_path(__FILE__));

define('AV_PETITIONER_PLUGIN_VERSION', '0.2.6');

require_once AV_PETITIONER_PLUGIN_DIR . 'inc/submissions/class-submissions-model.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/submissions/class-submissions-controller.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/class-email-confirmations.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/class-mailer.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/class-frontend.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/admin-ui/class-admin-edit-ui.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/admin-ui/class-admin-settings-ui.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/class-setup.php';

$petitioner_setup = new AV_Petitioner_Setup();
new AV_Email_Confirmations();

register_activation_hook(__FILE__, array('AV_Petitioner_Setup', 'plugin_activation'));
register_deactivation_hook(__FILE__, array('AV_Petitioner_Setup', 'plugin_deactivation'));
register_uninstall_hook(__FILE__, array('AV_Petitioner_Setup', 'plugin_uninstall'));
