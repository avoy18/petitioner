<?php

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class AV_Petitioner_Setup
{
    public function __construct()
    {
        // assets
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('wp_enqueue_scripts',  array($this, 'enqueue_frontend_assets'));

        add_filter('wp_script_attributes', function ($attributes) {
            if ('petitioner-script-js' === $attributes['id'] || 'petitioner-admin-script-js' === $attributes['id'] || 'petitioner-form-block-js' === $attributes['id']) {
                $attributes['type'] = 'module';
            }

            return $attributes;
        });

        // cpt
        add_action('init', array($this, 'register_post_types'));

        // shortcodes
        $this->register_shortcodes();

        // edit admin fields
        new AV_Petitioner_Admin_Edit_UI();
        // settings admin fields
        new AV_Petitioner_Admin_Settings_UI();

        // api endpoints
        add_action('wp_ajax_petitioner_form_submit', array('AV_Petitioner_Submissions', 'api_handle_form_submit'));
        add_action('wp_ajax_nopriv_petitioner_form_submit', array('AV_Petitioner_Submissions', 'api_handle_form_submit'));
        add_action('wp_ajax_petitioner_fetch_submissions', array('AV_Petitioner_Submissions', 'api_fetch_form_submissions'));

        add_action('admin_post_petitioner_export_csv', array('AV_Petitioner_Submissions', 'api_petitioner_export_csv'));

        // gutenberg
        add_action('init', array($this, 'register_petition_form_block'));
    }
    /**
     * Plugin activation callback.
     */
    public static function plugin_activation()
    {
        add_option('petitioner_plugin_version', AV_PETITIONER_PLUGIN_VERSION);
        AV_Petitioner_Submissions::create_db_table();
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
        $labels = array(
            'name'               => _x('Petitions', 'post type general name', 'petitioner'),
            'singular_name'      => _x('Petition', 'post type singular name', 'petitioner'),
            'menu_name'          => _x('Petitioner', 'admin menu', 'petitioner'),
            'name_admin_bar'     => _x('Petition', 'add new on admin bar', 'petitioner'),
            'add_new'            => _x('Add New', 'petition', 'petitioner'),
            'add_new_item'       => __('Add New Petition', 'petitioner'),
            'new_item'           => __('New Petition', 'petitioner'),
            'edit_item'          => __('Edit Petition', 'petitioner'),
            'view_item'          => __('View Petition', 'petitioner'),
            'all_items'          => __('All Petitions', 'petitioner'),
            'search_items'       => __('Search Petitions', 'petitioner'),
            'not_found'          => __('No petitions found.', 'petitioner'),
            'not_found_in_trash' => __('No petitions found in Trash.', 'petitioner')
        );

        register_post_type('petitioner-petition', array(
            'public'                => true,
            'labels'                => $labels,
            'supports'              => array('title'),
            'has_archive'           => false,
            'show_in_menu'          => true,
            'show_in_rest'          => true,
            'exclude_from_search'   => true,
            'hierarchical'          => false,
            'publicly_queryable'    => false,
            'menu_icon'             => plugin_dir_url(dirname(__FILE__)) . 'assets/petitioner-glyph.svg'
        ));
    }

    /**
     * Enqueue plugin scripts and styles.
     */
    public function enqueue_frontend_assets()
    {
        if (is_admin()) return;

        wp_enqueue_style('petitioner-style', plugin_dir_url(dirname(__FILE__)) . 'dist/main.css', array(), AV_PETITIONER_PLUGIN_VERSION);
        
        // Custom CSS styles
        $custom_css = get_option('petitioner_custom_css', '');

        if (!empty($custom_css)) {
            wp_add_inline_style('petitioner-style', esc_html(wp_strip_all_tags($custom_css)));
        }

        wp_enqueue_script('petitioner-script', plugin_dir_url(dirname(__FILE__)) . 'dist/main.js', array(), AV_PETITIONER_PLUGIN_VERSION, true);
    }

    /**
     * Enqueue admin scripts and styles.
     */
    public function enqueue_admin_assets()
    {
        wp_enqueue_style('petitioner-admin-style', plugin_dir_url(dirname(__FILE__)) . 'dist/admin.css', array(), AV_PETITIONER_PLUGIN_VERSION);
        wp_enqueue_script('petitioner-admin-script', plugin_dir_url(dirname(__FILE__)) . 'dist/admin.js', array(), AV_PETITIONER_PLUGIN_VERSION, true);
    }

    /**
     * Initialize shortcodes
     */
    public function register_shortcodes()
    {
        $frontend = new AV_Petitioner_Frontend();

        add_shortcode('petitioner-form', [$frontend, 'display_form']);
    }

    public function register_petition_form_block()
    {
        wp_register_script(
            'petitioner-form-block',
            plugin_dir_url(dirname(__FILE__)) . 'dist-gutenberg/petitionerFormBlock.js',
            array('wp-blocks', 'wp-element', 'wp-editor', 'wp-i18n'),
            AV_PETITIONER_PLUGIN_VERSION,
            array()
        );

        wp_register_style(
            'petitioner-form-style',
            plugin_dir_url(dirname(__FILE__)) . 'dist/main.css',
            array(),
            AV_PETITIONER_PLUGIN_VERSION
        );

        register_block_type('petitioner/form', array(
            'editor_script'     => 'petitioner-form-block',
            'editor_style'      => 'petitioner-form-style',
            'attributes' => array(
                'formId' => array(
                    'type'        => 'string',
                    'default'     => null
                ),
                'newPetitionLink' => array(
                    'type'      => 'text',
                    'default'   => admin_url('post-new.php?post_type=petitioner-petition')
                ),
            ),
            'render_callback'   => function ($attributes) {
                if (empty($attributes['formId'])) return;

                $form_id = $attributes['formId'];

                return do_shortcode('[petitioner-form id="' . esc_attr($form_id) . '"]');
            }
        ));
    }
}
