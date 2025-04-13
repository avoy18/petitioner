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

    private const OPTION_FIELDS = [];

    function __construct()
    {

        $this->default_colors = array(
            'primary'   => '#e01a2b',
            'dark'      => '#000000',
            'grey'      => '#efefef'
        );

        add_action('admin_menu', array($this, 'add_settings_submenu'));

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

            <form method="post" action="options.php">

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
        wp_nonce_field("save_petition_details", "petitioner_details_nonce");
        // Retrieve current meta values
        $option_values     = $this->get_option_fields();
        // Sanitize values for safe use in HTML attributes
        $petitioner_info = [
            // "form_id"                       => (int) $post->ID,
            // "title"                         => esc_html($meta_values['title']),
            // "send_to_representative"        => (bool) $meta_values['send_to_representative'],
            // "email"                         => sanitize_text_field($meta_values['email']),
            // "cc_emails"                     => sanitize_text_field($meta_values['cc_emails']),
            // "show_goal"                     => (bool) $meta_values['show_goal'],
            // "goal"                          => (int) $meta_values['goal'],
            // "show_country"                  => (bool) $meta_values['show_country'],
            // "subject"                       => esc_html($meta_values['subject']),
            // "require_approval"              => (bool) $meta_values['require_approval'],
            // "approval_state"                => esc_html($meta_values['approval_state']),
            // "letter"                        => wp_kses_post($meta_values['letter']),
            // "add_legal_text"                => (bool) $meta_values['add_legal_text'],
            // "add_consent_checkbox"          => (bool) $meta_values['add_consent_checkbox'],
            // "consent_text"                  => sanitize_text_field($meta_values['consent_text']),
            // "legal_text"                    => wp_kses_post($meta_values['legal_text']),
            // "export_url"                    => esc_url(admin_url("admin-post.php?action=petitioner_export_csv&form_id=" . (int) $post->ID)),
            // "override_ty_email"             => (bool) $meta_values['override_ty_email'],
            // "ty_email"                      => wp_kses_post($meta_values['ty_email']),
            // "ty_email_subject"              => sanitize_text_field($meta_values['ty_email_subject']),
            // "from_field"                    => sanitize_text_field($meta_values['from_field']),
            // "add_honeypot"                  => (bool) $meta_values['add_honeypot'],
            "default_values"                => [
                "ty_email_subject"              => AV_Petitioner_Email_Template::get_default_ty_subject(),
                "ty_email"                      => AV_Petitioner_Email_Template::get_default_ty_email(),
                'ty_email_subject_confirm'      => AV_Petitioner_Email_Template::get_default_ty_subject(true),
                'ty_email_confirm'              => AV_Petitioner_Email_Template::get_default_ty_email(true),
                "from_field"                    => AV_Petitioner_Email_Template::get_default_from_field(),
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
     * Display Meta Box Fields
     */
    public function display_meta_box($post)
    {
        echo '<div class="petitioner-admin-settings">';
        $this->render_form_fields($post);
        echo '</div>';
    }
}
