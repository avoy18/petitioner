<?php

use WorDBless\BaseTestCase;

class Test_Public_Endpoints extends BaseTestCase
{
    public function set_up()
    {
        parent::set_up();

        add_filter('wp_doing_ajax', '__return_true');
        add_filter('wp_die_ajax_handler', [$this, 'get_die_handler']);
    }

    public function tear_down()
    {
        remove_filter('wp_doing_ajax', '__return_true');
        remove_filter('wp_die_ajax_handler', [$this, 'get_die_handler']);
        $_GET = [];

        parent::tear_down();
    }

    public function get_die_handler()
    {
        return function () {
            throw new RuntimeException('wp_die');
        };
    }

    /**
     * Call an AJAX handler and return its decoded JSON response.
     */
    private function call_endpoint(callable $handler, array $get)
    {
        $_GET = $get;

        ob_start();
        try {
            $handler();
        } catch (RuntimeException $e) {
            // wp_send_json() ends in wp_die()
        }

        return json_decode(ob_get_clean(), true);
    }

    public function test_get_submissions_rejects_contact_forms()
    {
        $contact_id = wp_insert_post(['post_type' => 'petitioner-contact', 'post_status' => 'publish']);

        $response = $this->call_endpoint(
            ['AV_Petitioner_Submissions_Controller', 'api_get_form_submissions'],
            ['form_id' => $contact_id]
        );

        $this->assertFalse($response['success']);
        $this->assertArrayNotHasKey('submissions', (array) $response['data']);
    }

    public function test_get_submissions_rejects_unpublished_petitions()
    {
        $draft_id = wp_insert_post(['post_type' => 'petitioner-petition', 'post_status' => 'draft']);

        $response = $this->call_endpoint(
            ['AV_Petitioner_Submissions_Controller', 'api_get_form_submissions'],
            ['form_id' => $draft_id]
        );

        $this->assertFalse($response['success']);
    }

    public function test_goal_progress_rejects_contact_forms()
    {
        $contact_id = wp_insert_post(['post_type' => 'petitioner-contact', 'post_status' => 'publish']);

        $response = $this->call_endpoint(
            ['AV_Petitioner_Submissions_Controller', 'api_get_goal_progress'],
            [
                'form_id'          => $contact_id,
                'petitioner_nonce' => wp_create_nonce(AV_Petitioner_Setup::$FRONTEND_FORM_NONCE_LABEL),
            ]
        );

        $this->assertFalse($response['success']);
        $this->assertArrayNotHasKey('count', $response['data']);
    }
}
