<?php

/**
 * A list of useful utility functions for the plugin.
 */

/**
 * Country code => English name.
 *
 * @return array<string, string>
 */
function av_petitioner_get_country_codes(): array
{
    return [
        'af' => 'Afghanistan',
        'al' => 'Albania',
        'dz' => 'Algeria',
        'ad' => 'Andorra',
        'ao' => 'Angola',
        'ag' => 'Antigua & Deps',
        'ar' => 'Argentina',
        'am' => 'Armenia',
        'au' => 'Australia',
        'at' => 'Austria',
        'az' => 'Azerbaijan',
        'bs' => 'Bahamas',
        'bh' => 'Bahrain',
        'bd' => 'Bangladesh',
        'bb' => 'Barbados',
        'by' => 'Belarus',
        'be' => 'Belgium',
        'bz' => 'Belize',
        'bj' => 'Benin',
        'bt' => 'Bhutan',
        'bo' => 'Bolivia',
        'ba' => 'Bosnia Herzegovina',
        'bw' => 'Botswana',
        'br' => 'Brazil',
        'bn' => 'Brunei',
        'bg' => 'Bulgaria',
        'bf' => 'Burkina',
        'bi' => 'Burundi',
        'kh' => 'Cambodia',
        'cm' => 'Cameroon',
        'ca' => 'Canada',
        'cv' => 'Cape Verde',
        'cf' => 'Central African Rep',
        'td' => 'Chad',
        'cl' => 'Chile',
        'cn' => 'China',
        'co' => 'Colombia',
        'km' => 'Comoros',
        'cg' => 'Congo',
        'cd' => 'Congo {Democratic Rep}',
        'cr' => 'Costa Rica',
        'hr' => 'Croatia',
        'cu' => 'Cuba',
        'cy' => 'Cyprus',
        'cz' => 'Czech Republic',
        'dk' => 'Denmark',
        'dj' => 'Djibouti',
        'dm' => 'Dominica',
        'do' => 'Dominican Republic',
        'tl' => 'East Timor',
        'ec' => 'Ecuador',
        'eg' => 'Egypt',
        'sv' => 'El Salvador',
        'gq' => 'Equatorial Guinea',
        'er' => 'Eritrea',
        'ee' => 'Estonia',
        'et' => 'Ethiopia',
        'fj' => 'Fiji',
        'fi' => 'Finland',
        'fr' => 'France',
        'ga' => 'Gabon',
        'gm' => 'Gambia',
        'ge' => 'Georgia',
        'de' => 'Germany',
        'gh' => 'Ghana',
        'gr' => 'Greece',
        'gd' => 'Grenada',
        'gt' => 'Guatemala',
        'gn' => 'Guinea',
        'gw' => 'Guinea-Bissau',
        'gy' => 'Guyana',
        'ht' => 'Haiti',
        'hn' => 'Honduras',
        'hu' => 'Hungary',
        'is' => 'Iceland',
        'in' => 'India',
        'id' => 'Indonesia',
        'ir' => 'Iran',
        'iq' => 'Iraq',
        'ie' => 'Ireland {Republic}',
        'il' => 'Israel',
        'it' => 'Italy',
        'ci' => 'Ivory Coast',
        'jm' => 'Jamaica',
        'jp' => 'Japan',
        'jo' => 'Jordan',
        'kz' => 'Kazakhstan',
        'ke' => 'Kenya',
        'ki' => 'Kiribati',
        'kp' => 'Korea North',
        'kr' => 'Korea South',
        'xk' => 'Kosovo',
        'kw' => 'Kuwait',
        'kg' => 'Kyrgyzstan',
        'la' => 'Laos',
        'lv' => 'Latvia',
        'lb' => 'Lebanon',
        'ls' => 'Lesotho',
        'lr' => 'Liberia',
        'ly' => 'Libya',
        'li' => 'Liechtenstein',
        'lt' => 'Lithuania',
        'lu' => 'Luxembourg',
        'mk' => 'Macedonia',
        'mg' => 'Madagascar',
        'mw' => 'Malawi',
        'my' => 'Malaysia',
        'mv' => 'Maldives',
        'ml' => 'Mali',
        'mt' => 'Malta',
        'mh' => 'Marshall Islands',
        'mr' => 'Mauritania',
        'mu' => 'Mauritius',
        'mx' => 'Mexico',
        'fm' => 'Micronesia',
        'md' => 'Moldova',
        'mc' => 'Monaco',
        'mn' => 'Mongolia',
        'me' => 'Montenegro',
        'ma' => 'Morocco',
        'mz' => 'Mozambique',
        'mm' => 'Myanmar, {Burma}',
        'na' => 'Namibia',
        'nr' => 'Nauru',
        'np' => 'Nepal',
        'nl' => 'Netherlands',
        'nz' => 'New Zealand',
        'ni' => 'Nicaragua',
        'ne' => 'Niger',
        'ng' => 'Nigeria',
        'no' => 'Norway',
        'om' => 'Oman',
        'pk' => 'Pakistan',
        'pw' => 'Palau',
        'pa' => 'Panama',
        'pg' => 'Papua New Guinea',
        'py' => 'Paraguay',
        'pe' => 'Peru',
        'ph' => 'Philippines',
        'pl' => 'Poland',
        'pt' => 'Portugal',
        'qa' => 'Qatar',
        'ro' => 'Romania',
        'ru' => 'Russian Federation',
        'rw' => 'Rwanda',
        'kn' => 'St Kitts & Nevis',
        'lc' => 'St Lucia',
        'vc' => 'Saint Vincent & the Grenadines',
        'ws' => 'Samoa',
        'sm' => 'San Marino',
        'st' => 'Sao Tome & Principe',
        'sa' => 'Saudi Arabia',
        'sn' => 'Senegal',
        'rs' => 'Serbia',
        'sc' => 'Seychelles',
        'sl' => 'Sierra Leone',
        'sg' => 'Singapore',
        'sk' => 'Slovakia',
        'si' => 'Slovenia',
        'sb' => 'Solomon Islands',
        'so' => 'Somalia',
        'za' => 'South Africa',
        'ss' => 'South Sudan',
        'es' => 'Spain',
        'lk' => 'Sri Lanka',
        'sd' => 'Sudan',
        'sr' => 'Suriname',
        'sz' => 'Swaziland',
        'se' => 'Sweden',
        'ch' => 'Switzerland',
        'sy' => 'Syria',
        'tw' => 'Taiwan',
        'tj' => 'Tajikistan',
        'tz' => 'Tanzania',
        'th' => 'Thailand',
        'tg' => 'Togo',
        'to' => 'Tonga',
        'tt' => 'Trinidad & Tobago',
        'tn' => 'Tunisia',
        'tr' => 'Turkey',
        'tm' => 'Turkmenistan',
        'tv' => 'Tuvalu',
        'ug' => 'Uganda',
        'ua' => 'Ukraine',
        'ae' => 'United Arab Emirates',
        'gb' => 'United Kingdom',
        'us' => 'United States',
        'uy' => 'Uruguay',
        'uz' => 'Uzbekistan',
        'vu' => 'Vanuatu',
        'va' => 'Vatican City',
        've' => 'Venezuela',
        'vn' => 'Vietnam',
        'ye' => 'Yemen',
        'zm' => 'Zambia',
        'zw' => 'Zimbabwe',
    ];
}

/**
 * Country name in the current language.
 *
 * @param string $code
 * @return string
 */
function av_petitioner_get_country_label($code): string
{
    $codes = av_petitioner_get_country_codes();

    if (!is_string($code) || !isset($codes[$code])) {
        return '';
    }

    $label = __($codes[$code], 'petitioner');

    return is_string($label) && $label !== '' ? $label : $codes[$code];
}

/**
 * Country choices for the current language.
 *
 * @return array<int, array{value: string, label: string}>
 */
function av_petitioner_get_countries(): array
{
    $countries = [];

    foreach (av_petitioner_get_country_codes() as $code => $name) {
        $countries[] = [
            'value' => $code,
            'label' => av_petitioner_get_country_label($code),
        ];
    }

    return $countries;
}

/**
 * Returns an associative array of fields and their user edited labels for the specific form
 */
function av_petitioner_get_form_labels($form_id = '', $label_ids = []): array
{
    $final_labels = [
        'name'          => AV_Petitioner_Labels::get('name')
    ];

    $form_fields = get_post_meta($form_id, '_petitioner_form_fields', true);

    $fields_parsed = json_decode($form_fields, true);

    if (!is_array($fields_parsed)) {
        av_ptr_error_log('Could not extract labels for the form # ' . $form_id);
        return [];
    }

    foreach ($label_ids as $id) {
        if (!empty($fields_parsed[$id]) && !empty($fields_parsed[$id]['label'])) {
            $final_labels[$id] = $fields_parsed[$id]['label'];
        }
    }

    $final_labels['submitted_at'] = AV_Petitioner_Labels::get('created_at');

    /**
     * Filter the form labels to add custom property labels
     *
     * @param array $labels - the labels array that is being returned from the get_form_labels method
     * @param int $form_id - the form id
     * @param array $label_ids - the label ids
     * @param array $fields_parsed - the JSON encoded fields parsed
     * @return array - the modified labels array with custom property labels appended
     */
    $final_labels = apply_filters('av_petitioner_get_form_labels', $final_labels, $form_id, $label_ids, $fields_parsed);

    return $final_labels;
}

/**
 * Parse conditional logic from raw JSON string
 * 
 * @param string|null $raw_json Raw JSON string from POST data
 * @return array|null Parsed conditional logic or null if invalid
 */
function av_petitioner_parse_conditional_logic($raw_json)
{
    if (empty($raw_json)) {
        return null;
    }

    $conditional_logic = json_decode($raw_json, true);

    // Validate JSON parsing
    if (json_last_error() !== JSON_ERROR_NONE) {
        av_ptr_error_log('Petitioner CSV Export: Invalid JSON in conditional_logic - ' . json_last_error_msg());
        return null;
    }

    if (!is_array($conditional_logic) || !isset($conditional_logic['conditions'])) {
        av_ptr_error_log('Petitioner CSV Export: Invalid conditional_logic structure');
        return null;
    }

    return $conditional_logic;
}

/**
 * Convert conditional logic to model query array
 * Supports: equals, not_equals, is_empty, is_not_empty, contains, does_not_contain
 * 
 * @param array|null $conditional_logic Parsed conditional logic
 * @return array Query array for model in format: [['field' => 'x', 'operator' => 'y', 'value' => 'z'], ...]
 */
function av_petitioner_build_model_query($conditional_logic)
{
    $query = [];

    if (!$conditional_logic || empty($conditional_logic['conditions'])) {
        return $query;
    }

    $supported_operators = ['equals', 'not_equals', 'is_empty', 'is_not_empty', 'contains', 'does_not_contain'];
    $ignored_operators = [];

    foreach ($conditional_logic['conditions'] as $condition) {
        if (
            !isset($condition['field']) ||
            !isset($condition['operator']) ||
            empty($condition['field'])
        ) {
            continue;
        }

        $operator = $condition['operator'];
        $field = $condition['field'];
        $value = isset($condition['value']) ? $condition['value'] : null;

        // Process supported operators
        $value_required_operators = ['equals', 'not_equals', 'contains', 'does_not_contain'];

        if (in_array($operator, $value_required_operators, true)) {
            if ($value !== '' && $value !== null) {
                $query[] = ['field' => $field, 'operator' => $operator, 'value' => $value];
            }
        } else if ($operator === 'is_empty' || $operator === 'is_not_empty') {
            $query[] = ['field' => $field, 'operator' => $operator, 'value' => null];
        } else if (!in_array($operator, $supported_operators) && !in_array($operator, $ignored_operators)) {
            // Track ignored operators for logging
            $ignored_operators[] = $operator;
        }
    }

    // Log ignored operators for debugging
    if (!empty($ignored_operators)) {
        av_ptr_error_log('Petitioner CSV Export: Ignoring unsupported operators: ' . implode(', ', $ignored_operators));
    }

    return $query;
}

/**
 * Returns the remote IP address of the client safely
 * @since 0.7.2
 * @return string
 */
function av_petitioner_get_remote_ip()
{
    return isset($_SERVER['REMOTE_ADDR'])
        ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR']))
        : '';
}

/**
 * Validates a redirect URL, enforcing a same-origin policy by default.
 * External redirects are stripped unless explicitly allowed via the
 * `petitioner_allow_external_redirects` filter for the given form.
 *
 * @param string $url     The URL to validate.
 * @param int    $form_id The ID of the form to pass to the filter.
 * @return string The validated URL, or an empty string if it fails validation.
 * 
 * @since 0.8.1
 */
function av_petitioner_get_validated_redirect_url($url, $form_id)
{
    if (empty($url)) {
        return '';
    }

    $allow_external = apply_filters('petitioner_allow_external_redirects', false, $form_id);
    
    $url = wp_sanitize_redirect($url);

    if (!$allow_external) {
        $url = wp_validate_redirect($url, '');
    }

    return $url;
}
