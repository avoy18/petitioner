<?php

if (!defined("ABSPATH")) {
    exit(); // Exit if accessed directly
}

class AV_Petitioner_Admin_Component_Preview_UI
{
    public function __construct()
    {
        $show_dev_tools = defined('PETITIONER_SHOW_DEV_TOOLS') && PETITIONER_SHOW_DEV_TOOLS === true;

        if (!$show_dev_tools) {
            return;
        }

        add_action('admin_menu', [$this, 'add_component_preview_menu']);
    }

    public function add_component_preview_menu()
    {

        add_submenu_page(
            'edit.php?post_type=petitioner-petition',
            '<span class="dashicons dashicons-visibility"></span> Components',
            '<span class="dashicons dashicons-visibility"></span> Components',
            'manage_options',
            'petitioner-component-preview',
            [$this, 'render_component_preview_page']
        );
    }

    public function render_component_preview_page()
    {
        echo '<div id="petitioner-component-preview"></div>';
    }
}
