<?php

use WorDBless\BaseTestCase;

class Test_Class_Admin_Live_Preview extends BaseTestCase
{
    public function test_render_preview_script_outputs_correct_origin_check()
    {
        ob_start();
        AV_Petitioner_Admin_Live_Preview::render_preview_script();
        $output = ob_get_clean();

        // Verify that the script dynamically calculates the admin origin
        $this->assertStringContainsString("const adminOrigin = new URL('", $output);
        
        // Verify that it enforces the strict check against the admin origin
        $this->assertStringContainsString("if (event.origin !== adminOrigin) return;", $output);
    }
}
