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

    /**
     * Get the schema for the settings
     * 
     * @since 0.8.2
     * @return array
     */
    public static function get_settings_schema()
    {
        $schema = require plugin_dir_path(__FILE__) . 'admin-settings-schema.php';

        /**
         * Filter to allow Pro Addons to inject settings into the registry
         */
        return apply_filters('av_petitioner_settings_schema', $schema);
    }

    /**
     * Read from the schema util and convert the fields into the correct format
     * for the meta boxes
     * 
     * @return array
     * 
     * @since 0.8.2
     */
    public function get_option_fields()
    {
        $schema = self::get_settings_schema();
        $option_values = [];

        foreach ($schema as $key => $config) {
            $option_values[$key] = get_option($config['meta_key'], null);
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

        $option_values   = $this->get_option_fields();
        $schema          = self::get_settings_schema();
        $petitioner_info = [];

        foreach ($schema as $key => $config) {
            $type = $config['type'];

            if ($type === 'checkbox') {
                $petitioner_info[$key] = (bool) $option_values[$key];
            } else if ($type === 'json') {
                $decoded = !empty($option_values[$key]) ? json_decode($option_values[$key], true) : null;
                $petitioner_info[$key] = is_array($decoded) ? $decoded : [];
            } else {
                $petitioner_info[$key] = $option_values[$key];
            }
        }

        $petitioner_info['default_values'] = [
            "colors" => $this->default_colors,
            "labels" => $this->get_default_labels()
        ];

        /**
         * Filter to modify petitioner data that is sent to the edit screen
         * 
         *
         * @param $petitioner_info Array of the data
         * @return array Modified $petitioner_info data.
         */
        $petitioner_info = apply_filters('av_petitioner_info_settings', $petitioner_info);

        $data_attributes = wp_json_encode($petitioner_info, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
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

        $schema = self::get_settings_schema();
        $meta_values = [];

        foreach ($schema as $key => $config) {
            $meta_values[$key] = isset($_POST["petitioner_$key"])
                ? wp_unslash($_POST["petitioner_$key"])
                : '';
        }

        $this->update_meta_fields($meta_values);
    }

    /**
     * Update meta fields in bulk.
     */
    private function update_meta_fields($meta_values)
    {
        $schema = self::get_settings_schema();

        foreach ($meta_values as $key => $value) {
            if (!isset($schema[$key]) || empty($schema[$key]['meta_key'])) {
                continue;
            }

            $type = $schema[$key]['type'] ?? 'text';

            if ($type === 'checkbox') {
                $value = $value === "on" ? 1 : 0;
            } else if ($type === 'json') {
                $value = $this->sanitize_array($value);
            } else if ($type === 'textarea') {
                $value = sanitize_textarea_field($value);
            } else {
                $value = sanitize_text_field($value);
            }

            update_option($schema[$key]['meta_key'], $value);
        }
    }


    public function sanitize_array(string|array $json_items_raw, bool $stringify = true): string|array
    {
        if (is_array($json_items_raw)) {
            $array_items = $json_items_raw;
        } else {
            $array_items = json_decode($json_items_raw, true);

            if (json_last_error() !== JSON_ERROR_NONE || !is_array($array_items)) {
                av_ptr_error_log('Invalid JSON input');
                return $stringify ? '{}' : [];
            }
        }

        $sanitized = [];

        foreach ($array_items as $key => $val) {
            $sanitized[$key] = sanitize_text_field((string) $val);
        }

        return $stringify
            ? wp_json_encode($sanitized, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
            : $sanitized;
    }

    public function get_default_labels()
    {
        $do_not_include = [
            'ty_email_subject',
            'ty_email',
            'ty_email_subject_confirm',
            'ty_email_confirm',
            'from_field',
            'id',
        ];

        // filter out the unwanted labels
        $default_labels = array_filter(AV_Petitioner_Labels::get_all_with_fields(), function ($v, $k) use ($do_not_include) {
            return !in_array($k, $do_not_include);
        }, ARRAY_FILTER_USE_BOTH);

        return $default_labels;
    }
}
