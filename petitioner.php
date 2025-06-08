<?php

/**
 * Plugin Name:       Petitioner
 * Description:       A WordPress plugin for collecting petitions.
 * Requires at least: 5.9
 * Requires PHP:      8.0
 * Version:           0.4.1
 * Author:            Anton Voytenko
 * License:           GPLv2 or later
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       petitioner
 * Domain Path:       /languages
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

define('AV_PETITIONER_PLUGIN_DIR', plugin_dir_path(__FILE__));

define('AV_PETITIONER_PLUGIN_VERSION', '0.4.1');

if (!function_exists('av_ptr_error_log')) {

    function av_ptr_error_log($data)
    {
        if (defined('WP_DEBUG') && WP_DEBUG === true && defined('PETITIONER_DEBUG') && PETITIONER_DEBUG === true) {
            $caller = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2)[1]['function'] ?? 'global';

            error_log(wp_json_encode([
                'data'      => $data,
                'caller'    => $caller
            ], JSON_PRETTY_PRINT));
        }
    }
}

require_once AV_PETITIONER_PLUGIN_DIR . 'inc/submissions/class-submissions-model.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/submissions/class-submissions-controller.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/integrations/class-captcha.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/integrations/class-akismet.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/integrations/class-form-migrator.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/emails/class-email-controller.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/emails/class-email-confirmations.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/emails/class-email-template.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/emails/class-mailer.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/frontend/class-frontend-ui.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/frontend/class-form-ui.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/frontend/class-shortcodes.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/admin-ui/class-admin-edit-ui.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/admin-ui/class-admin-settings-ui.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/class-setup.php';
require_once AV_PETITIONER_PLUGIN_DIR . 'inc/utilities.php';

$petitioner_setup = new AV_Petitioner_Setup();
new AV_Email_Confirmations();

register_activation_hook(__FILE__, array('AV_Petitioner_Setup', 'plugin_activation'));
register_deactivation_hook(__FILE__, array('AV_Petitioner_Setup', 'plugin_deactivation'));
register_uninstall_hook(__FILE__, array('AV_Petitioner_Setup', 'plugin_uninstall'));
AV_Petitioner_Form_Migrator::migrate_form_fields_to_builder_filters();
