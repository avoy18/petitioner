<?php

use WorDBless\BaseTestCase;

class Test_Submissions_Model extends BaseTestCase
{

    public function set_up()
    {
        parent::set_up();

        // Create the submissions table
        AV_Petitioner_Submissions_Model::create_db_table();
    }

    public function tear_down()
    {
        parent::tear_down();
    }

    public function test_table_name_returns_correct_prefix()
    {
        global $wpdb;
        $expected = $wpdb->prefix . 'av_petitioner_submissions';
        $this->assertEquals($expected, AV_Petitioner_Submissions_Model::table_name());
    }

    public function test_get_public_fields_returns_expected_fields()
    {
        $public_fields = AV_Petitioner_Submissions_Model::get_public_fields();

        $this->assertIsArray($public_fields);
        $this->assertContains('country', $public_fields);
        $this->assertContains('city', $public_fields);
        $this->assertNotContains('email', $public_fields);
        $this->assertNotContains('phone', $public_fields);
        $this->assertNotContains('street_address', $public_fields);
    }
}
