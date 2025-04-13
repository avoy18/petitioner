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

    private const META_FIELDS = [
    ];

    function __construct()
    {

        $this->default_colors = array(
            'primary'   => '#e01a2b',
            'dark'      => '#000000',
            'grey'      => '#efefef'
        );

        add_action('admin_menu', array($this, 'add_settings_submenu'));
        add_action('admin_init', array($this, 'admin_settings_init'));

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

            <form method="post" action="options.php">
                <?php
                settings_fields('petitioner_settings_group');
                do_settings_sections('petition-settings');
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }

    public function admin_settings_init()
    {

        add_settings_section(
            'petitioner_settings_section_general',
            esc_html__('', 'petitioner'),
            function () {

                $petitioner_info = [];
        ?>
            <div
                id="petitioner-settings-container"
                data-av-ptr-info='<?php echo wp_json_encode(
                                        $petitioner_info
                                    ); ?>'>
            </div>
        <?php
            },
            'petition-settings'
        );

        add_settings_section(
            'petitioner_settings_section',
            esc_html__('Visual Customizer', 'petitioner'),
            array($this, 'petition_settings_section_callback'),
            'petition-settings'
        );

        add_settings_section(
            'petitioner_recaptcha_section',
            esc_html__('Google reCAPTCHA v3', 'petitioner'),
            function () {
                echo '<p>' . esc_html__('Configure Google reCAPTCHA', 'petitioner') . '</p>';
                if (get_option('petitioner_enable_recaptcha', true) && get_option('petitioner_enable_hcaptcha', true)) {
                    echo '<p style="color:red;">' . esc_html__('Warning! Running both hCaptcha and reCAPTCHA will break the form!', 'petitioner') . '</p>';
                }
            },
            'petition-settings'
        );

        add_settings_section(
            'petitioner_hcaptcha_section',
            esc_html__('hCaptcha', 'petitioner'),
            function () {
                echo '<p>' . esc_html__('Configure hCaptcha', 'petitioner') . '</p>';
                if (get_option('petitioner_enable_recaptcha', true) && get_option('petitioner_enable_hcaptcha', true)) {
                    echo '<p style="color:red;">' . esc_html__('Warning! Running both hCaptcha and reCAPTCHA will break the form!', 'petitioner') . '</p>';
                }
            },
            'petition-settings'
        );

        $this->add_checkbox_field(array(
            'slug'          => 'petitioner_show_letter',
            'display_name'  => esc_html__('Show letter popup', 'petitioner'),
            'helptext'      => esc_html__('Enable letter popup on petitions', 'petitioner'),
            'default_value' => 1
        ));

        $this->add_checkbox_field(array(
            'slug'          => 'petitioner_show_title',
            'display_name'  => esc_html__('Show title', 'petitioner'),
            'helptext'      => esc_html__('Enable titles on petitions', 'petitioner'),
            'default_value' => 1
        ));

        $this->add_checkbox_field(array(
            'slug'          => 'petitioner_show_goal',
            'display_name'  => esc_html__('Show goal', 'petitioner'),
            'helptext'      => esc_html__('Enable goals on petitions', 'petitioner'),
            'default_value' => 1
        ));

        $this->add_code_field(array(
            'slug'          => 'petitioner_custom_css',
            'display_name'  => esc_html__('Custom CSS', 'petitioner'),
            'helptext'      => esc_html__('Use this field to override CSS of petitioner', 'petitioner'),
            'default_value' => 1
        ));

        $this->add_color_field(array(
            'slug'          => 'petitioner_primary_color',
            'display_name'  => esc_html__('Primary color', 'petitioner'),
            'helptext'      => esc_html__('Red', 'petitioner'),
            'default_value' => $this->default_colors['primary']
        ));

        $this->add_color_field(array(
            'slug'          => 'petitioner_dark_color',
            'display_name'  => esc_html__('Dark color', 'petitioner'),
            'helptext'      => esc_html__('Dark color', 'petitioner'),
            'default_value' => $this->default_colors['dark']
        ));

        $this->add_color_field(array(
            'slug'          => 'petitioner_grey_color',
            'display_name'  => esc_html__('Grey color', 'petitioner'),
            'helptext'      => esc_html__('Grey color', 'petitioner'),
            'default_value' => $this->default_colors['grey']
        ));

        $this->add_checkbox_field(array(
            'slug'          => 'petitioner_enable_recaptcha',
            'display_name'  => esc_html__('Enabled?', 'petitioner'),
            'helptext'      => esc_html__('Enable reCAPTCHA petitions for spam protection', 'petitioner'),
            'default_value' => 0,
            'section'       => 'petitioner_recaptcha_section'
        ));

        $this->add_text_field(array(
            'slug'          => 'petitioner_recaptcha_site_key',
            'display_name'  => esc_html__('Site key', 'petitioner'),
            'helptext'      => esc_html__('Add your site key here', 'petitioner'),
            'default_value' => '',
            'section'       => 'petitioner_recaptcha_section'
        ));

        $this->add_text_field(array(
            'slug'          => 'petitioner_recaptcha_secret_key',
            'display_name'  => esc_html__('Secret key', 'petitioner'),
            'helptext'      => esc_html__('Add your secret key here', 'petitioner'),
            'default_value' => '',
            'section'       => 'petitioner_recaptcha_section'
        ));

        $this->add_checkbox_field(array(
            'slug'          => 'petitioner_enable_hcaptcha',
            'display_name'  => esc_html__('Enabled?', 'petitioner'),
            'helptext'      => esc_html__('Enable hCAPTCHA petitions for spam protection', 'petitioner'),
            'default_value' => 0,
            'section'       => 'petitioner_hcaptcha_section'
        ));

        $this->add_text_field(array(
            'slug'          => 'petitioner_hcaptcha_site_key',
            'display_name'  => esc_html__('Site key', 'petitioner'),
            'helptext'      => esc_html__('Add your site key here', 'petitioner'),
            'default_value' => '',
            'section'       => 'petitioner_hcaptcha_section'
        ));

        $this->add_text_field(array(
            'slug'          => 'petitioner_hcaptcha_secret_key',
            'display_name'  => esc_html__('Secret key', 'petitioner'),
            'helptext'      => esc_html__('Add your secret key here', 'petitioner'),
            'default_value' => '',
            'section'       => 'petitioner_hcaptcha_section'
        ));
    }

    function petition_settings_section_callback()
    {
        echo '<p>' . esc_html__('Configure how your petitions look like.', 'petitioner') . '</p>';
    }

    function petitioner_integrations_section_callback()
    {
        echo '<p>' . esc_html__('Configure available integrations', 'petitioner') . '</p>';
    }

    /**
     * A utility function that creates a checkbox field
     */
    function add_checkbox_field($settings = array())
    {
        $slug = $settings['slug'] ?? '';
        $display_name = $settings['display_name'] ?? '';
        $helptext = $settings['helptext'] ?? '';
        $default_value = $settings['default_value'] ?? false;

        if (empty($slug) || empty($display_name)) return;

        register_setting(
            'petitioner_settings_group',
            $slug,
            array(
                'type'              => 'boolean',
                'default'           => $default_value,
                'sanitize_callback' => 'rest_sanitize_boolean',
            )
        );

        add_settings_field(
            $slug,
            $display_name,
            function () use ($slug, $helptext) {
                $option = get_option($slug);

        ?>
            <input type="checkbox" name="<?php echo esc_attr($slug) ?>" id="<?php echo esc_attr($slug) ?>" value="1" <?php checked(1, $option); ?> />
            <label for="<?php echo esc_attr($slug) ?>"><?php echo esc_html($helptext); ?></label>
        <?php
            },
            'petition-settings',
            !empty($settings['section']) ? $settings['section'] : 'petitioner_settings_section'
        );
    }

    /**
     * A utility function that creates a textarea field
     */
    function add_textarea_field($settings = array())
    {
        $slug = $settings['slug'] ?? '';
        $display_name = $settings['display_name'] ?? '';
        $helptext = $settings['helptext'] ?? '';
        $default_value = $settings['default_value'] ?? '';

        // Ensure required settings are provided
        if (empty($slug) || empty($display_name)) return;

        // Register the setting for the textarea
        register_setting(
            'petitioner_settings_group',
            $slug,
            array(
                'type'              => 'string',
                'default'           => $default_value,
                'sanitize_callback' => 'wp_strip_all_tags',
            )
        );

        // Add the textarea field
        add_settings_field(
            $slug,
            esc_html($display_name),
            function () use ($slug, $helptext) {
                $option = get_option($slug, ''); // Retrieve the stored option
        ?>
            <textarea name="<?php echo esc_attr($slug); ?>" id="<?php echo esc_attr($slug); ?>" rows="10" cols="50" class="large-text code"><?php echo esc_textarea($option); ?></textarea>
            <?php if (!empty($helptext)) : ?>
                <p class="description"><?php echo esc_html($helptext); ?></p>
            <?php endif; ?>
        <?php
            },
            'petition-settings',
            'petitioner_settings_section'
        );
    }

    /**
     * A utility for the codemirror css field
     */
    function add_code_field($settings = array())
    {
        $slug = $settings['slug'] ?? '';
        $display_name = $settings['display_name'] ?? '';
        $helptext = $settings['helptext'] ?? '';
        $default_value = $settings['default_value'] ?? '';

        // Ensure required settings are provided
        if (empty($slug) || empty($display_name)) return;

        // Register the setting for the textarea
        register_setting(
            'petitioner_settings_group',
            $slug,
            array(
                'type'              => 'string',
                'default'           => $default_value,
                'sanitize_callback' => 'wp_strip_all_tags',
            )
        );

        add_settings_field(
            $slug,
            esc_html($display_name),
            function () use ($slug, $helptext) {
                $option = get_option($slug, '');
        ?>
            <textarea name="<?php echo esc_attr($slug); ?>" id="petitionerCode" rows="10" cols="50" class="large-text code petitioner-code-editor"><?php echo esc_textarea($option); ?></textarea>
            <?php if (!empty($helptext)) : ?>
                <p class="description"><?php echo esc_html($helptext); ?></p>
            <?php endif; ?>
        <?php
            },
            'petition-settings',
            'petitioner_settings_section'
        );
    }

    /**
     * A utility for the color picker
     */
    public function add_color_field($settings = array())
    {
        $slug = $settings['slug'] ?? '';
        $display_name = $settings['display_name'] ?? '';
        $helptext = $settings['helptext'] ?? '';
        $default_value = $settings['default_value'] ?? '';

        if (empty($slug) || empty($display_name)) return;

        register_setting(
            'petitioner_settings_group',
            $slug,
        );

        add_settings_field(
            $slug,
            esc_html($display_name),
            function () use ($slug, $helptext, $default_value) {
                $primary_color = get_option($slug, $default_value);
        ?>
            <input type="text" id="<?php echo esc_attr($slug); ?>" name="<?php echo esc_attr($slug); ?>" value="<?php echo esc_attr($primary_color) ?>" class="petitioner-color-field" />
        <?php
            },
            'petition-settings',
            'petitioner_settings_section'
        );
    }

    /**
     * A utility function that creates a text field
     */
    function add_text_field($settings = array())
    {
        $slug = $settings['slug'] ?? '';
        $display_name = $settings['display_name'] ?? '';
        $helptext = $settings['helptext'] ?? '';
        $default_value = $settings['default_value'] ?? '';

        // Ensure required settings are provided
        if (empty($slug) || empty($display_name)) return;

        // Register the setting for the text field
        register_setting(
            'petitioner_settings_group',
            $slug,
            array(
                'type'              => 'string',
                'default'           => $default_value,
                'sanitize_callback' => 'sanitize_text_field',
            )
        );

        // Add the text field
        add_settings_field(
            $slug,
            esc_html($display_name),
            function () use ($slug, $helptext) {
                $option = get_option($slug, ''); // Retrieve the stored option
        ?>
            <input type="text" name="<?php echo esc_attr($slug); ?>" id="<?php echo esc_attr($slug); ?>" value="<?php echo esc_attr($option); ?>" class="regular-text" />
            <?php if (!empty($helptext)) : ?>
                <p class="description"><?php echo esc_html($helptext); ?></p>
            <?php endif; ?>
<?php
            },
            'petition-settings',
            !empty($settings['section']) ? $settings['section'] : 'petitioner_settings_section'
        );
    }
}
