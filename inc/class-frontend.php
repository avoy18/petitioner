<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class AV_Petitioner_Frontend
{

    public function __construct()
    {
        // Any initialization for frontend if needed

    }

    /**
     * Shortcode callback to display the petition form.
     *
     * @return string HTML output of the petition form.
     */
    public function display_form($attributes)
    {
        $form_id = esc_attr($attributes['id']);
        $nonce = wp_create_nonce('petitioner_form_nonce');

        $post_exists = get_post($form_id);

        if (!$post_exists || $post_exists->post_type !== 'petitioner-petition') {
            return;
        }
        $petitioner_send_to_representative = get_post_meta($form_id, '_petitioner_send_to_representative', true);

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

                <?php if ($petitioner_send_to_representative): ?>
                    <div class="petitioner__input petitioner__input--checkbox">
                        <label for="petitioner_bcc"><?php esc_html_e('BCC me on the email', 'petitioner'); ?></label>
                        <input type="checkbox" id="petitioner_bcc" name="petitioner_bcc">
                    </div>
                <?php endif; ?>

                <input type="hidden" name="form_id" value="<?php echo esc_attr($form_id); ?>">
                <input type="hidden" name="nonce" value="<?php echo esc_attr($nonce); ?>" />

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
        $petitioner_show_goal = get_option('petitioner_show_goal', true);

        if (!$petitioner_show_goal) return;

        $petitioner_goal = get_post_meta($form_id, '_petitioner_goal', true);

        $goal = intval($petitioner_goal);

        $submissions = new AV_Petitioner_Submissions($form_id);
        $total_submissions = $submissions->get_submission_count();
        $progress = 0;
        
        if($total_submissions > 0){
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
