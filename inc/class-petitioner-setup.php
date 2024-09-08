<?php

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class Petition_Setup
{
    public function __construct()
    {
        // assets
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('wp_enqueue_scripts',  array($this, 'enqueue_frontend_assets'));

        add_filter('script_loader_tag', function ($tag, $handle) {
            if ('petitioner-script' === $handle || 'petitioner-admin-script' === $handle) {
                return str_replace('<script ', '<script type="module" ', $tag);
            }
            return $tag;
        }, 10, 2);

        // cpt
        add_action('init', array($this, 'register_post_types'));

        // shortcodes
        $this->register_shortcodes();

        // admin fields
        $petitioner_admin_ui = new Petitioner_Admin_UI();

        // api endpoints
        add_action('wp_ajax_petitioner_form_submit', array('Petitioner_Submissions', 'api_handle_form_submit'));
        add_action('wp_ajax_nopriv_petitioner_form_submit', array('Petitioner_Submissions', 'api_handle_form_submit'));
        add_action('wp_ajax_petitioner_fetch_submissions', array('Petitioner_Submissions', 'api_fetch_form_submissions'));
        
        add_action('admin_post_petitioner_export_csv', array('Petitioner_Submissions', 'api_petitioner_export_csv'));
    }
    /**
     * Plugin activation callback.
     */
    public static function plugin_activation()
    {
        add_option('petitioner_plugin_version', PTR_VERSION);
        Petitioner_Submissions::create_db_table();
    }

    /**
     * Plugin deactivation callback.
     */
    public static function plugin_deactivation()
    {
        flush_rewrite_rules();
    }

    /**
     * Plugin uninstall callback.
     */
    public static function plugin_uninstall()
    {
        delete_option('petitioner_plugin_version');
    }

    /**
     * Register custom post types for the plugin.
     */
    public function register_post_types()
    {
        register_post_type('petitioner-petition', array(
            'public'       => true,
            'label'        => __('Petitioner', 'petitioner-wp'),
            'supports'     => array('title'),
            'has_archive'  => true,
            'menu_icon'    => plugin_dir_url(dirname(__FILE__)) . 'assets/img/petitioner-glyph.svg'
            // 'menu_icon'    => 'dashicons-list-view'
        ));
    }

    /**
     * Enqueue plugin scripts and styles.
     */
    public function enqueue_frontend_assets()
    {
        wp_enqueue_style('petitioner-style', plugin_dir_url(dirname(__FILE__)) . 'dist/style.css', array(), PTR_VERSION);
        wp_enqueue_script('petitioner-script', plugin_dir_url(dirname(__FILE__)) . 'dist/main.js', array(), PTR_VERSION, true);
    }

    /**
     * Enqueue admin scripts and styles.
     */
    public function enqueue_admin_assets()
    {
        wp_enqueue_style('petitioner-admin-style', plugin_dir_url(dirname(__FILE__)) . 'dist/adminStyle.css', array(), PTR_VERSION);
        wp_enqueue_script('petitioner-admin-script', plugin_dir_url(dirname(__FILE__)) . 'dist/admin.js', array(), PTR_VERSION, true);
    }

    /**
     * Initialize shortcodes
     */
    public function register_shortcodes()
    {
        $frontend = new Petitioner_Frontend();

        add_shortcode('petitioner-form', [$frontend, 'display_form']);
    }
}
