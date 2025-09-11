<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class AV_Petitioner_Frontend_UI
{

    /**
     * Shortcode callback to display the petition form.
     *
     * @return string HTML output of the petition form.
     */
    public function display_form($attributes)
    {
        $form_id        = esc_attr($attributes['id']);
        $post_exists    = get_post($form_id);

        if (!$post_exists || $post_exists->post_type !== 'petitioner-petition') {
            return;
        }
        $form_handler = new AV_Petitioner_Form_UI($form_id);

        ob_start();
?>
        <div class="petitioner">
            <?php
            $this->render_title($form_id);
            $this->render_goal($form_id, get_option('petitioner_show_goal', true));
            $this->render_modal($form_id);

            // $form_handler->render();
            $form_handler->render_fields();
            ?>
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
        <button class="petitioner__btn petitioner__btn--letter"><?php echo esc_html(AV_Petitioner_Labels::get('view_the_letter')); ?></button>

        <div class="petitioner-modal">
            <span class="petitioner-modal__backdrop"></span>
            <div class="petitioner-modal__letter">
                <button class="petitioner-modal__close">&times; <span><?php echo esc_html(AV_Petitioner_Labels::get('close_modal')); ?></span></button>
                <h3><?php echo esc_html($petitioner_subject); ?></h3>
                <div class="petitioner-modal__inner">
                    <?php
                    $parsed_letter = wpautop($petitioner_letter);
                    echo wp_kses_post($parsed_letter); ?>
                </div>
                <hr />
                <p><?php echo esc_html(AV_Petitioner_Labels::get('your_name_here')); ?></p>
            </div>
        </div>
    <?php
    }

    public function render_goal($form_id, $show_goal = true)
    {

        if (!$show_goal) return;

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
                    <?php echo esc_html(AV_Petitioner_Labels::get('signatures')); ?>
                    <small>(<?php echo esc_html($progress . '%'); ?>)</small>
                </span>
            </div>

            <div class="petitioner__col petitioner__col--end">
                <span class="petitioner__num"><?php echo esc_html($goal . PHP_EOL); ?></span>
                <span class="petitioner__numlabel"><?php echo esc_html(AV_Petitioner_Labels::get('goal')); ?></span>
            </div>

        </div>

<?php
    }
}
