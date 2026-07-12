<?php

use WorDBless\BaseTestCase;

class Test_Class_Setup extends BaseTestCase
{
    public function set_up()
    {
        parent::set_up();
        // Ensure wp_styles is initialized for the test environment
        $GLOBALS['wp_styles'] = new WP_Styles();
    }

    public function tear_down()
    {
        parent::tear_down();
        delete_option('petitioner_custom_css');
    }

    public function test_custom_css_sanitization_preserves_valid_chars()
    {
        // Provide valid CSS containing a < character
        update_option('petitioner_custom_css', 'body { content: "<viewport>"; }');

        $setup = new AV_Petitioner_Setup();
        $setup->enqueue_frontend_assets();

        global $wp_styles;
        $inline_styles = $wp_styles->get_data('petitioner-style', 'after');

        $this->assertIsArray($inline_styles, 'Inline styles should be enqueued as an array.');

        $css_output = implode(' ', $inline_styles);

        // Verify that the < character was NOT stripped
        $this->assertStringContainsString('body { content: "<viewport>"; }', $css_output);
    }

    public function test_custom_css_sanitization_strips_style_tags()
    {
        // Provide malicious payload attempting to break out of the style tag
        update_option('petitioner_custom_css', 'body { background: red; } </style><script>alert("xss")</script>');

        $setup = new AV_Petitioner_Setup();
        $setup->enqueue_frontend_assets();

        global $wp_styles;
        $inline_styles = $wp_styles->get_data('petitioner-style', 'after');

        $this->assertIsArray($inline_styles, 'Inline styles should be enqueued as an array.');

        $css_output = implode(' ', $inline_styles);

        // Verify that the </style> tag was stripped completely
        $this->assertStringNotContainsString('</style>', $css_output);
        $this->assertStringNotContainsString('<style', $css_output);

        // Verify that the rest of the payload was preserved (locked inside the CSS block)
        $this->assertStringContainsString('body { background: red; } <script>alert("xss")</script>', $css_output);
    }
}
