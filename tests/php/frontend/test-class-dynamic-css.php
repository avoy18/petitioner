<?php

use WorDBless\BaseTestCase;

class Test_Class_Dynamic_CSS extends BaseTestCase
{
    public function tear_down()
    {
        parent::tear_down();
        delete_option('petitioner_settings');
        delete_option('petitioner_custom_css');
    }

    public function test_generate_css_uses_overrides()
    {
        // Provide an override array specifically for the live preview
        $overrides = [
            'custom_css' => 'body { color: hotpink; }'
        ];
        
        $css = AV_Petitioner_Dynamic_CSS::generate_css($overrides);
        
        // Ensure the custom CSS override is present in the final output
        $this->assertStringContainsString('body { color: hotpink; }', $css);
    }

    public function test_generate_css_falls_back_to_saved_options()
    {
        // Save to DB but don't pass as override
        update_option('petitioner_custom_css', 'body { color: blue; }');
        
        $css = AV_Petitioner_Dynamic_CSS::generate_css([]);
        
        // Ensure it falls back to the database option
        $this->assertStringContainsString('body { color: blue; }', $css);
    }
}
