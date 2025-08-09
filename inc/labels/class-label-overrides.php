<?php

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * 
 */
class AV_Petitioner_Label_Overrides
{
    public $label_overrides = [];

    public function __construct()
    {
        $label_overrides_raw    = get_option('petitioner_label_overrides', '{}');
        $this->label_overrides  = ($decoded = json_decode($label_overrides_raw)) && json_last_error() === JSON_ERROR_NONE ? $decoded : [];

        if (empty($this->label_overrides)) return;

        add_action('av_petitioner_labels_defaults', array($this, 'get_label_overrides'));
    }

    public function get_label_overrides($defaults)
    {
        $final_defaults = $defaults;

        foreach ($this->label_overrides as $k => $v) {
            if (array_key_exists($k, $final_defaults)) {
                $final_defaults[$k] = $v;
            }
        }

        return $final_defaults;
    }
}
