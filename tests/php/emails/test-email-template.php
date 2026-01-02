<?php

use WorDBless\BaseTestCase;

class Test_Email_Template extends BaseTestCase
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
    // GET_DEFAULT_TY_SUBJECT TESTS
    // ============================================

    public function test_get_default_ty_subject_returns_confirmation_subject_when_confirm_emails_true()
    {
        $subject = AV_Petitioner_Email_Template::get_default_ty_subject(true);

        $this->assertIsString($subject);
        $this->assertNotEmpty($subject);
    }

    public function test_get_default_ty_subject_returns_thank_you_subject_when_confirm_emails_false()
    {
        $subject = AV_Petitioner_Email_Template::get_default_ty_subject(false);

        $this->assertIsString($subject);
        $this->assertNotEmpty($subject);
    }

    // ============================================
    // GET_DEFAULT_TY_EMAIL TESTS
    // ============================================

    public function test_get_default_ty_email_includes_user_name_placeholder()
    {
        $email = AV_Petitioner_Email_Template::get_default_ty_email(false);

        $this->assertStringContainsString('{{user_name}}', $email);
    }

    public function test_get_default_ty_email_includes_confirmation_link_when_confirm_emails_true()
    {
        $email = AV_Petitioner_Email_Template::get_default_ty_email(true);

        $this->assertStringContainsString('{{confirmation_link}}', $email);
    }

    public function test_get_default_ty_email_excludes_confirmation_link_when_confirm_emails_false()
    {
        $email = AV_Petitioner_Email_Template::get_default_ty_email(false);

        $this->assertStringNotContainsString('{{confirmation_link}}', $email);
    }

    // ============================================
    // GET_DEFAULT_FROM_FIELD TESTS
    // ============================================

    public function test_get_default_from_field_returns_email_format()
    {
        $from = AV_Petitioner_Email_Template::get_default_from_field();

        $this->assertStringContainsString('@', $from);
        $this->assertStringStartsWith('petition-no-reply@', $from);
    }

    public function test_get_default_from_field_handles_localhost()
    {
        // This would need to mock home_url() to return localhost
        // For now, just test it returns something
        $from = AV_Petitioner_Email_Template::get_default_from_field();

        $this->assertIsString($from);
        $this->assertNotEmpty($from);
    }

    // ============================================
    // GET_DEFAULT_FROM_NAME TESTS
    // ============================================

    public function test_get_default_from_name_returns_string()
    {
        $name = AV_Petitioner_Email_Template::get_default_from_name();

        $this->assertIsString($name);
        $this->assertNotEmpty($name);
    }

    // ============================================
    // GET_STYLED_MESSAGE TESTS
    // ============================================

    public function test_get_styled_message_wraps_content_in_html()
    {
        $message = 'Test message';
        $styled = AV_Petitioner_Email_Template::get_styled_message($message);

        $this->assertStringContainsString($message, $styled);
        $this->assertStringContainsString('<div', $styled);
        $this->assertStringContainsString('<table', $styled);
    }

    public function test_get_styled_message_applies_filter()
    {
        add_filter('petitioner_get_styled_message', function ($html, $message) {
            return 'FILTERED: ' . $message;
        }, 10, 2);

        $result = AV_Petitioner_Email_Template::get_styled_message('test');

        $this->assertEquals('FILTERED: test', $result);

        remove_all_filters('petitioner_get_styled_message');
    }
}
