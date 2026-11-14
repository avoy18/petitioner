<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Admin screen for contact forms
 *
 * @since 0.9.0
 */
class AV_Petitioner_Admin_Contact_Forms_UI
{
    public function __construct()
    {
        add_action('admin_menu', [$this, 'add_contact_forms_submenu']);
    }

    public function add_contact_forms_submenu()
    {
        add_submenu_page(
            'edit.php?post_type=petitioner-petition',
            esc_html__('Contact Forms', 'petitioner'),
            esc_html__('Contact Forms', 'petitioner'),
            'manage_options',
            'petitioner-contact-forms',
            [$this, 'render_contact_forms_page']
        );
    }

    public function render_contact_forms_page()
    {
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Contact Forms', 'petitioner'); ?></h1>
            <div id="petitioner-contact-forms-admin"></div>
        </div>
        <?php
    }
}
