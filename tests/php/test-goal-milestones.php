<?php

use WorDBless\BaseTestCase;

class Test_Goal_Milestones extends BaseTestCase
{
    // ============================================
    // NORMALIZE TESTS
    // ============================================

    public function test_normalize_legacy_integer()
    {
        $result = AV_Petitioner_Goal_Milestones::normalize(500);
        $this->assertEquals([['value' => 500, 'count_start' => 0]], $result);
    }

    public function test_normalize_legacy_numeric_string()
    {
        $result = AV_Petitioner_Goal_Milestones::normalize('250');
        $this->assertEquals([['value' => 250, 'count_start' => 0]], $result);
    }

    public function test_normalize_json_string_single_milestone()
    {
        $json = json_encode([['value' => 100, 'count_start' => 0]]);
        $result = AV_Petitioner_Goal_Milestones::normalize($json);

        $this->assertCount(1, $result);
        $this->assertEquals(100, $result[0]['value']);
        $this->assertEquals(0, $result[0]['count_start']);
    }

    public function test_normalize_json_string_multiple_milestones()
    {
        $json = json_encode([
            ['value' => 500, 'count_start' => 100],
            ['value' => 100, 'count_start' => 0],
        ]);
        $result = AV_Petitioner_Goal_Milestones::normalize($json);

        $this->assertCount(2, $result);
        // Should be sorted by count_start ascending
        $this->assertEquals(0, $result[0]['count_start']);
        $this->assertEquals(100, $result[0]['value']);
        $this->assertEquals(100, $result[1]['count_start']);
        $this->assertEquals(500, $result[1]['value']);
    }

    public function test_normalize_array_passthrough()
    {
        $milestones = [
            ['value' => 200, 'count_start' => 0],
            ['value' => 1000, 'count_start' => 200],
        ];
        $result = AV_Petitioner_Goal_Milestones::normalize($milestones);

        $this->assertCount(2, $result);
        $this->assertEquals(200, $result[0]['value']);
        $this->assertEquals(1000, $result[1]['value']);
    }

    public function test_normalize_sorts_by_count_start()
    {
        $milestones = [
            ['value' => 1000, 'count_start' => 500],
            ['value' => 100, 'count_start' => 0],
            ['value' => 500, 'count_start' => 100],
        ];
        $result = AV_Petitioner_Goal_Milestones::normalize($milestones);

        $this->assertEquals(0, $result[0]['count_start']);
        $this->assertEquals(100, $result[1]['count_start']);
        $this->assertEquals(500, $result[2]['count_start']);
    }

    public function test_normalize_empty_string_returns_fallback()
    {
        $result = AV_Petitioner_Goal_Milestones::normalize('');
        $this->assertEquals([['value' => 0, 'count_start' => 0]], $result);
    }

    public function test_normalize_null_returns_fallback()
    {
        $result = AV_Petitioner_Goal_Milestones::normalize(null);
        $this->assertEquals([['value' => 0, 'count_start' => 0]], $result);
    }

    public function test_normalize_invalid_json_returns_fallback()
    {
        $result = AV_Petitioner_Goal_Milestones::normalize('not-json');
        $this->assertEquals([['value' => 0, 'count_start' => 0]], $result);
    }

    public function test_normalize_skips_non_array_entries()
    {
        $milestones = [
            ['value' => 100, 'count_start' => 0],
            'invalid',
            42,
            ['value' => 500, 'count_start' => 100],
        ];
        $result = AV_Petitioner_Goal_Milestones::normalize($milestones);

        $this->assertCount(2, $result);
    }

    public function test_normalize_empty_array_gets_default_milestone()
    {
        $result = AV_Petitioner_Goal_Milestones::normalize([]);
        $this->assertCount(1, $result);
        $this->assertEquals(0, $result[0]['value']);
        $this->assertEquals(0, $result[0]['count_start']);
    }

    public function test_normalize_coerces_missing_keys_to_zero()
    {
        $milestones = [['value' => 300]]; // missing count_start
        $result = AV_Petitioner_Goal_Milestones::normalize($milestones);

        $this->assertEquals(300, $result[0]['value']);
        $this->assertEquals(0, $result[0]['count_start']);
    }

    // ============================================
    // RESOLVE_ACTIVE_GOAL TESTS
    // ============================================

    public function test_resolve_active_goal_single_milestone()
    {
        $milestones = [['value' => 100, 'count_start' => 0]];
        $this->assertEquals(100, AV_Petitioner_Goal_Milestones::resolve_active_goal($milestones, 0));
        $this->assertEquals(100, AV_Petitioner_Goal_Milestones::resolve_active_goal($milestones, 50));
        $this->assertEquals(100, AV_Petitioner_Goal_Milestones::resolve_active_goal($milestones, 999));
    }

    public function test_resolve_active_goal_selects_correct_milestone()
    {
        $milestones = [
            ['value' => 100, 'count_start' => 0],
            ['value' => 500, 'count_start' => 100],
            ['value' => 1000, 'count_start' => 500],
        ];

        // Below first threshold
        $this->assertEquals(100, AV_Petitioner_Goal_Milestones::resolve_active_goal($milestones, 0));
        // At the first threshold
        $this->assertEquals(100, AV_Petitioner_Goal_Milestones::resolve_active_goal($milestones, 50));
        // Exactly at second threshold
        $this->assertEquals(500, AV_Petitioner_Goal_Milestones::resolve_active_goal($milestones, 100));
        // Between second and third
        $this->assertEquals(500, AV_Petitioner_Goal_Milestones::resolve_active_goal($milestones, 300));
        // Exactly at third threshold
        $this->assertEquals(1000, AV_Petitioner_Goal_Milestones::resolve_active_goal($milestones, 500));
        // Well past all thresholds
        $this->assertEquals(1000, AV_Petitioner_Goal_Milestones::resolve_active_goal($milestones, 9999));
    }

    public function test_resolve_active_goal_empty_milestones_returns_zero()
    {
        $this->assertEquals(0, AV_Petitioner_Goal_Milestones::resolve_active_goal([], 100));
    }

    public function test_resolve_active_goal_count_exactly_at_boundary()
    {
        $milestones = [
            ['value' => 100, 'count_start' => 0],
            ['value' => 500, 'count_start' => 100],
        ];

        // count_start is inclusive (>=), so count 100 should activate the second milestone
        $this->assertEquals(500, AV_Petitioner_Goal_Milestones::resolve_active_goal($milestones, 100));
    }

    public function test_resolve_active_goal_count_one_below_boundary()
    {
        $milestones = [
            ['value' => 100, 'count_start' => 0],
            ['value' => 500, 'count_start' => 100],
        ];

        $this->assertEquals(100, AV_Petitioner_Goal_Milestones::resolve_active_goal($milestones, 99));
    }

    // ============================================
    // SANITIZE_JSON TESTS
    // ============================================

    public function test_sanitize_json_valid_milestones()
    {
        $input = json_encode([
            ['value' => 100, 'count_start' => 0],
            ['value' => 500, 'count_start' => 100],
        ]);

        $result = AV_Petitioner_Goal_Milestones::sanitize_json($input);
        $decoded = json_decode($result, true);

        $this->assertCount(2, $decoded);
        $this->assertEquals(100, $decoded[0]['value']);
        $this->assertEquals(500, $decoded[1]['value']);
    }

    public function test_sanitize_json_sorts_output()
    {
        $input = json_encode([
            ['value' => 500, 'count_start' => 100],
            ['value' => 100, 'count_start' => 0],
        ]);

        $result = AV_Petitioner_Goal_Milestones::sanitize_json($input);
        $decoded = json_decode($result, true);

        $this->assertEquals(0, $decoded[0]['count_start']);
        $this->assertEquals(100, $decoded[1]['count_start']);
    }

    public function test_sanitize_json_legacy_numeric_input()
    {
        $result = AV_Petitioner_Goal_Milestones::sanitize_json('500');
        $decoded = json_decode($result, true);

        $this->assertCount(1, $decoded);
        $this->assertEquals(500, $decoded[0]['value']);
        $this->assertEquals(0, $decoded[0]['count_start']);
    }

    public function test_sanitize_json_legacy_integer_input()
    {
        $result = AV_Petitioner_Goal_Milestones::sanitize_json(300);
        $decoded = json_decode($result, true);

        $this->assertCount(1, $decoded);
        $this->assertEquals(300, $decoded[0]['value']);
        $this->assertEquals(0, $decoded[0]['count_start']);
    }

    public function test_sanitize_json_invalid_json_returns_default()
    {
        $result = AV_Petitioner_Goal_Milestones::sanitize_json('not-json');
        $decoded = json_decode($result, true);

        $this->assertCount(1, $decoded);
        $this->assertEquals(0, $decoded[0]['value']);
        $this->assertEquals(0, $decoded[0]['count_start']);
    }

    public function test_sanitize_json_strips_extra_keys()
    {
        $input = json_encode([
            ['value' => 100, 'count_start' => 0, 'malicious' => '<script>'],
        ]);

        $result = AV_Petitioner_Goal_Milestones::sanitize_json($input);
        $decoded = json_decode($result, true);

        $this->assertArrayNotHasKey('malicious', $decoded[0]);
        $this->assertArrayHasKey('value', $decoded[0]);
        $this->assertArrayHasKey('count_start', $decoded[0]);
    }

    public function test_sanitize_json_coerces_negative_values_to_zero()
    {
        $input = json_encode([
            ['value' => -50, 'count_start' => -10],
        ]);

        $result = AV_Petitioner_Goal_Milestones::sanitize_json($input);
        $decoded = json_decode($result, true);

        // absint() should make negatives into 0 (or positive)
        $this->assertGreaterThanOrEqual(0, $decoded[0]['value']);
        $this->assertGreaterThanOrEqual(0, $decoded[0]['count_start']);
    }

    public function test_sanitize_json_returns_valid_json_string()
    {
        $input = json_encode([['value' => 100, 'count_start' => 0]]);
        $result = AV_Petitioner_Goal_Milestones::sanitize_json($input);

        $this->assertIsString($result);
        $this->assertNotNull(json_decode($result));
        $this->assertEquals(JSON_ERROR_NONE, json_last_error());
    }
}
