<?php

use WorDBless\BaseTestCase;

class Test_CSV_Column_Config extends BaseTestCase
{
    public function test_resolve_applies_hidden_label_and_mappings()
    {
        $payload = [
            [
                'id' => 'email',
                'label' => 'Email',
                'overrides' => [
                    'hidden' => true,
                ],
            ],
            [
                'id' => 'fname',
                'label' => 'First name',
                'overrides' => [
                    'label' => 'First Name',
                ],
            ],
            [
                'id' => 'newsletter',
                'label' => 'Newsletter',
                'overrides' => [
                    'mappings' => [
                        ['raw_value' => '0', 'mapped_value' => 'No'],
                        ['raw_value' => '1', 'mapped_value' => 'Yes'],
                    ],
                ],
            ],
        ];

        $resolved = AV_Petitioner_Column_Config::resolve(1, $payload);

        $this->assertNotContains('email', $resolved['visible_columns']);
        $this->assertEquals('First Name', $resolved['labels']['fname']);
        $this->assertEquals([
            ['raw' => '0', 'mapped' => 'No'],
            ['raw' => '1', 'mapped' => 'Yes'],
        ], $resolved['mappings']['newsletter']);
    }

    public function test_resolve_drops_invalid_ids()
    {
        $payload = [
            [
                'id' => 'fake_field',
                'overrides' => [
                    'label' => 'Should not be used',
                ],
            ],
            [
                'id' => 'custom_properties',
                'overrides' => [
                    'hidden' => true,
                ],
            ],
        ];

        $resolved = AV_Petitioner_Column_Config::resolve(1, $payload);

        $this->assertNotContains('custom_properties', $resolved['visible_columns']);
        $this->assertArrayNotHasKey('fake_field', $resolved['labels']);
        $this->assertArrayNotHasKey('fake_field', $resolved['mappings']);
    }

    public function test_sanitize_payload_json_returns_empty_string_for_invalid_json()
    {
        $sanitized = AV_Petitioner_Column_Config::sanitize_payload_json('{invalid json}');
        $this->assertSame('', $sanitized);
    }

    public function test_sanitize_payload_json_keeps_only_allowed_values()
    {
        $payload = wp_json_encode([
            [
                'id' => 'fname',
                'label' => '<b>First name</b>',
                'overrides' => [
                    'label' => '<script>alert(1)</script>First Name',
                    'hidden' => false,
                    'mappings' => [
                        ['raw_value' => 0, 'mapped_value' => 'No'],
                        ['raw_value' => '1', 'mapped_value' => 'Yes'],
                        ['raw_value' => ['bad'], 'mapped_value' => 'Ignored'],
                    ],
                ],
            ],
            [
                'id' => 'custom_properties',
                'overrides' => [
                    'hidden' => true,
                ],
            ],
        ]);

        $sanitized_json = AV_Petitioner_Column_Config::sanitize_payload_json($payload);
        $decoded = json_decode(wp_unslash($sanitized_json), true);

        $this->assertCount(1, $decoded);
        $this->assertSame('fname', $decoded[0]['id']);
        $this->assertSame('First name', $decoded[0]['label']);
        $this->assertSame('First Name', $decoded[0]['overrides']['label']);
        $this->assertCount(2, $decoded[0]['overrides']['mappings']);
    }
}
