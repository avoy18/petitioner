<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Turns the per-petition goal display on for petitions saved before that choice existed.
 *
 * Those saves stored 0 because the field had no editor control.
 */
class AV_Petitioner_Show_Goal_Migrator
{
    public static function migrate_existing_petitions()
    {
        $forms = get_posts([
            'post_type'   => 'petitioner-petition',
            'numberposts' => 1000,
            'post_status' => 'any',
        ]);

        foreach ($forms as $form) {
            update_post_meta($form->ID, '_petitioner_show_goal', 1);
        }
    }
}
