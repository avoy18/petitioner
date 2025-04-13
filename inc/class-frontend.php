<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class AV_Petitioner_Frontend
{

    public $country_list;

    public function __construct()
    {
        $this->country_list = [
            __("Afghanistan", "petitioner"),
            __("Albania", "petitioner"),
            __("Algeria", "petitioner"),
            __("Andorra", "petitioner"),
            __("Angola", "petitioner"),
            __("Antigua & Deps", "petitioner"),
            __("Argentina", "petitioner"),
            __("Armenia", "petitioner"),
            __("Australia", "petitioner"),
            __("Austria", "petitioner"),
            __("Azerbaijan", "petitioner"),
            __("Bahamas", "petitioner"),
            __("Bahrain", "petitioner"),
            __("Bangladesh", "petitioner"),
            __("Barbados", "petitioner"),
            __("Belarus", "petitioner"),
            __("Belgium", "petitioner"),
            __("Belize", "petitioner"),
            __("Benin", "petitioner"),
            __("Bhutan", "petitioner"),
            __("Bolivia", "petitioner"),
            __("Bosnia Herzegovina", "petitioner"),
            __("Botswana", "petitioner"),
            __("Brazil", "petitioner"),
            __("Brunei", "petitioner"),
            __("Bulgaria", "petitioner"),
            __("Burkina", "petitioner"),
            __("Burundi", "petitioner"),
            __("Cambodia", "petitioner"),
            __("Cameroon", "petitioner"),
            __("Canada", "petitioner"),
            __("Cape Verde", "petitioner"),
            __("Central African Rep", "petitioner"),
            __("Chad", "petitioner"),
            __("Chile", "petitioner"),
            __("China", "petitioner"),
            __("Colombia", "petitioner"),
            __("Comoros", "petitioner"),
            __("Congo", "petitioner"),
            __("Congo {Democratic Rep}", "petitioner"),
            __("Costa Rica", "petitioner"),
            __("Croatia", "petitioner"),
            __("Cuba", "petitioner"),
            __("Cyprus", "petitioner"),
            __("Czech Republic", "petitioner"),
            __("Denmark", "petitioner"),
            __("Djibouti", "petitioner"),
            __("Dominica", "petitioner"),
            __("Dominican Republic", "petitioner"),
            __("East Timor", "petitioner"),
            __("Ecuador", "petitioner"),
            __("Egypt", "petitioner"),
            __("El Salvador", "petitioner"),
            __("Equatorial Guinea", "petitioner"),
            __("Eritrea", "petitioner"),
            __("Estonia", "petitioner"),
            __("Ethiopia", "petitioner"),
            __("Fiji", "petitioner"),
            __("Finland", "petitioner"),
            __("France", "petitioner"),
            __("Gabon", "petitioner"),
            __("Gambia", "petitioner"),
            __("Georgia", "petitioner"),
            __("Germany", "petitioner"),
            __("Ghana", "petitioner"),
            __("Greece", "petitioner"),
            __("Grenada", "petitioner"),
            __("Guatemala", "petitioner"),
            __("Guinea", "petitioner"),
            __("Guinea-Bissau", "petitioner"),
            __("Guyana", "petitioner"),
            __("Haiti", "petitioner"),
            __("Honduras", "petitioner"),
            __("Hungary", "petitioner"),
            __("Iceland", "petitioner"),
            __("India", "petitioner"),
            __("Indonesia", "petitioner"),
            __("Iran", "petitioner"),
            __("Iraq", "petitioner"),
            __("Ireland {Republic}", "petitioner"),
            __("Israel", "petitioner"),
            __("Italy", "petitioner"),
            __("Ivory Coast", "petitioner"),
            __("Jamaica", "petitioner"),
            __("Japan", "petitioner"),
            __("Jordan", "petitioner"),
            __("Kazakhstan", "petitioner"),
            __("Kenya", "petitioner"),
            __("Kiribati", "petitioner"),
            __("Korea North", "petitioner"),
            __("Korea South", "petitioner"),
            __("Kosovo", "petitioner"),
            __("Kuwait", "petitioner"),
            __("Kyrgyzstan", "petitioner"),
            __("Laos", "petitioner"),
            __("Latvia", "petitioner"),
            __("Lebanon", "petitioner"),
            __("Lesotho", "petitioner"),
            __("Liberia", "petitioner"),
            __("Libya", "petitioner"),
            __("Liechtenstein", "petitioner"),
            __("Lithuania", "petitioner"),
            __("Luxembourg", "petitioner"),
            __("Macedonia", "petitioner"),
            __("Madagascar", "petitioner"),
            __("Malawi", "petitioner"),
            __("Malaysia", "petitioner"),
            __("Maldives", "petitioner"),
            __("Mali", "petitioner"),
            __("Malta", "petitioner"),
            __("Marshall Islands", "petitioner"),
            __("Mauritania", "petitioner"),
            __("Mauritius", "petitioner"),
            __("Mexico", "petitioner"),
            __("Micronesia", "petitioner"),
            __("Moldova", "petitioner"),
            __("Monaco", "petitioner"),
            __("Mongolia", "petitioner"),
            __("Montenegro", "petitioner"),
            __("Morocco", "petitioner"),
            __("Mozambique", "petitioner"),
            __("Myanmar, {Burma}", "petitioner"),
            __("Namibia", "petitioner"),
            __("Nauru", "petitioner"),
            __("Nepal", "petitioner"),
            __("Netherlands", "petitioner"),
            __("New Zealand", "petitioner"),
            __("Nicaragua", "petitioner"),
            __("Niger", "petitioner"),
            __("Nigeria", "petitioner"),
            __("Norway", "petitioner"),
            __("Oman", "petitioner"),
            __("Pakistan", "petitioner"),
            __("Palau", "petitioner"),
            __("Panama", "petitioner"),
            __("Papua New Guinea", "petitioner"),
            __("Paraguay", "petitioner"),
            __("Peru", "petitioner"),
            __("Philippines", "petitioner"),
            __("Poland", "petitioner"),
            __("Portugal", "petitioner"),
            __("Qatar", "petitioner"),
            __("Romania", "petitioner"),
            __("Russian Federation", "petitioner"),
            __("Rwanda", "petitioner"),
            __("St Kitts & Nevis", "petitioner"),
            __("St Lucia", "petitioner"),
            __("Saint Vincent & the Grenadines", "petitioner"),
            __("Samoa", "petitioner"),
            __("San Marino", "petitioner"),
            __("Sao Tome & Principe", "petitioner"),
            __("Saudi Arabia", "petitioner"),
            __("Senegal", "petitioner"),
            __("Serbia", "petitioner"),
            __("Seychelles", "petitioner"),
            __("Sierra Leone", "petitioner"),
            __("Singapore", "petitioner"),
            __("Slovakia", "petitioner"),
            __("Slovenia", "petitioner"),
            __("Solomon Islands", "petitioner"),
            __("Somalia", "petitioner"),
            __("South Africa", "petitioner"),
            __("South Sudan", "petitioner"),
            __("Spain", "petitioner"),
            __("Sri Lanka", "petitioner"),
            __("Sudan", "petitioner"),
            __("Suriname", "petitioner"),
            __("Swaziland", "petitioner"),
            __("Sweden", "petitioner"),
            __("Switzerland", "petitioner"),
            __("Syria", "petitioner"),
            __("Taiwan", "petitioner"),
            __("Tajikistan", "petitioner"),
            __("Tanzania", "petitioner"),
            __("Thailand", "petitioner"),
            __("Togo", "petitioner"),
            __("Tonga", "petitioner"),
            __("Trinidad & Tobago", "petitioner"),
            __("Tunisia", "petitioner"),
            __("Turkey", "petitioner"),
            __("Turkmenistan", "petitioner"),
            __("Tuvalu", "petitioner"),
            __("Uganda", "petitioner"),
            __("Ukraine", "petitioner"),
            __("United Arab Emirates", "petitioner"),
            __("United Kingdom", "petitioner"),
            __("United States", "petitioner"),
            __("Uruguay", "petitioner"),
            __("Uzbekistan", "petitioner"),
            __("Vanuatu", "petitioner"),
            __("Vatican City", "petitioner"),
            __("Venezuela", "petitioner"),
            __("Vietnam", "petitioner"),
            __("Yemen", "petitioner"),
            __("Zambia", "petitioner"),
            __("Zimbabwe", "petitioner")
        ];
    }

    /**
     * Shortcode callback to display the petition form.
     *
     * @return string HTML output of the petition form.
     */
    public function display_form($attributes)
    {
        $form_id        = esc_attr($attributes['id']);
        $nonce          = wp_create_nonce('petitioner_form_nonce');
        $post_exists    = get_post($form_id);

        if (!$post_exists || $post_exists->post_type !== 'petitioner-petition') {
            return;
        }

        $petitioner_send_to_representative  = get_post_meta($form_id, '_petitioner_send_to_representative', true);
        $petitioner_show_country            = get_post_meta($form_id, '_petitioner_show_country', true);
        $petitioner_add_legal_text          = get_post_meta($form_id, '_petitioner_add_legal_text', true);
        $petitioner_legal_text              = get_post_meta($form_id, '_petitioner_legal_text', true);
        $petitioner_add_consent_checkbox    = get_post_meta($form_id, '_petitioner_add_consent_checkbox', true);
        $petitioner_consent_text            = get_post_meta($form_id, '_petitioner_consent_text', true);
        $add_honeypot                       = get_post_meta($form_id, '_petitioner_add_honeypot', false);

        $is_recaptcha_enabled               = get_option('petitioner_enable_recaptcha', false);
        $is_hcaptcha_enabled                = get_option('petitioner_enable_hcaptcha', false);

        ob_start();
?>
        <div class="petitioner">
            <?php
            $this->render_title($form_id);
            $this->render_goal($form_id);
            $this->render_modal($form_id);
            ?>

            <form id="petitioner-form-<?php echo esc_attr($form_id); ?>" method="get"
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

                <?php if ($petitioner_show_country): ?>
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

                <?php if ($petitioner_send_to_representative): ?>
                    <div class="petitioner__input petitioner__input--checkbox">
                        <label for="petitioner_bcc"><?php esc_html_e('BCC me on the email', 'petitioner'); ?></label>
                        <input type="checkbox" id="petitioner_bcc" name="petitioner_bcc">
                    </div>
                <?php endif; ?>

                <?php if ($petitioner_add_consent_checkbox): ?>
                    <div class="petitioner__input petitioner__input--checkbox">
                        <label for="petitioner_accept_tos">
                            <?php echo !empty($petitioner_consent_text) ? wp_kses_post($petitioner_consent_text) : __('By submitting this form, I agree to the terms of service', 'petitioner'); ?>
                        </label>
                        <input type="checkbox" id="petitioner_accept_tos" name="petitioner_accept_tos">
                    </div>
                <?php endif; ?>

                <input type="hidden" name="form_id" value="<?php echo esc_attr($form_id); ?>">
                <input type="hidden" name="nonce" value="<?php echo esc_attr($nonce); ?>" />

                <?php if ($petitioner_add_legal_text): ?>
                    <div class="petitioner-legal petitioner-disclaimer-text">
                        <?php
                        $parsed_legal = wpautop($petitioner_legal_text);
                        echo !empty($parsed_legal) ? wp_kses_post($parsed_legal) : ''; ?>
                    </div>
                <?php endif; ?>

                <?php if ($is_hcaptcha_enabled || $is_recaptcha_enabled): ?>

                    <?php if ($is_recaptcha_enabled): ?>
                        <input type="hidden" name="petitioner-g-recaptcha-response" id="petitioner-g-recaptcha-response">
                        <p class="petitioner-disclaimer-text">
                            <?php
                            // translators: %1$s is the opening anchor tag, %2$s is the closing anchor tag
                            printf(
                                esc_html__(
                                    'This site is protected by reCAPTCHA and the Google %1$sPrivacy Policy%2$s and %3$sTerms of Service%4$s apply.',
                                    'petitioner'
                                ),
                                '<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">',
                                '</a>',
                                '<a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">',
                                '</a>'
                            );
                            ?>
                        </p>
                    <?php endif; ?>


                    <?php if ($is_hcaptcha_enabled): ?>
                        <span class="petitioner-h-captcha-container"></span>
                        <input type="hidden" name="petitioner-h-captcha-response" class="petitioner-h-captcha-response">
                        <p class="petitioner-disclaimer-text">
                            <?php
                            // translators: %1$s is the opening anchor tag, %2$s is the closing anchor tag
                            printf(
                                esc_html__(
                                    'This site is protected by hCaptcha and its %1$sPrivacy Policy%2$s and %3$sTerms of Service%4$s apply.',
                                    'petitioner'
                                ),
                                '<a href="https://www.hcaptcha.com/privacy" target="_blank" rel="noopener noreferrer">',
                                '</a>',
                                '<a href="https://www.hcaptcha.com/terms" target="_blank" rel="noopener noreferrer">',
                                '</a>'
                            );
                            ?>
                        </p>
                    <?php endif; ?>

                <?php endif; ?>

                <?php if ($add_honeypot): ?>
                    <input type="text" name="ptr_info" style="display:none"/>
                <?php endif; ?>

                <button type="submit" class="petitioner__btn petitioner__btn--submit"><?php esc_html_e('Sign this petition', 'petitioner'); ?></button>


            </form>

            <div class="petitioner__response">
                <h3></h3>
                <p></p>
            </div>

        </div>
    <?php
        return ob_get_clean();
    }

    public function render_title($form_id)
    {
        $petitioner_title = get_post_meta($form_id, '_petitioner_title', true);

        $petitioner_show_title = get_option('petitioner_show_title', true);

        if (!$petitioner_show_title) return;
    ?>
        <h2 class="petitioner__title">
            <?php echo !empty($petitioner_title) ? esc_html($petitioner_title) : esc_html__('Sign this petition', 'petitioner'); ?>
        </h2>
    <?php
    }

    public function render_modal($form_id)
    {
        if (!$form_id) return;

        $petitioner_letter = get_post_meta($form_id, '_petitioner_letter', true);
        $petitioner_subject = get_post_meta($form_id, '_petitioner_subject', true);
        $petitioner_show_letter = get_option('petitioner_show_letter', true);

        if (!$petitioner_show_letter) return;
    ?>
        <button class="petitioner__btn petitioner__btn--letter"><?php esc_html_e('View the letter', 'petitioner'); ?></button>

        <div class="petitioner-modal">
            <span class="petitioner-modal__backdrop"></span>
            <div class="petitioner-modal__letter">
                <button class="petitioner-modal__close">&times; <span><?php esc_html_e('Close modal', 'petitioner') ?></span></button>
                <h3><?php echo esc_html($petitioner_subject); ?></h3>
                <div class="petitioner-modal__inner">
                    <?php
                    $parsed_letter = wpautop($petitioner_letter);
                    echo wp_kses_post($parsed_letter); ?>
                </div>
                <hr />
                <p><?php esc_html_e('{Your name will be here}', 'petitioner'); ?></p>
            </div>
        </div>
    <?php
    }

    public function render_goal($form_id)
    {
        $petitioner_show_goal   = get_option('petitioner_show_goal', true);

        if (!$petitioner_show_goal) return;

        $petitioner_goal        = get_post_meta($form_id, '_petitioner_goal', true);
        $goal                   = intval($petitioner_goal);
        $total_submissions      = AV_Petitioner_Submissions_Model::get_submission_count($form_id);
        $progress               = 0;

        if ($total_submissions > 0) {
            $progress = round($total_submissions / $goal * 100);
        }
    ?>
        <div class="petitioner__goal">
            <div class="petitioner__progress">
                <div
                    class="petitioner__progress-bar"
                    style="width: <?php echo esc_html($progress); ?>% !important">
                </div>
            </div>

            <div class="petitioner__col">
                <span class="petitioner__num"><?php echo esc_html($total_submissions . PHP_EOL); ?></span>
                <span class="petitioner__numlabel">
                    <?php esc_html_e('Signatures', 'petitioner'); ?>
                    <small>(<?php echo esc_html($progress . '%'); ?>)</small>
                </span>
            </div>

            <div class="petitioner__col petitioner__col--end">
                <span class="petitioner__num"><?php echo esc_html($goal . PHP_EOL); ?></span>
                <span class="petitioner__numlabel"><?php esc_html_e('Goal', 'petitioner'); ?></span>
            </div>

        </div>

<?php
    }
}
