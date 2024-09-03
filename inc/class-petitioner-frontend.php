<?php

if (! defined('ABSPATH')) {
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

        ob_start();
?>
        <form class="petitioner" id="petitioner-form" method="get" action="">
            <div class="petitioner__input">
                <label for="petitioner_fname">First Name:</label>
                <input type="text" id="petitioner_fname" name="petitioner_fname">
            </div>

            <div class="petitioner__input">
                <label for="petitioner_lname">Last Name:</label>
                <input type="text" id="petitioner_lname" name="petitioner_lname">
            </div>

            <div class="petitioner__input">
                <label for="petitioner_email">Your Email:</label>
                <input type="email" id="petitioner_email" name="petitioner_email">
            </div>
            
            <button type="submit">Sign Petition</button>
        </form>
<?php
        return ob_get_clean();
    }
}
