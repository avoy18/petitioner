<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Turns per-petition goal and letter display on for petitions saved before those choices existed.
 */
class AV_Petitioner_Show_Goal_Migrator
{
    public static function migrate_existing_petitions()
    {
        $form_ids = get_posts([
            'post_type'   => 'petitioner-petition',
            'numberposts' => -1,
            'fields'      => 'ids',
            'post_status' => 'any',
        ]);

        foreach ($form_ids as $form_id) {
            update_post_meta($form_id, '_petitioner_show_goal', 1);
            update_post_meta($form_id, '_petitioner_show_letter', 1);
        }
    }
}
