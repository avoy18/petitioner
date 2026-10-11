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

    /**
     * Build a mailer whose "sincerely" label is overridden for its form.
     *
     * @param string|null $sincerely_label Label to store, or null to keep the default.
     * @return array{0: AV_Petitioner_Mailer, 1: int} The mailer and its form ID.
     */
    private function make_mailer_with_label($sincerely_label = null)
    {
        AV_Petitioner_Labels::clear_cache();

        $form_id = wp_insert_post([
            'post_type'   => 'petitioner-petition',
            'post_status' => 'publish',
        ]);

        if ($sincerely_label !== null) {
            update_post_meta($form_id, '_petitioner_sincerely', $sincerely_label);
        }

        $mailer = new AV_Petitioner_Mailer([
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
            'form_id' => $form_id,
            'submission_id' => 1,
        ]);

        return [$mailer, $form_id];
    }

    public function test_get_signature_html_fills_the_default_placeholder()
    {
        list($mailer, $form_id) = $this->make_mailer_with_label();

        $this->assertSame('<p>Sincerely, John Doe</p>', $mailer->get_signature_html());

        wp_delete_post($form_id, true);
    }

    public function test_get_signature_html_handles_a_stray_percent_in_a_custom_label()
    {
        list($mailer, $form_id) = $this->make_mailer_with_label('Sincerely, %s - 100% committed');

        $this->assertSame(
            '<p>Sincerely, John Doe - 100% committed</p>',
            $mailer->get_signature_html(),
            'A literal % in a custom label must not break the signature'
        );

        wp_delete_post($form_id, true);
    }

    public function test_get_signature_html_supports_the_user_name_token()
    {
        list($mailer, $form_id) = $this->make_mailer_with_label('Kind regards, {{user_name}}');

        $this->assertSame('<p>Kind regards, John Doe</p>', $mailer->get_signature_html());

        wp_delete_post($form_id, true);
    }

    public function test_get_signature_html_leaves_a_placeholderless_label_untouched()
    {
        list($mailer, $form_id) = $this->make_mailer_with_label('Sincerely,');

        $this->assertSame('<p>Sincerely,</p>', $mailer->get_signature_html());

        wp_delete_post($form_id, true);
    }

    public function test_constructor_stores_lang()
    {
        list($mailer, $form_id) = $this->make_mailer_with_label();

        $this->assertSame('', $mailer->lang);

        $with_lang = new AV_Petitioner_Mailer([
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
            'form_id' => $form_id,
            'submission_id' => 1,
            'lang' => 'fr',
        ]);

        $this->assertSame('fr', $with_lang->lang);

        wp_delete_post($form_id, true);
    }

    public function test_email_string_keeps_source_when_lang_empty()
    {
        list($mailer, $form_id) = $this->make_mailer_with_label();

        add_filter('av_petitioner_email_string', function () {
            return 'FR';
        });

        $this->assertSame('Test letter', $mailer->email_string('letter', 'Test letter', ''));

        remove_all_filters('av_petitioner_email_string');
        wp_delete_post($form_id, true);
    }

    public function test_email_string_uses_filter_for_lang()
    {
        list($mailer, $form_id) = $this->make_mailer_with_label();

        add_filter('av_petitioner_email_string', function ($value, $name, $id, $lang) {
            return $lang . ':' . $name . ':' . $value;
        }, 10, 4);

        $this->assertSame('fr:letter:Dear minister', $mailer->email_string('letter', 'Dear minister', 'fr'));

        remove_all_filters('av_petitioner_email_string');
        wp_delete_post($form_id, true);
    }

    public function test_representative_email_lang_defaults_to_source()
    {
        list($mailer, $form_id) = $this->make_mailer_with_label();

        $this->assertSame('', $mailer->representative_email_lang());

        wp_delete_post($form_id, true);
    }

    public function test_representative_email_lang_filter_can_use_signer_lang()
    {
        $form_id = wp_insert_post([
            'post_type' => 'petitioner-petition',
            'post_status' => 'publish',
        ]);

        $mailer = new AV_Petitioner_Mailer([
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
            'form_id' => $form_id,
            'submission_id' => 1,
            'lang' => 'fr',
        ]);

        add_filter('av_petitioner_representative_email_lang', function ($lang, $mailer) {
            return $mailer->lang;
        }, 10, 2);

        $this->assertSame('fr', $mailer->representative_email_lang());

        remove_all_filters('av_petitioner_representative_email_lang');
        wp_delete_post($form_id, true);
    }
}
