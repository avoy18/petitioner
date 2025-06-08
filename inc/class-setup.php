<?php

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class AV_Petitioner_Setup
{
    public function __construct()
    {
        // db schema
        add_action('plugins_loaded', [$this, 'on_plugins_loaded']);
        // assets
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_action('wp_enqueue_scripts',  array($this, 'enqueue_frontend_assets'));

        add_filter('wp_script_attributes', function ($attributes) {
            if ('petitioner-script-js' === $attributes['id'] || 'petitioner-admin-script-js' === $attributes['id'] || 'petitioner-form-block-js' === $attributes['id']) {
                $attributes['type'] = 'module';
            }

            return $attributes;
        });

        add_action('init', function () {
            // cpt
            $this->register_post_types();
            // edit admin fields
            new AV_Petitioner_Admin_Edit_UI();
            // // shortcodes
            new AV_Petitioner_Shortcodes();
            // // settings admin fields
            new AV_Petitioner_Admin_Settings_UI();
        });

        // api endpoints
        add_action('wp_ajax_petitioner_form_submit', array('AV_Petitioner_Submissions_Controller', 'api_handle_form_submit'));
        add_action('wp_ajax_nopriv_petitioner_form_submit', array('AV_Petitioner_Submissions_Controller', 'api_handle_form_submit'));
        add_action('wp_ajax_petitioner_fetch_submissions', array('AV_Petitioner_Submissions_Controller', 'api_fetch_form_submissions'));
        add_action('wp_ajax_petitioner_change_status', array('AV_Petitioner_Submissions_Controller', 'api_change_submission_status'));
        add_action('wp_ajax_petitioner_resend_confirmation_email', ['AV_Petitioner_Submissions_Controller', 'api_resend_confirmation_email']);
        add_action('wp_ajax_petitioner_resend_all_confirmation_emails', ['AV_Petitioner_Submissions_Controller', 'api_resend_all_confirmation_emails']);
        add_action('wp_ajax_petitioner_check_unconfirmed_count', ['AV_Petitioner_Submissions_Controller', 'api_check_unconfirmed_count']);

        add_action('admin_post_petitioner_export_csv', array('AV_Petitioner_Submissions_Controller', 'admin_petitioner_export_csv'));

        // gutenberg
        add_action('init', array($this, 'register_petition_form_block'));
    }
    /**
     * Plugin activation callback.
     */
    public static function plugin_activation()
    {
        add_option('petitioner_plugin_version', AV_PETITIONER_PLUGIN_VERSION);
        AV_Petitioner_Submissions_Model::create_db_table();

        AV_Petitioner_Form_Migrator::migrate_all_forms_to_builder();
    }

    /**
     * Check if the plugin is updated and perform necessary actions.
     */
    public function on_plugins_loaded()
    {
        // Load plugin text domain for translations
        load_plugin_textdomain(
            'petitioner',
            false,
            basename(dirname(__DIR__)) . '/languages/'
        );

        // Check if the plugin is updated
        $current_version = get_option('petitioner_plugin_version', AV_PETITIONER_PLUGIN_VERSION);

        if (empty($current_version)) {
            // Fresh install setup
            // Update the database schema or perform any other necessary updates
            AV_Petitioner_Submissions_Model::create_db_table();
            update_option('petitioner_plugin_version', AV_PETITIONER_PLUGIN_VERSION);
        } else if (version_compare($current_version, AV_PETITIONER_PLUGIN_VERSION, '<')) {
            // Update the database schema or perform any other necessary updates
            AV_Petitioner_Submissions_Model::create_db_table();
            update_option('petitioner_plugin_version', AV_PETITIONER_PLUGIN_VERSION);
        }
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
        $custom_css = $this->generate_custom_css();

        if (!empty($custom_css)) {
            wp_add_inline_style('petitioner-style', esc_html(wp_strip_all_tags($custom_css)));
        }

        wp_enqueue_script('petitioner-script', plugin_dir_url(dirname(__FILE__)) . 'dist/main.js', array(), AV_PETITIONER_PLUGIN_VERSION, true);

        AV_Petitioner_Captcha::enqueue_scripts();

        wp_localize_script('petitioner-script', 'petitionerFormSettings', [
            'actionPath'    => admin_url('admin-ajax.php') . '?action=petitioner_form_submit',
            'nonce'         => wp_create_nonce('petitioner_form_nonce'),
        ]);
    }

    public function generate_custom_css()
    {
        $custom_css = '';
        $primary_color = get_option('petitioner_primary_color', '');
        $dark_color = get_option('petitioner_dark_color', '');
        $grey_color = get_option('petitioner_grey_color', '');

        $default_colors = '';

        if (!empty($primary_color)) {
            $default_colors .= '--ptr-color-primary: ' . $primary_color . '!important;';
        }

        if (!empty($dark_color)) {
            $default_colors .= '--ptr-color-dark: ' . $dark_color . '!important;';
        }

        if (!empty($grey_color)) {
            $default_colors .= '--ptr-color-grey: ' . $grey_color . '!important;';
        }

        if (!empty($default_colors)) {
            $custom_css .= '.petitioner {' . $default_colors . ' } ';
        }

        $custom_css .= get_option('petitioner_custom_css', '');

        return $custom_css;
    }

    /**
     * Enqueue admin scripts and styles.
     */
    public function enqueue_admin_assets()
    {
        $screen = get_current_screen();

        // Check if on the edit or add new page for 'petitioner_petition' post type
        if ($screen->post_type === 'petitioner-petition') {
            // Enqueue scripts
            wp_enqueue_script('wp-blocks');
            wp_enqueue_script('wp-block-editor');
            wp_enqueue_script('wp-element');
            wp_enqueue_script('wp-components');
            wp_enqueue_script('wp-tinymce');

            // Enqueue styles
            wp_enqueue_style('wp-components');
        }

        wp_enqueue_style('petitioner-admin-style', plugin_dir_url(dirname(__FILE__)) . 'dist/admin.css', array(), AV_PETITIONER_PLUGIN_VERSION);
        wp_enqueue_script('petitioner-admin-script', plugin_dir_url(dirname(__FILE__)) . 'dist/admin.js', array('wp-blocks', 'wp-block-editor', 'wp-element', 'wp-components'), AV_PETITIONER_PLUGIN_VERSION, true);
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
