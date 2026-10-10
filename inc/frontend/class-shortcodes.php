<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

class AV_Petitioner_Shortcodes
{
    public $frontend = null;
    public function __construct()
    {
        $this->frontend = new AV_Petitioner_Frontend_UI();

        add_shortcode('petitioner-form', [$this->frontend, 'display_form']);
        add_shortcode('petitioner-goal', [$this, 'display_goal']);
        add_shortcode('petitioner-submission-count', [$this, 'show_submission_count']);
        add_shortcode('petitioner-goal-progress-ui', [$this, 'render_goal_progress_ui']);
        add_shortcode('petitioner-letter-modal-ui', [$this, 'petitioner_render_modal_ui']);
        add_shortcode('petitioner-submissions', [$this, 'render_submissions_list']);
    }

    /**
     * Show the final goal of the petition
     */
    public function display_goal($atts = [])
    {
        $atts = shortcode_atts([
            'id' => null,
        ], $atts, 'petitioner-goal');

        $form_id = absint($atts['id']);

        if (!$form_id) {
            return '';
        }

        return AV_Petitioner_Goal_Milestones::get_active_goal($form_id);
    }

    /**
     * Show the number of submissions for a specific form
     */
    public function show_submission_count($atts = [])
    {
        $atts = shortcode_atts([
            'id' => null,
        ], $atts, 'petitioner-submission-count');

        $form_id = absint($atts['id']);

        if (!$form_id) {
            return '';
        }

        $submission_count = AV_Petitioner_Submissions_Model::get_submission_count($form_id);

        return intval($submission_count);
    }

    /**
     * Render the goal progress UI
     */
    public function render_goal_progress_ui($atts = [])
    {
        $atts = shortcode_atts([
            'id' => null,
        ], $atts, 'petitioner-goal-progress-ui');

        $form_id = absint($atts['id']);

        $post = get_post($form_id);
        if (!$post || $post->post_type !== 'petitioner-petition') {
            return '';
        }

        ob_start();
        echo '<div ' . $this->frontend->get_form_attributes($form_id) . '>';
        $this->frontend->render_goal($form_id);
        echo '</div>';

        return ob_get_clean();
    }

    /**
     * Render the letter modal UI (with a button)
     */
    public function petitioner_render_modal_ui($atts = [])
    {
        $atts = shortcode_atts([
            'id' => null,
        ], $atts, 'petitioner-letter-modal-ui');

        $form_id = absint($atts['id']);

        if (!$form_id) {
            return '';
        }

        ob_start();
        echo '<div ' . $this->frontend->get_form_attributes($form_id) . '>';
        $this->frontend->render_modal($form_id);
        echo '</div>';

        return ob_get_clean();
    }

    /**
     * Render the submissions list
     * 
     * @param array{
     *     id: int|string|null,
     *     per_page?: int|string|null
     * } $atts
     */
    public function render_submissions_list($atts)
    {
        $atts = shortcode_atts(
            array_merge(
                ['id' => null],
                AV_Petitioner_Submissions_UI::get_defaults()
            ),
            $atts,
            'petitioner-submissions'
        );

        return AV_Petitioner_Submissions_UI::render_submissions_list(
            absint($atts['id']),
            $atts
        );
    }
}
