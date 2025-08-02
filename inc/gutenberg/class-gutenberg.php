<?php

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Gutenberg blocks for the Petitioner plugin.
 *
 * @package petitioner
 */
class AV_Petitioner_Gutenberg
{
    public function __construct()
    {
        wp_register_style(
            'petitioner-form-style',
            plugin_dir_url(AV_PETITIONER_PLUGIN_DIR . 'petitioner.php') . 'dist/main.css',
            [],
            AV_PETITIONER_PLUGIN_VERSION
        );

        av_ptr_error_log(AV_PETITIONER_PLUGIN_DIR . '/dist-gutenberg/blocks/form');

        register_block_type(AV_PETITIONER_PLUGIN_DIR . '/dist-gutenberg/blocks/form', [
            'style' => 'petitioner-form-style',
            'editor_style' => 'petitioner-form-style',
            'attributes' => [
                'formId' => [
                    'type'    => 'string',
                    'default' => null
                ],
                'newPetitionLink' => [
                    'type'    => 'text',
                    'default' => admin_url('post-new.php?post_type=petitioner-petition')
                ],
            ],
            'render_callback' => function ($attributes) {
                if (empty($attributes['formId'])) return;

                $form_id = $attributes['formId'];

                return do_shortcode('[petitioner-form id="' . esc_attr($form_id) . '"]');
            }
        ]);

        register_block_type(AV_PETITIONER_PLUGIN_DIR . '/dist-gutenberg/blocks/submissions', [
            'attributes' => [
                'formId' => [
                    'type'    => 'string',
                    'default' => null
                ],
                'newPetitionLink' => [
                    'type'    => 'text',
                    'default' => admin_url('post-new.php?post_type=petitioner-petition')
                ],
            ],
            'render_callback' => function ($attributes) {
                if (empty($attributes['formId'])) return;

                $form_id = $attributes['formId'];

                return do_shortcode('[petitioner-submissions id="' . esc_attr($form_id) . '"]');
            }
        ]);
    }
}
