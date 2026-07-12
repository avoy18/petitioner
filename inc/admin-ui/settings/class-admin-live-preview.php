<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class AV_Petitioner_Admin_Live_Preview
 * 
 * Handles the rendering of the live preview iframe on the Visual Settings page.
 * Uses a bare frontend template via `template_redirect` to ensure active theme 
 * styles are loaded accurately.
 *
 * @since 0.8.5
 */
class AV_Petitioner_Admin_Live_Preview
{
    const NONCE_ACTION = 'petitioner_generate_preview_css';

    /**
     * Initializes the class and hooks into WordPress.
     *
     * @since 0.8.5
     * @return void
     */
    public static function init()
    {
        add_action('template_redirect', [self::class, 'render_preview']);
        add_action('wp_ajax_petitioner_generate_preview_css', [self::class, 'generate_preview_css']);
        add_filter('av_petitioner_info_settings', [self::class, 'add_preview_nonce']);
    }

    /**
     * Injects the dedicated preview nonce into the localized settings data.
     *
     * @param array $petitioner_info
     * @return array
     */
    public static function add_preview_nonce($petitioner_info)
    {
        $petitioner_info['preview_nonce'] = wp_create_nonce(self::NONCE_ACTION);
        return $petitioner_info;
    }

    /**
     * AJAX handler to generate CSS for the live preview.
     *
     * @since 0.8.5
     * @return void
     */
    public static function generate_preview_css()
    {
        if (!current_user_can('manage_options')) {
            wp_send_json_error('Unauthorized');
        }

        check_ajax_referer(self::NONCE_ACTION, 'petitioner_nonce');

        $payload = isset($_POST['payload']) ? json_decode(wp_unslash($_POST['payload']), true) : [];
        if (!is_array($payload)) {
            $payload = [];
        }

        // Pass payload as overrides to the dynamic CSS generator
        $css = AV_Petitioner_Dynamic_CSS::generate_css($payload);

        // Sanitize the final CSS to prevent XSS/HTML injection while preserving valid CSS chars like <
        $css = preg_replace('#<\s*/?\s*style[^>]*>#is', '', $css);

        wp_send_json_success(['css' => $css]);
    }

    /**
     * Renders the bare HTML shell for the live preview iframe.
     * Triggers via `template_redirect` when `petitioner_live_preview` is set.
     *
     * @since 0.8.5
     * @return void
     */
    public static function render_preview()
    {
        if (!isset($_GET['petitioner_live_preview'])) {
            return;
        }

        // Only allow admins to see the preview. 
        // If unauthorized, we simply return and let the normal homepage load. 
        // This prevents a 403 from being accidentally cached as the homepage by aggressive caching plugins.
        if (!current_user_can('manage_options')) {
            return;
        }

        // Prevent clickjacking by ensuring this can only be framed by the same origin
        send_frame_options_header();

        $form_id = isset($_GET['form_id']) ? intval($_GET['form_id']) : 0;

        // Remove admin bar for the preview
        add_filter('show_admin_bar', '__return_false');

        // Add the postMessage listener script to the footer
        add_action('wp_footer', [self::class, 'render_preview_script'], 999);

?>
        <!DOCTYPE html>
        <html <?php language_attributes(); ?>>

        <head>
            <meta charset="<?php bloginfo('charset'); ?>">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title><?php esc_html_e('Petitioner Live Preview', 'petitioner'); ?></title>
            <?php wp_head(); ?>
            <style>
                body {
                    background: transparent;
                    margin: 0;
                    padding: 20px;
                }

                html {
                    margin-top: 0 !important;
                }
            </style>
        </head>

        <body <?php body_class(); ?>>
            <div class="petitioner-preview-wrapper petitioner-preview" style="max-width: 800px; margin: 8px auto; padding: 12px;">
                <?php
                if ($form_id) {
                    $frontend_ui = new AV_Petitioner_Frontend_UI();
                    echo $frontend_ui->display_form(['id' => $form_id]);
                } else {
                    echo '<p>' . esc_html__('Please create at least one petition to see the live preview.', 'petitioner') . '</p>';
                }
                ?>
            </div>
            <?php wp_footer(); ?>
        </body>

        </html>
    <?php
        exit;
    }

    /**
     * Renders the inline JavaScript that listens for `postMessage` events 
     * to update the form styles and visibility in real-time.
     *
     * @since 0.8.5
     * @return void
     */
    public static function render_preview_script()
    {
        $admin_url = admin_url();
    ?>
        <script>
            const adminOrigin = new URL('<?php echo esc_js($admin_url); ?>', window.location.href).origin;
            // Listen for messages from the parent window
            window.addEventListener('message', function(event) {
                // Verify the message comes from the WordPress admin dashboard
                if (event.origin !== adminOrigin) return;

                if (event.data && event.data.type === 'UPDATE_VISIBILITY') {
                    const payload = event.data.payload;
                    if (!payload) return;
                    const root = document.querySelector('.petitioner');
                    if (!root) return;

                    // Toggle elements based on settings
                    const titleEl = document.querySelector('.petitioner__title');
                    if (titleEl) titleEl.style.display = payload.show_title ? 'block' : 'none';

                    const letterEl = document.querySelector('.petitioner__btn--letter');
                    if (letterEl) letterEl.style.display = payload.show_letter ? 'block' : 'none';

                    const goalEl = document.querySelector('.petitioner__goal');
                    if (goalEl) goalEl.style.display = payload.show_goal ? 'flex' : 'none';
                }

                if (event.data && event.data.type === 'UPDATE_CSS') {
                    const cssString = event.data.payload;

                    // Apply custom CSS string
                    let customStyleEl = document.getElementById('petitioner-dynamic-css');
                    if (!customStyleEl) {
                        customStyleEl = document.createElement('style');
                        customStyleEl.id = 'petitioner-dynamic-css';
                        document.head.appendChild(customStyleEl);
                    }
                    customStyleEl.textContent = cssString || '';
                }
            });
        </script>
<?php
    }
}
