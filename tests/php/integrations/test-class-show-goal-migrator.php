<?php

use WorDBless\BaseTestCase;

class Test_Show_Goal_Migrator extends BaseTestCase
{
    private $petition_ids = [];

    public function tear_down()
    {
        remove_filter('wordbless_wpdb_query_results', [$this, 'filter_petition_query'], 20);
        $this->petition_ids = [];
        delete_option('petitioner_plugin_version');
        parent::tear_down();
    }

    public function test_migration_turns_goal_display_on_for_existing_petitions()
    {
        $with_zero = $this->make_form();
        $without_meta = $this->make_form();
        update_post_meta($with_zero, '_petitioner_show_goal', 0);
        $this->stub_petition_query([$with_zero, $without_meta]);

        AV_Petitioner_Show_Goal_Migrator::migrate_existing_petitions();

        $this->assertSame(1, (int) get_post_meta($with_zero, '_petitioner_show_goal', true));
        $this->assertSame(1, (int) get_post_meta($without_meta, '_petitioner_show_goal', true));
    }

    public function test_upgrade_to_0_8_8_runs_the_migration_once()
    {
        global $petitioner_setup;

        $form_id = $this->make_form();
        update_post_meta($form_id, '_petitioner_show_goal', 0);
        $this->stub_petition_query([$form_id]);
        update_option('petitioner_plugin_version', '0.8.7');

        $petitioner_setup->on_plugins_loaded();

        $this->assertSame(1, (int) get_post_meta($form_id, '_petitioner_show_goal', true));
        $this->assertSame('0.8.8', get_option('petitioner_plugin_version'));

        update_post_meta($form_id, '_petitioner_show_goal', 0);
        $petitioner_setup->on_plugins_loaded();

        $this->assertSame(0, (int) get_post_meta($form_id, '_petitioner_show_goal', true));
    }

    private function make_form()
    {
        return wp_insert_post([
            'post_type'   => 'petitioner-petition',
            'post_status' => 'publish',
        ]);
    }

    private function stub_petition_query(array $ids)
    {
        $this->petition_ids = $ids;
        add_filter('wordbless_wpdb_query_results', [$this, 'filter_petition_query'], 20, 2);
    }

    public function filter_petition_query($results, $query)
    {
        if (!is_string($query) || strpos($query, "petitioner-petition") === false) {
            return $results;
        }

        return array_map(function ($id) {
            return (object) ['ID' => $id];
        }, $this->petition_ids);
    }
}
