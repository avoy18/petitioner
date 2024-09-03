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
            if ('petitioner-script' === $handle) {
                return str_replace('<script ', '<script type="module" ', $tag);
            }
            return $tag;
        }, 10, 2);

        // config hooks
        register_activation_hook(__FILE__, array($this, 'plugin_activation'));
        register_deactivation_hook(__FILE__, array($this, 'plugin_deactivate'));
        register_uninstall_hook(__FILE__, array($this, 'plugin_uninstall'));

        // cpt
        add_action('init', array($this, 'register_post_types'));

        // shortcodes
        $this->register_shortcodes();
    }

    /**
     * Plugin activation callback.
     */
    public function plugin_activation()
    {
        add_option('petitioner_plugin_version', PTR_VERSION);
    }

    /**
     * Plugin deactivation callback.
     */
    public function plugin_deactivate()
    {
        flush_rewrite_rules();
    }

    /**
     * Plugin uninstall callback.
     */
    public function plugin_uninstall()
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
            'label'        => __('Petitioner Petitions', 'petitioner-wp'),
            'supports'     => array('title'),
            'has_archive'  => true,
        ));

        register_post_type('petitioner-entries', array(
            'public'       => true,
            'label'        => __('Petitioner submissions', 'petitioner-wp'),
            'supports'     => array('title'),
            'has_archive'  => true,
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
        wp_enqueue_style('petitioner-admin-style', plugin_dir_url(dirname(__FILE__)) . '/dist/adminStyle.css', array(), PTR_VERSION);
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
