<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * @since 0.1.2
 */
class Petitioner_Admin_Settings_UI
{
    function __construct()
    {
        add_action('admin_menu', array($this, 'add_settings_submenu'));
    }

    /**
     * @since 0.1.2
     */
    public function add_settings_submenu()
    {
        add_submenu_page(
            'edit.php?post_type=petitioner-petition',
            __('Petition Settings', 'petitioner-petition'),
            __('Settings', 'petitioner-petition'),
            'manage_options',
            'petition-settings',
            array($this, 'render_petition_settings_page')
        );
    }

    /**
     * @since 0.1.2
     */
    public function render_petition_settings_page()
    {
?>
        <div class="wrap">
            <h1><?php _e('Petitioner Settings', 'petitioner-pro'); ?></h1>

            <form method="post" action="options.php">
                <?php
                settings_fields('petition_settings_group');
                do_settings_sections('petition-settings');
                submit_button();
                ?>
            </form>
        </div>
<?php
    }
}
