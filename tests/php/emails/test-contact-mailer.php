<?php

use WorDBless\BaseTestCase;

class Test_Contact_Mailer extends BaseTestCase
{
    private function make_settings($overrides = [])
    {
        return array_merge([
            'target_email'           => 'admin@example.com',
            'target_cc_emails'       => '',
            'user_email'             => 'jane@example.com',
            'user_name'              => 'Jane Doe',
            'user_country'           => '',
            'letter'                 => 'Stale petition letter',
            'subject'                => '',
            'bcc'                    => false,
            'send_to_representative' => '',
            'confirm_emails'         => false,
            'form_id'                => 1,
            'submission_id'          => false,
        ], $overrides);
    }

    public function test_send_emails_only_sends_the_notification()
    {
        $mailer = $this->getMockBuilder(AV_Petitioner_Contact_Mailer::class)
            ->setConstructorArgs([$this->make_settings(['send_ty_email' => true])])
            ->onlyMethods(['ty_email', 'representative_email'])
            ->getMock();

        $mailer->expects($this->never())->method('ty_email');
        $mailer->expects($this->once())->method('representative_email')->willReturn(true);

        $this->assertTrue($mailer->send_emails());
    }

    public function test_representative_email_sends_the_submitted_fields_without_signature()
    {
        $mailer = $this->getMockBuilder(AV_Petitioner_Contact_Mailer::class)
            ->setConstructorArgs([$this->make_settings()])
            ->onlyMethods(['get_field_rows'])
            ->getMock();

        $mailer->method('get_field_rows')->willReturn([
            'Email'   => 'jane@example.com',
            'Message' => 'Hello there',
        ]);

        $sent_args = [];
        $capture = function ($args) use (&$sent_args) {
            $sent_args = $args;
        };
        add_action('petitioner_before_send_rep_email', $capture);

        $mailer->representative_email();

        remove_action('petitioner_before_send_rep_email', $capture);

        $this->assertSame('admin@example.com', $sent_args['target_email']);
        $this->assertSame(AV_Petitioner_Labels::get('contact_notification_subject'), $sent_args['subject']);
        $this->assertStringContainsString('jane@example.com', $sent_args['message']);
        $this->assertStringContainsString('Hello there', $sent_args['message']);
        $this->assertStringNotContainsString('Stale petition letter', $sent_args['message']);
        $this->assertStringNotContainsString('Jane Doe', $sent_args['message']);
    }

    public function test_representative_email_keeps_custom_subject()
    {
        $sent_args = [];
        $capture = function ($args) use (&$sent_args) {
            $sent_args = $args;
        };
        add_action('petitioner_before_send_rep_email', $capture);

        (new AV_Petitioner_Contact_Mailer($this->make_settings(['subject' => 'Website enquiry'])))->representative_email();

        remove_action('petitioner_before_send_rep_email', $capture);

        $this->assertSame('Website enquiry', $sent_args['subject']);
    }

    public function test_get_field_rows_lists_submitted_fields_only()
    {
        $rows = (new AV_Petitioner_Contact_Mailer($this->make_settings()))->get_field_rows([
            'id'              => 3,
            'form_id'         => 12,
            'email'           => 'jane@example.com',
            'fname'           => 'Jane',
            'lname'           => '',
            'newsletter'      => '1',
            'hide_name'       => '0',
            'salutation'      => null,
            'approval_status' => 'Confirmed',
            'submitted_at'    => '2026-11-14 12:00:00',
        ]);

        $this->assertSame([
            AV_Petitioner_Field_Registry::get('email')['fieldName']      => 'jane@example.com',
            AV_Petitioner_Field_Registry::get('fname')['fieldName']      => 'Jane',
            AV_Petitioner_Field_Registry::get('newsletter')['fieldName'] => 'Yes',
        ], $rows);
    }
}
