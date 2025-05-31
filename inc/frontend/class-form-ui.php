<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class AV_Petitioner_Form_UI
{

    public string|float $form_id;
    public array $country_list;
    public bool $show_country;
    public bool $send_to_representative;
    public bool $add_consent_checkbox;
    public bool $add_legal_text;
    public string $legal_text;
    public bool $add_honeypot;
    public string $consent_text;
    public array $form_fields;
    public $field_order;
    public $nonce;

    public function __construct($form_id)
    {
        $this->form_id                  = $form_id;
        $this->nonce                    = wp_create_nonce('petitioner_form_nonce');
        $this->send_to_representative   = get_post_meta($this->form_id, '_petitioner_send_to_representative', true);
        $this->show_country             = get_post_meta($this->form_id, '_petitioner_show_country', true);
        $this->add_legal_text           = get_post_meta($this->form_id, '_petitioner_add_legal_text', true);
        $this->legal_text               = get_post_meta($this->form_id, '_petitioner_legal_text', true);
        $this->add_consent_checkbox     = get_post_meta($this->form_id, '_petitioner_add_consent_checkbox', true);
        $this->consent_text             = get_post_meta($this->form_id, '_petitioner_consent_text', true);
        $this->add_honeypot             = get_post_meta($this->form_id, '_petitioner_add_honeypot', true);
        $this->form_fields              = get_post_meta($this->form_id, '_petitioner_form_fields', false);
        $this->field_order              = get_post_meta($this->form_id, '_petitioner_field_order', true);
        $this->country_list             = av_petitioner_get_countries();
    }

    public function render(): void
    {
?>

        <form id="petitioner-form-<?php echo esc_attr($this->form_id); ?>" method="get"
            action="<?php echo esc_attr(admin_url('admin-ajax.php') . '?action=petitioner_form_submit'); ?>">

            <div class="petitioner__input">
                <label for="petitioner_fname"><?php esc_html_e('First name', 'petitioner'); ?></label>
                <input required type="text" id="petitioner_fname" name="petitioner_fname">
            </div>

            <div class="petitioner__input">
                <label for="petitioner_lname"><?php esc_html_e('Last name', 'petitioner'); ?></label>
                <input required type="text" id="petitioner_lname" name="petitioner_lname">
            </div>

            <div class="petitioner__input">
                <label for="petitioner_email"><?php esc_html_e('Your email', 'petitioner'); ?></label>
                <input required type="email" id="petitioner_email" name="petitioner_email">
            </div>

            <?php if ($this->show_country): ?>
                <div class="petitioner__input">
                    <label for="petitioner_country"><?php esc_html_e('Country', 'petitioner'); ?></label>
                    <select required id="petitioner_country" name="petitioner_country">
                        <option value="" default disabled><?php esc_html_e('Country', 'petitioner'); ?></option>
                        <?php foreach ($this->country_list as $country): ?>
                            <option value="<?php echo $country; ?>">
                                <?php echo $country; ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
            <?php endif; ?>

            <?php if ($this->send_to_representative): ?>
                <div class="petitioner__input petitioner__input--checkbox">
                    <label for="petitioner_bcc"><?php esc_html_e('BCC me on the email', 'petitioner'); ?></label>
                    <input type="checkbox" id="petitioner_bcc" name="petitioner_bcc">
                </div>
            <?php endif; ?>

            <?php if ($this->add_consent_checkbox): ?>
                <div class="petitioner__input petitioner__input--checkbox">
                    <label for="petitioner_accept_tos">
                        <?php echo !empty($this->consent_text) ? wp_kses_post($this->consent_text) : __('By submitting this form, I agree to the terms of service', 'petitioner'); ?>
                    </label>
                    <input type="checkbox" id="petitioner_accept_tos" name="petitioner_accept_tos">
                </div>
            <?php endif; ?>

            <input type="hidden" name="form_id" value="<?php echo esc_attr($this->form_id); ?>" />
            <input type="hidden" name="nonce" value="<?php echo esc_attr($this->nonce); ?>" />

            <?php if ($this->add_legal_text): ?>
                <div class="petitioner-legal petitioner-disclaimer-text">
                    <?php
                    $parsed_legal = wpautop($this->legal_text);
                    echo !empty($parsed_legal) ? wp_kses_post($parsed_legal) : ''; ?>
                </div>
            <?php endif; ?>

            <?php AV_Petitioner_Captcha::render_inputs(); ?>

            <?php if ($this->add_honeypot): ?>
                <input type="text" name="ptr_info" style="display:none" />
            <?php endif; ?>

            <button type="submit" class="petitioner__btn petitioner__btn--submit"><?php esc_html_e('Sign this petition', 'petitioner'); ?></button>
        </form>
    <?php
    }

    /**
     * Render the form fields, captchas, etc.
     * @return void
     */
    public function render_fields(): void
    {
        $form_fields    = $this->form_fields[0];
        $form_fields    = json_decode($form_fields, true);
        $action         = admin_url('admin-ajax.php') . '?action=petitioner_form_submit';

        // Use field_order if available, otherwise fallback to array keys of $form_fields
        if (!empty($this->field_order)) {
            $field_order = json_decode($this->field_order);
        } elseif (is_array($form_fields)) {
            $field_order = array_keys($form_fields);
        } else {
            $field_order = [];
        }


        /**
         * Filter to modify the form fields before rendering.
         *
         * This allows plugins or themes to add, remove, or modify fields.
         *
         * @param array $form_fields Array of form fields.
         * @param int $form_id ID of the form being rendered.
         * @return array Modified form fields.
         */
        $form_fields    = apply_filters('av_petitioner_form_fields', $form_fields, $this->form_id);

        /**
         * Filter to modify the order of form fields before rendering.
         *
         * This allows plugins or themes to reorder the fields displayed in the form.
         * The values in the array should match the keys in the `$form_fields` array.
         * Any missing or extra keys will be ignored during rendering.
         *
         * @example
         * add_filter('av_petitioner_field_order', function($order, $form_id) {
         *     return ['fname', 'lname', 'email', 'country', 'submit'];
         * }, 10, 2);
         *
         * @param array $field_order Array of field keys in the desired display order.
         * @param int   $form_id     ID of the form being rendered.
         * @return array Modified field order array.
         */
        $field_order    = apply_filters('av_petitioner_field_order', $field_order, $this->form_id);
    ?>
        <form
            id="petitioner-form-<?php echo esc_attr($this->form_id); ?>"
            method="get"
            action="<?php echo esc_attr($action); ?>">

            <?php
            if (is_array($form_fields) && is_array($field_order)) {
                foreach ($field_order as $key) {
                    $field      = $form_fields[$key] ?? [];
                    $field_type = !empty($field['type']) ? esc_html($field['type']) : '';

                    if ($field_type === 'checkbox') {
                        $this->render_checkbox_field($key, $field);
                    } elseif ($field_type === 'submit') {
                        $this->render_submit($field);
                    } elseif ($field_type === 'select') {
                        $this->render_select_field($key, $field);
                    } elseif ($field_type === 'wysiwyg') {
                        $this->render_wysiwyg_field($key, $field);
                    } else {
                        $this->render_basic_field($key, $field);
                    }
                }
            }
            ?>

            <input type="hidden" name="form_id" value="<?php echo esc_attr($this->form_id); ?>">
            <input type="hidden" name="nonce" value="<?php echo esc_attr($this->nonce); ?>" />

            <?php AV_Petitioner_Captcha::render_inputs(); ?>

            <?php if ($this->add_honeypot): ?>
                <input type="text" name="ptr_info" style="display:none" />
            <?php endif; ?>

        </form>
    <?php
    }

    /**
     * Render a basic field
     * 
     * Handles text, email, number, etc.
     */
    public function render_basic_field(string $name, array $field): void
    {
        $field_type     = !empty($field['type']) ? esc_html($field['type']) : 'text';
        $field_label    = !empty($field['label']) ? esc_html($field['label']) : '';
        $required       = !empty($field['required']) ? 'required' : '';
        $field_name     = !empty($name) ? 'petitioner_' . esc_attr($name) : '';

        $extra_attributes = '';

        if ($field_type === 'tel') {
            $extra_attributes = ' title="" pattern="[0-9\s\-\(\)]*"';
        }

        /**
         * Filter to add extra HTML attributes to form fields.
         *
         * This can be used to add attributes like `pattern`, `title`, `maxlength`, etc.
         *
         * @example
         * add_filter('av_petitioner_field_extra_attributes', function($attributes, $type, $name, $label) {
         *     if ($type === 'tel') {
         *         $attributes .= ' pattern="[0-9\s\-\(\)]*" title="Please enter a valid phone number"';
         *     }
         *     return $attributes;
         * }, 10, 4);
         *
         * @param string $extra_attributes Extra attributes to be added to the field markup.
         * @param string $field_type       Type of the field (e.g., text, email, number, tel).
         * @param string $field_name       Name (key) of the field.
         * @param string $field_label      Human-readable label of the field.
         * @return string Modified extra attributes string.
         */
        $extra_attributes = apply_filters('av_petitioner_field_extra_attributes', $extra_attributes, $field_type, $field_name, $field_label);
    ?>
        <div class="petitioner__input">
            <label for="<?php echo $field_name; ?>">
                <?php echo $field_label; ?>
            </label>
            <input
                <?php echo $required; ?>
                type="<?php echo esc_attr($field_type) ?>"
                id="<?php echo $field_name; ?>"
                name="<?php echo $field_name; ?>">
        </div>

    <?php
    }

    public function render_checkbox_field(string $name, array $field): void
    {
        $field_label = !empty($field['label']) ? esc_html($field['label']) : '';
        $field_name  = !empty($name) ? 'petitioner_' . esc_attr($name) : '';
    ?>
        <div class="petitioner__input petitioner__input--checkbox">
            <label for="<?php echo $field_name; ?>">
                <?php echo $field_label; ?>
            </label>
            <input type="checkbox" id="<?php echo $field_name; ?>" name="<?php echo $field_name; ?>">
        </div>
    <?php
    }

    public function render_select_field(string $name, array $field): void
    {
        $field_label = !empty($field['label']) ? esc_html($field['label']) : '';
        $field_name  = !empty($name) ? 'petitioner_' . esc_attr($name) : '';
        if ($name === 'country') {
            $options = $this->country_list;
        } else {
            $options = !empty($field['options']) ? esc_html($field['options']) : [];
        }
    ?>
        <div class="petitioner__input">
            <label for="<?php echo $field_name; ?>">
                <?php echo $field_label; ?>
            </label>
            <select id="<?php echo $field_name; ?>" name="<?php echo $field_name; ?>">
                <option value="" default disabled><?php esc_html_e('Select', 'petitioner'); ?></option>
                <?php foreach ($options as $option): ?>
                    <option value="<?php echo esc_attr($option); ?>">
                        <?php echo esc_html($option); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </div>
    <?php
    }

    public function render_wysiwyg_field(string $name, array $field): void
    {
        $field_name  = !empty($name) ? 'petitioner_' . esc_attr($name) : '';
        $field_value = !empty($field['value']) ? wp_kses_post($field['value']) : '';
    ?>
        <div
            id="<?php echo $field_name; ?>"
            class="<?php echo $field_name; ?> petitioner-disclaimer-text">
            <?php echo $field_value; ?>
        </div>
    <?php
    }

    public function render_submit(array $field): void
    {
        $field_label = !empty($field['label']) ? esc_html($field['label']) : esc_html('Sign this petition', 'petitioner');
    ?>
        <button type="submit" class="petitioner__btn petitioner__btn--submit">
            <?php echo $field_label; ?>
        </button>
<?php
    }
}
