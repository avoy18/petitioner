<?php

use WorDBless\BaseTestCase;

class Test_Submissions_Importer extends BaseTestCase
{
    public function set_up()
    {
        parent::set_up();
        // Ensure the submissions table exists for our tests
        AV_Petitioner_Submissions_Model::create_db_table();
    }

    public function tear_down()
    {
        parent::tear_down();
    }

    // ============================================
    // CONSTRUCTOR TESTS
    // ============================================

    public function test_constructor_assigns_properties_correctly()
    {
        $importer = new AV_Petitioner_CSV_Importer([
            'form_id'            => 123,
            'csv_url'            => 'https://example.com/test.csv',
            'action'             => 'remove',
            'approve_submission' => false,
            'field_overrides'    => ['Email' => 'email']
        ]);

        $reflection = new ReflectionClass($importer);
        
        $form_id = $reflection->getProperty('form_id');
        $form_id->setAccessible(true);
        $this->assertEquals(123, $form_id->getValue($importer));

        $action = $reflection->getProperty('action');
        $action->setAccessible(true);
        $this->assertEquals('remove', $action->getValue($importer));
        
        $approve = $reflection->getProperty('approve_submission');
        $approve->setAccessible(true);
        $this->assertFalse($approve->getValue($importer));
    }

    // ============================================
    // FILE PATH SECURITY TESTS
    // ============================================

    public function test_get_safe_local_file_path_allows_valid_csv()
    {
        $importer = new AV_Petitioner_CSV_Importer();
        $reflection = new ReflectionClass($importer);
        $method = $reflection->getMethod('get_safe_local_file_path');
        $method->setAccessible(true);

        $temp_file = wp_normalize_path(WP_CONTENT_DIR) . '/temp_test.csv';
        file_put_contents($temp_file, "email\ntest@example.com");

        $result = $method->invokeArgs($importer, [$temp_file]);

        $this->assertEquals(realpath($temp_file), $result);

        unlink($temp_file);
    }

    public function test_get_safe_local_file_path_rejects_non_csv()
    {
        $importer = new AV_Petitioner_CSV_Importer();
        $reflection = new ReflectionClass($importer);
        $method = $reflection->getMethod('get_safe_local_file_path');
        $method->setAccessible(true);

        $temp_file = wp_normalize_path(WP_CONTENT_DIR) . '/temp_test.txt';
        file_put_contents($temp_file, "some content");

        $result = $method->invokeArgs($importer, [$temp_file]);

        $this->assertNull($result);

        unlink($temp_file);
    }

    public function test_get_safe_local_file_path_rejects_path_traversal()
    {
        $importer = new AV_Petitioner_CSV_Importer();
        $reflection = new ReflectionClass($importer);
        $method = $reflection->getMethod('get_safe_local_file_path');
        $method->setAccessible(true);

        // Try to access something outside ABSPATH
        $outside_file = sys_get_temp_dir() . '/outside.csv';
        file_put_contents($outside_file, "content");

        $result = $method->invokeArgs($importer, [$outside_file]);
        $this->assertNull($result);

        unlink($outside_file);
    }

    // ============================================
    // HEADER MAPPING TESTS
    // ============================================

    public function test_get_field_key_with_explicit_overrides()
    {
        $importer = new AV_Petitioner_CSV_Importer([
            'field_overrides' => ['E-mail Address' => 'email']
        ]);

        $reflection = new ReflectionClass($importer);
        $method = $reflection->getMethod('get_field_key');
        $method->setAccessible(true);

        $result = $method->invokeArgs($importer, ['E-mail Address', []]);
        $this->assertEquals('email', $result);
    }

    public function test_get_field_key_matches_allowed_system_fields()
    {
        $importer = new AV_Petitioner_CSV_Importer();
        $reflection = new ReflectionClass($importer);
        $method = $reflection->getMethod('get_field_key');
        $method->setAccessible(true);

        $result = $method->invokeArgs($importer, [' FNAME ' /* Trims and lowercases automatically */, []]);
        $this->assertEquals('fname', $result);
    }
}
