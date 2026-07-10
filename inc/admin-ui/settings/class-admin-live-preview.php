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

        $payload = isset($_POST['payload']) ? (array) $_POST['payload'] : [];
        
        // Pass payload as overrides to the dynamic CSS generator
        $css = AV_Petitioner_Dynamic_CSS::generate_css($payload);
        
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

        // Only allow admins
        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized', 403);
        }

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
                html { margin-top: 0 !important; }
            </style>
        </head>
        <body <?php body_class(); ?>>
            <div class="petitioner-preview-wrapper petitioner-preview" style="max-width: 800px; margin: 40px auto; padding: 20px;">
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
        ?>
        <script>
            // Listen for messages from the parent window
            window.addEventListener('message', function(event) {
                if (event.data && event.data.type === 'UPDATE_VISIBILITY') {
                    const payload = event.data.payload;
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
