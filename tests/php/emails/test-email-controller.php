<?php

use WorDBless\BaseTestCase;

class Test_Email_Controller extends BaseTestCase
{

    public function set_up()
    {
        parent::set_up();
    }

    public function tear_down()
    {
        parent::tear_down();
    }

    // ============================================
    // BUILD_HEADERS TESTS
    // ============================================

    public function test_build_headers_includes_content_type()
    {
        $headers = AV_Petitioner_Email_Controller::build_headers('', '', '');

        $this->assertContains('Content-Type: text/html; charset=UTF-8', $headers);
    }

    public function test_build_headers_includes_from()
    {
        $headers = AV_Petitioner_Email_Controller::build_headers('test@example.com', '', '');

        $this->assertContains('From: test@example.com', $headers);
    }

    public function test_build_headers_includes_cc()
    {
        $headers = AV_Petitioner_Email_Controller::build_headers('', 'cc@example.com', '');

        $this->assertContains('CC: cc@example.com', $headers);
    }

    public function test_build_headers_includes_bcc()
    {
        $headers = AV_Petitioner_Email_Controller::build_headers('', '', 'bcc@example.com');

        $this->assertContains('BCC: bcc@example.com', $headers);
    }

    public function test_build_headers_includes_all_when_provided()
    {
        $headers = AV_Petitioner_Email_Controller::build_headers(
            'from@example.com',
            'cc@example.com',
            'bcc@example.com'
        );

        $this->assertContains('Content-Type: text/html; charset=UTF-8', $headers);
        $this->assertContains('From: from@example.com', $headers);
        $this->assertContains('CC: cc@example.com', $headers);
        $this->assertContains('BCC: bcc@example.com', $headers);
    }

    public function test_build_headers_skips_empty_values()
    {
        $headers = AV_Petitioner_Email_Controller::build_headers('', '', '');

        $this->assertCount(1, $headers); // Only Content-Type
        $this->assertNotContains('From:', $headers);
        $this->assertNotContains('CC:', $headers);
        $this->assertNotContains('BCC:', $headers);
    }
}
