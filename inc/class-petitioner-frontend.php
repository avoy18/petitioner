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


        
        $submissions = new Petitioner_Submissions($form_id);
        $goal = $submissions->get_goal();
        $total_submissions = $submissions->get_submission_count();

        ob_start();
        ?>
        <form class="petitioner" id="petitioner-form-<?php echo $form_id; ?>" method="get"
            action="<?php echo admin_url('admin-ajax.php') . '?action=petitioner_form_submit'; ?>">
            <div class="petitioner__input">
                <label for="petitioner_fname">First Name:</label>
                <input required type="text" id="petitioner_fname" name="petitioner_fname">
            </div>

            <div class="petitioner__input">
                <label for="petitioner_lname">Last Name:</label>
                <input required type="text" id="petitioner_lname" name="petitioner_lname">
            </div>

            <div class="petitioner__input">
                <label for="petitioner_email">Your Email:</label>
                <input required type="email" id="petitioner_email" name="petitioner_email">
            </div>

            <input type="hidden" name="form_id" value="<?php echo $form_id; ?>">
            <input type="hidden" name="nonce" value="<?php echo esc_attr($nonce); ?>" />

            <button type="submit" class="petitioner__btn">Sign Petition</button>

            <div>
                <?php echo $total_submissions . PHP_EOL ?> signatures out of <?php echo $goal; ?>
            </div>
        </form>
        <?php
        return ob_get_clean();
    }
}
