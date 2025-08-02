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

        register_block_type(AV_PETITIONER_PLUGIN_DIR . '/dist-gutenberg/blocks/form', [
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
                if (empty($attributes['formId'])) return 'HII';

                $form_id = $attributes['formId'];

                $shortcode_result = do_shortcode('[petitioner-submissions id="' . esc_attr($form_id) . '"]');

                if (empty($shortcode_result)) {
                    return '<p>' . esc_html__('No submissions found for this form.', 'petitioner') . '</p>';
                }

                return $shortcode_result;
            }
        ]);
    }
}
