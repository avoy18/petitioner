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
        add_action('wp_ajax_petitioner_change_status', array('AV_Petitioner_Submissions', 'api_change_submission_status'));

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
        $custom_css = $this->generate_custom_css();

        if (!empty($custom_css)) {
            wp_add_inline_style('petitioner-style', esc_html(wp_strip_all_tags($custom_css)));
        }

        wp_enqueue_script('petitioner-script', plugin_dir_url(dirname(__FILE__)) . 'dist/main.js', array(), AV_PETITIONER_PLUGIN_VERSION, true);

        // Captcha
        $is_recaptcha_enabled = get_option('petitioner_enable_recaptcha', false);
        $is_hcaptcha_enabled = get_option('petitioner_enable_hcaptcha', false);
        $recaptcha_site_key = get_option('petitioner_recaptcha_site_key');
        $hcaptcha_site_key = get_option('petitioner_hcaptcha_site_key');

        if ($is_recaptcha_enabled || $is_hcaptcha_enabled) {
            if ($is_recaptcha_enabled && !empty($recaptcha_site_key)) {
                wp_enqueue_script('petitioner-google-recaptcha-v3', 'https://www.google.com/recaptcha/api.js?render=' . esc_attr($recaptcha_site_key), [], null, true);
            }

            if ($is_hcaptcha_enabled && !empty($hcaptcha_site_key)) {
                wp_enqueue_script('hcaptcha', 'https://js.hcaptcha.com/1/api.js', [], null, true);
            }
        }

        wp_localize_script('petitioner-script', 'petitionerCaptcha', [
            'recaptchaSiteKey'  => $recaptcha_site_key,
            'hcaptchaSiteKey'   => $hcaptcha_site_key,
            'enableRecaptcha'   => $is_recaptcha_enabled,
            'enableHcaptcha'    => $is_hcaptcha_enabled,
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
        if ($screen && $screen->base === 'post' && $screen->post_type === 'petitioner-petition') {
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
