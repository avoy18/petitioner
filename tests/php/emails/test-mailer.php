<?php

use WorDBless\BaseTestCase;

class Test_Mailer extends BaseTestCase
{
    public function set_up()
    {
        parent::set_up();
        AV_Petitioner_Submissions_Model::create_db_table();
    }

    public function tear_down()
    {
        parent::tear_down();
    }

    public function test_send_emails_returns_true_when_ty_email_skipped_and_rep_email_succeeds()
    {
        $settings = [
            'target_email' => 'test@test.com',
            'target_cc_emails' => '',
            'user_email' => 'user@test.com',
            'user_name' => 'John Doe',
            'user_country' => 'US',
            'subject' => 'Test',
            'letter' => 'Test letter',
            'bcc' => false,
            'send_to_representative' => true,
            'confirm_emails' => false,
            'send_ty_email' => false, // TY email is explicitly skipped
            'form_id' => 1,
            'submission_id' => 1,
        ];

        $mailer = $this->getMockBuilder(AV_Petitioner_Mailer::class)
            ->setConstructorArgs([$settings])
            ->onlyMethods(['ty_email', 'representative_email'])
            ->getMock();

        $mailer->expects($this->never())
            ->method('ty_email');

        $mailer->expects($this->once())
            ->method('representative_email')
            ->willReturn(true);

        $result = $mailer->send_emails();

        $this->assertTrue($result, 'send_emails should return true when TY email is skipped and Rep email succeeds');
    }

    public function test_send_emails_returns_false_when_rep_email_fails()
    {
        $settings = [
            'target_email' => 'test@test.com',
            'target_cc_emails' => '',
            'user_email' => 'user@test.com',
            'user_name' => 'John Doe',
            'user_country' => 'US',
            'subject' => 'Test',
            'letter' => 'Test letter',
            'bcc' => false,
            'send_to_representative' => true,
            'confirm_emails' => false,
            'send_ty_email' => false,
            'form_id' => 1,
            'submission_id' => 1,
        ];

        $mailer = $this->getMockBuilder(AV_Petitioner_Mailer::class)
            ->setConstructorArgs([$settings])
            ->onlyMethods(['ty_email', 'representative_email'])
            ->getMock();

        $mailer->expects($this->once())
            ->method('representative_email')
            ->willReturn(false);

        $result = $mailer->send_emails();

        $this->assertFalse($result, 'send_emails should return false when Rep email fails');
    }

    public function test_send_emails_returns_true_when_both_emails_succeed()
    {
        $settings = [
            'target_email' => 'test@test.com',
            'target_cc_emails' => '',
            'user_email' => 'user@test.com',
            'user_name' => 'John Doe',
            'user_country' => 'US',
            'subject' => 'Test',
            'letter' => 'Test letter',
            'bcc' => false,
            'send_to_representative' => true,
            'confirm_emails' => false,
            'send_ty_email' => true,
            'form_id' => 1,
            'submission_id' => 1,
        ];

        $mailer = $this->getMockBuilder(AV_Petitioner_Mailer::class)
            ->setConstructorArgs([$settings])
            ->onlyMethods(['ty_email', 'representative_email'])
            ->getMock();

        $mailer->expects($this->once())
            ->method('ty_email')
            ->willReturn(true);

        $mailer->expects($this->once())
            ->method('representative_email')
            ->willReturn(true);

        $result = $mailer->send_emails();

        $this->assertTrue($result, 'send_emails should return true when both emails succeed');
    }

    public function test_send_emails_skips_sending_when_already_sent()
    {
        $settings = [
            'target_email' => 'test@test.com',
            'target_cc_emails' => '',
            'user_email' => 'user@test.com',
            'user_name' => 'John Doe',
            'user_country' => 'US',
            'subject' => 'Test',
            'letter' => 'Test letter',
            'bcc' => false,
            'send_to_representative' => true,
            'confirm_emails' => false,
            'send_ty_email' => true,
            'form_id' => 1,
            'submission_id' => 999,
        ];

        $filter_callback = function () {
            return ['ty_email_sent' => true, 'rep_email_sent' => true];
        };

        add_filter('av_petitioner_submission_status', $filter_callback, 10, 2);

        $mailer = $this->getMockBuilder(AV_Petitioner_Mailer::class)
            ->setConstructorArgs([$settings])
            ->onlyMethods(['ty_email', 'representative_email'])
            ->getMock();

        $mailer->expects($this->never())
            ->method('ty_email');

        $mailer->expects($this->never())
            ->method('representative_email');

        $result = $mailer->send_emails();

        $this->assertTrue($result, 'send_emails should return true and skip sending when both emails are already marked as sent');

        remove_filter('av_petitioner_submission_status', $filter_callback, 10);
    }
}
