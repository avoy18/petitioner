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
                'perPage' => [
                    'type'    => 'number',
                    'default' => 10
                ],
                'style' => [
                    'type'    => 'string',
                    'default' => 'simple',
                    'enum'    => ['simple', 'table']
                ],
                'fields' => [
                    'type'    => 'array',
                    'default' => ['name', 'country', 'submitted_at'],
                    'items'   => [
                        'type' => 'string'
                    ]
                ],
                'showPagination' => [
                    'type'    => 'boolean',
                    'default' => true
                ]
            ],
            'render_callback' => function ($attributes) {
                if (empty($attributes['formId'])) return '';

                $style              = isset($attributes['style']) ? sanitize_text_field($attributes['style']) : 'simple';
                $fields             = isset($attributes['fields']) ? array_map('sanitize_text_field', $attributes['fields']) : ['name', 'country', 'submitted_at'];
                $show_pagination    = isset($attributes['showPagination']) ? filter_var($attributes['showPagination'], FILTER_VALIDATE_BOOLEAN) : true;
                $available_styles   = AV_Petitioner_Shortcodes::get_available_styles();
                $available_fields   = AV_Petitioner_Shortcodes::get_available_fields();

                $shortcode_atts = [
                    'id'                => absint($attributes['formId']),
                    'per_page'          => isset($attributes['perPage']) ? absint($attributes['perPage']) : 10,
                    'style'             => in_array($style, $available_styles) ? $style : 'simple',
                    'fields'            => array_intersect($fields, $available_fields) ? implode(',', array_intersect($fields, $available_fields)) : 'name,country,submitted_at',
                    'show_pagination'   => $show_pagination ? 'true' : 'false'
                ];

                $shortcode_atts = array_map('esc_attr', $shortcode_atts);

                $shortcode_result = do_shortcode('[petitioner-submissions ' . $this->array_to_shortcode_atts($shortcode_atts) . ']');

                if (empty($shortcode_result)) {
                    return '<p>' . esc_html__('No submissions found for this form.', 'petitioner') . '</p>';
                }

                return $shortcode_result;
            }
        ]);
    }

    public function array_to_shortcode_atts($attributes)
    {
        $html = '';
        foreach ($attributes as $key => $value) {
            if (is_array($value)) {
                $value = implode(' ', $value);
            }
            $html .= esc_attr($key) . '="' . esc_attr($value) . '" ';
        }
        return trim($html);
    }
}
