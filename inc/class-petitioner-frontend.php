<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class Petitioner_Frontend
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

        $petitioner_title = get_post_meta($form_id, '_petitioner_title', true);
        $petitioner_goal = get_post_meta($form_id, '_petitioner_goal', true);
        $petitioner_letter = get_post_meta($form_id, '_petitioner_letter', true);
        $petitioner_subject = get_post_meta($form_id, '_petitioner_subject', true);

        $goal = intval($petitioner_goal);

        $submissions = new Petitioner_Submissions($form_id);
        $total_submissions = $submissions->get_submission_count();
        $progress = round($total_submissions / $goal * 100);

        ob_start();
?>
        <div class="petitioner">

            <h2 class="petitioner__title">
                <?php echo !empty($petitioner_title) ? $petitioner_title : __('Sign this petition', 'petitioner'); ?>
            </h2>

            <div class="petitioner__goal">
                <div class="petitioner__progress">
                    <div
                        class="petitioner__progress-bar"
                        style="width: <?php echo $progress; ?>% !important">
                    </div>
                </div>

                <div class="petitioner__col">
                    <span class="petitioner__num"><?php echo $total_submissions . PHP_EOL; ?></span>
                    <span class="petitioner__numlabel">
                        <?php _e('Signatures', 'petitioner'); ?>
                        <small>(<?php echo $progress . '%'; ?>)</small>
                    </span>
                </div>

                <div class="petitioner__col petitioner__col--end">
                    <span class="petitioner__num"><?php echo $goal . PHP_EOL; ?></span>
                    <span class="petitioner__numlabel"><?php _e('Goal', 'petitioner'); ?></span>
                </div>

            </div>

            <button class="petitioner__btn petitioner__btn--letter"><?php _e('View the letter', 'petitioner'); ?></button>

            <div class="petitioner-modal">
                <span class="petitioner-modal__backdrop"></span>
                <div class="petitioner-modal__letter">
                    <button class="petitioner-modal__close">&times; <span><?php _e('Close modal', 'petitioner') ?></span></button>
                    <h3><?php echo $petitioner_subject; ?></h3>
                    <div class="petitioner-modal__inner">
                        <?php echo $petitioner_letter; ?>
                    </div>
                    <hr />
                    <p>{Your name will be here}</p>
                </div>
            </div>

            <form id="petitioner-form-<?php echo $form_id; ?>" method="get"
                action="<?php echo admin_url('admin-ajax.php') . '?action=petitioner_form_submit'; ?>">

                <div class="petitioner__input">
                    <label for="petitioner_fname"><?php _e('First name', 'petitioner'); ?></label>
                    <input required type="text" id="petitioner_fname" name="petitioner_fname">
                </div>

                <div class="petitioner__input">
                    <label for="petitioner_lname"><?php _e('Last name', 'petitioner'); ?></label>
                    <input required type="text" id="petitioner_lname" name="petitioner_lname">
                </div>

                <div class="petitioner__input">
                    <label for="petitioner_email"><?php _e('Your email', 'petitioner'); ?></label>
                    <input required type="email" id="petitioner_email" name="petitioner_email">
                </div>

                <input type="hidden" name="form_id" value="<?php echo $form_id; ?>">
                <input type="hidden" name="nonce" value="<?php echo esc_attr($nonce); ?>" />

                <button type="submit" class="petitioner__btn petitioner__btn--submit"><?php _e('Sign this petition', 'petitioner'); ?></button>
            </form>

            <div class="petitioner__response">
                <h3></h3>
                <p></p>
            </div>

        </div>
<?php
        return ob_get_clean();
    }
}
