<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * @since 0.1.2
 */
class AV_Petitioner_Admin_Settings_UI
{
    public $default_colors;

    private const OPTION_FIELDS = [
        'show_letter'               => 'petitioner_show_letter',
        'show_title'                => 'petitioner_show_title',
        'show_goal'                 => 'petitioner_show_goal',
        'custom_css'                => 'petitioner_custom_css',
        'primary_color'             => 'petitioner_primary_color',
        'dark_color'                => 'petitioner_dark_color',
        'grey_color'                => 'petitioner_grey_color',
        'enable_recaptcha'          => 'petitioner_enable_recaptcha',
        'recaptcha_site_key'        => 'petitioner_recaptcha_site_key',
        'recaptcha_secret_key'      => 'petitioner_recaptcha_secret_key',
        'enable_hcaptcha'           => 'petitioner_enable_hcaptcha',
        'hcaptcha_site_key'         => 'petitioner_hcaptcha_site_key',
        'hcaptcha_secret_key'       => 'petitioner_hcaptcha_secret_key',
        'enable_turnstile'          => 'petitioner_enable_turnstile',
        'turnstile_site_key'        => 'petitioner_turnstile_site_key',
        'turnstile_secret_key'      => 'petitioner_turnstile_secret_key',
    ];

    function __construct()
    {

        $this->default_colors = array(
            'primary'   => '#e01a2b',
            'dark'      => '#000000',
            'grey'      => '#efefef'
        );

        add_action('admin_menu', array($this, 'add_settings_submenu'));
        add_action('admin_init', function () {
            if (!empty($_POST)) {
                $this->save_meta_box_data();
            }
        });

        add_action('admin_head', function () {
            $screen = get_current_screen();
            if ($screen->id === 'petitioner-petition_page_petition-settings') {
?>
                <script type="text/javascript">
                    jQuery(document).ready(function($) {
                        $('.petitioner-color-field').wpColorPicker();
                    });
                </script>
        <?php
            }
        });


        add_action('admin_enqueue_scripts', function ($hook_suffix) {
            if ($hook_suffix === 'petitioner-petition_page_petition-settings') {
                wp_enqueue_code_editor(array('type' => 'text/css'));
                wp_enqueue_script('wp-theme-plugin-editor');
                wp_enqueue_style('wp-codemirror');
                wp_add_inline_script('wp-theme-plugin-editor', "jQuery(document).ready(function($) {
                    wp.codeEditor.initialize($('#petitionerCode'), {type: 'text/css'});
                });", true);

                wp_enqueue_style('wp-color-picker');
                wp_enqueue_script('wp-color-picker');
            }
        });
    }

    public function get_option_fields()
    {
        $option_values = [];
        foreach (self::OPTION_FIELDS as $key => $meta_key) {
            $option_values[$key] = get_option($meta_key, null);
        }
        return $option_values;
    }

    public function add_settings_submenu()
    {
        add_submenu_page(
            'edit.php?post_type=petitioner-petition',
            esc_html__('Petition Settings', 'petitioner'),
            esc_html__('Settings', 'petitioner'),
            'manage_options',
            'petition-settings',
            array($this, 'render_petition_settings_page')
        );
    }

    public function render_petition_settings_page()
    {
        ?>
        <div class="wrap">
            <h1><?php esc_html_e('Petitioner Settings', 'petitioner'); ?></h1>

            <form method="post" action="<?php echo esc_url(admin_url('edit.php?post_type=petitioner-petition&page=petition-settings')); ?>">
                <?php
                $this->render_form_fields();
                submit_button();
                ?>
            </form>
        </div>
    <?php
    }

    /**
     * Render form fields inside the meta box.
     */
    public function render_form_fields()
    {
        wp_nonce_field("save_petition_settings", "petitioner_settings_nonce");
        // Retrieve current meta values
        $option_values     = $this->get_option_fields();
        // Sanitize values for safe use in HTML attributes
        $petitioner_info = [
            'show_letter'               => (bool) $option_values['show_letter'],
            'show_title'                => (bool) $option_values['show_title'],
            'show_goal'                 => (bool) $option_values['show_goal'],
            'custom_css'                => esc_textarea($option_values['custom_css']),
            'primary_color'             => esc_attr($option_values['primary_color']),
            'dark_color'                => esc_attr($option_values['dark_color']),
            'grey_color'                => esc_attr($option_values['grey_color']),
            'enable_recaptcha'          => (bool) $option_values['enable_recaptcha'],
            'recaptcha_site_key'        => sanitize_text_field($option_values['recaptcha_site_key']),
            'recaptcha_secret_key'      => sanitize_text_field($option_values['recaptcha_secret_key']),
            'enable_hcaptcha'           => (bool) $option_values['enable_hcaptcha'],
            'hcaptcha_site_key'         => sanitize_text_field($option_values['hcaptcha_site_key']),
            'hcaptcha_secret_key'       => sanitize_text_field($option_values['hcaptcha_secret_key']),
            'enable_turnstile'          => (bool) $option_values['enable_turnstile'],
            'turnstile_site_key'        => sanitize_text_field($option_values['turnstile_site_key']),
            'turnstile_secret_key'      => sanitize_text_field($option_values['turnstile_secret_key']),
            "default_values"                => [
                "colors"              => $this->default_colors,
            ]
        ];

        $data_attributes = wp_json_encode($petitioner_info, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    ?>
        <div class="petitioner-admin__form ptr-is-loading">
            <script id="petitioner-json-data" type="text/json">
                <?php echo $data_attributes; ?>
            </script>
            <div id="petitioner-settings-admin-form"></div>
        </div>
<?php
    }

    /**
     * Save Meta Box Data
     */
    public function save_meta_box_data()
    {
        if (
            !isset($_POST["petitioner_settings_nonce"]) ||
            !wp_verify_nonce($_POST["petitioner_settings_nonce"], "save_petition_settings") ||
            (defined("DOING_AUTOSAVE") && DOING_AUTOSAVE) ||
            !current_user_can("manage_options")
        ) {
            return;
        }

        // Process meta fields
        $meta_values = [];
        foreach (self::OPTION_FIELDS as $key => $meta_key) {
            $meta_values[$key] = isset($_POST["petitioner_$key"])
                ? wp_unslash($_POST["petitioner_$key"])
                : '';
        }

        // Sanitize and update meta fields
        $this->update_meta_fields($meta_values);
    }

    /**
     * Update meta fields in bulk.
     */
    private function update_meta_fields($meta_values)
    {
        $checkboxes = [
            'show_letter',
            'show_title',
            'show_goal',
            'enable_recaptcha',
            'enable_hcaptcha',
            'enable_turnstile',
        ];

        foreach ($meta_values as $key => $value) {
            if (in_array($key, $checkboxes)) {
                $value = $value === "on" ? 1 : 0; // Convert checkboxes to 1/0
            } else if ($key === 'custom_css') {
                $value = wp_strip_all_tags($value);
            } else {
                $value = sanitize_text_field($value);
            }

            update_option(self::OPTION_FIELDS[$key], $value);
        }
    }
}
