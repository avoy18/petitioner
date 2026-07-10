<?php

if (!defined('ABSPATH')) {
    exit;
}

class AV_Petitioner_Admin_Live_Preview
{
    public static function init()
    {
        add_action('template_redirect', [self::class, 'render_preview']);
    }

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
            <title>Petitioner Live Preview</title>
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

    public static function render_preview_script()
    {
        ?>
        <script>
            // Listen for messages from the parent window
            window.addEventListener('message', function(event) {
                if (event.data && event.data.type === 'UPDATE_SETTINGS') {
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

                    // Apply custom CSS
                    let customStyleEl = document.getElementById('preview-custom-css');
                    if (!customStyleEl) {
                        customStyleEl = document.createElement('style');
                        customStyleEl.id = 'preview-custom-css';
                        document.head.appendChild(customStyleEl);
                    }
                    customStyleEl.textContent = payload.custom_css || '';

                    const setVar = (name, val) => {
                        if (val) {
                            root.style.setProperty(name, val, 'important');
                        } else {
                            root.style.removeProperty(name);
                        }
                    };

                    // Colors
                    setVar('--ptr-color-primary', payload.primary_color);
                    setVar('--ptr-color-dark', payload.dark_color);
                    setVar('--ptr-color-grey', payload.grey_color);

                    // Border Radius
                    if (payload.border_radius) {
                        setVar('--ptr-input-border-radius', `var(--ptr-border-radius-${payload.border_radius})`);
                        setVar('--ptr-button-border-radius', `var(--ptr-border-radius-${payload.border_radius})`);
                        
                        let wrapperRadius = payload.border_radius === 'full' ? 'lg' : payload.border_radius;
                        setVar('--ptr-wrapper-radius', `var(--ptr-border-radius-${wrapperRadius})`);
                    } else {
                        root.style.removeProperty('--ptr-input-border-radius');
                        root.style.removeProperty('--ptr-button-border-radius');
                        root.style.removeProperty('--ptr-wrapper-radius');
                    }

                    // Base Font Size
                    if (payload.base_font_size) {
                        setVar('--ptr-label-font-size', `var(--ptr-fs-${payload.base_font_size})`);
                    } else {
                        root.style.removeProperty('--ptr-label-font-size');
                    }

                    // Button Font Size
                    if (payload.button_font_size) {
                        setVar('--ptr-btn-font-size', `var(--ptr-fs-${payload.button_font_size})`);
                    } else {
                        root.style.removeProperty('--ptr-btn-font-size');
                    }

                    // Spacing
                    if (payload.field_spacing) {
                        setVar('--ptr-input-margin-bottom', `var(--ptr-spacer-${payload.field_spacing})`);
                    } else {
                        root.style.removeProperty('--ptr-input-margin-bottom');
                    }

                    // Border width
                    if (payload.input_border_width) {
                        setVar('--ptr-input-border-width', payload.input_border_width);
                    } else {
                        root.style.removeProperty('--ptr-input-border-width');
                    }

                    // Input Size
                    if (payload.input_size) {
                        switch(payload.input_size) {
                            case 'sm':
                                setVar('--ptr-input-line-height', '24px');
                                setVar('--ptr-input-spacing-y', '4px');
                                setVar('--ptr-label-line-height', '1.4');
                                break;
                            case 'md':
                                setVar('--ptr-input-line-height', '24px');
                                setVar('--ptr-input-spacing-y', '8px');
                                root.style.removeProperty('--ptr-label-line-height');
                                break;
                            case 'lg':
                                setVar('--ptr-input-line-height', '32px');
                                setVar('--ptr-input-spacing-y', '8px');
                                root.style.removeProperty('--ptr-label-line-height');
                                break;
                            case 'xl':
                                setVar('--ptr-input-line-height', '40px');
                                setVar('--ptr-input-spacing-y', '0.7rem');
                                root.style.removeProperty('--ptr-label-line-height');
                                break;
                        }
                    } else {
                        root.style.removeProperty('--ptr-input-line-height');
                        root.style.removeProperty('--ptr-input-spacing-y');
                        root.style.removeProperty('--ptr-label-line-height');
                    }
                }
            });
        </script>
        <?php
    }
}
