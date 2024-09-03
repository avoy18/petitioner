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
        <form id="petition-form" method="post" action="">
            <label for="name">Your Name:</label>
            <input type="text" id="name" name="name" required>

            <label for="email">Your Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="message">Message:</label>
            <textarea id="message" name="message" rows="5" required></textarea>

            <button type="submit">Sign Petition</button>
        </form>
<?php
        return ob_get_clean();
    }
}
