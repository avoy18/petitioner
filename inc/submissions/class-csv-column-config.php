<?php

/**
 * Handles column configuration for CSV exports
 * Applies label overrides, value mappings, and column visibility
 * 
 * @since 0.8.0
 * 
 * @example 
 * ```php
 * $config = new AV_Petitioner_Column_Config([
 *     'id'     => 'fname',
 *     'label'  => 'First Name',
 *     'overrides' => [
 *         'hidden' => true,
 *         'label' => 'Name!!',
 *     ],
 * ]);
 * ```
 * 
 * `
 */
class AV_Petitioner_Column_Config
{
    public function __construct($overrides = [])
    {
        $this->overrides = $overrides;
    }
}
