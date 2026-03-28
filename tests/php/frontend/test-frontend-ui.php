<?php

use WorDBless\BaseTestCase;

class Test_Frontend_UI extends BaseTestCase
{
    private $form_id;

    public function set_up()
    {
        parent::set_up();
        // WorDBless BaseTestCase doesn't include the WP factory,
        // so we use the native WordPress function to generate the post.
        $this->form_id = wp_insert_post([
            'post_type'   => 'petitioner-petition',
            'post_status' => 'publish'
        ]);
    }

    public function tear_down()
    {
        // Clean up the mock post so it doesn't pollute the database
        wp_delete_post($this->form_id, true);
        parent::tear_down();
    }

    // ============================================
    // GET_FORM_ATTRIBUTES TESTS
    // ============================================

    public function test_form_attributes_return_classnames()
    {
        $frontend_ui = new AV_Petitioner_Frontend_UI();
        $html_attrs = $frontend_ui->get_form_attributes(1);

        $this->assertStringContainsString('class="petitioner"', $html_attrs);
    }

    public function test_form_attributes_pass_redirects()
    {
        $safe_internal_url = home_url('/thanks');
        $frontend_ui = new AV_Petitioner_Frontend_UI();
        update_post_meta(1, '_petitioner_redirect_url', $safe_internal_url);
        $html_attrs = $frontend_ui->get_form_attributes(1);

        $this->assertStringContainsString('data-redirect-url="' . $safe_internal_url . '"', $html_attrs);
    }

    public function test_form_protects_against_unsafe_redirects()
    {
        $frontend_ui = new AV_Petitioner_Frontend_UI();
        update_post_meta(1, '_petitioner_redirect_url', 'https://evil.com');
        $html_attrs = $frontend_ui->get_form_attributes(1);

        $this->assertStringNotContainsString('data-redirect-url="https://evil.com"', $html_attrs);
    }

    public function test_form_pass_external_redirects_with_filter()
    {
        $frontend_ui = new AV_Petitioner_Frontend_UI();
        update_post_meta($this->form_id, '_petitioner_redirect_url', 'https://gofundme.com');

        // Emulate a developer turning off the restriction
        add_filter('petitioner_allow_external_redirects', '__return_true');
        $html_attrs = $frontend_ui->get_form_attributes($this->form_id);
        remove_all_filters('petitioner_allow_external_redirects');

        $this->assertStringContainsString('data-redirect-url="https://gofundme.com"', $html_attrs);
    }

    public function test_custom_attributes_can_be_added_via_filter()
    {
        $frontend_ui = new AV_Petitioner_Frontend_UI();

        add_filter('av_petitioner_form_attributes', function ($attrs) {
            $attrs['data-tracking'] = '123';
            return $attrs;
        });
        $html_attrs = $frontend_ui->get_form_attributes($this->form_id);
        remove_all_filters('av_petitioner_form_attributes');

        $this->assertStringContainsString('data-tracking="123"', $html_attrs);
    }

    public function test_custom_attributes_are_escaped_against_xss()
    {
        $frontend_ui = new AV_Petitioner_Frontend_UI();

        add_filter('av_petitioner_form_attributes', function ($attrs) {
            $attrs['data-malicious'] = '"><script>alert(1)</script>';
            return $attrs;
        });
        $html_attrs = $frontend_ui->get_form_attributes($this->form_id);
        remove_all_filters('av_petitioner_form_attributes');

        // Ensures esc_attr() ran on the custom attributes
        $this->assertStringNotContainsString('<script>', $html_attrs);
        $this->assertStringContainsString('&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;', $html_attrs);
    }

    public function test_redirect_url_injected_via_filter_is_safely_escaped()
    {
        $frontend_ui = new AV_Petitioner_Frontend_UI();

        add_filter('av_petitioner_form_attributes', function ($attrs) {
            $attrs['data-redirect-url'] = 'javascript:alert("DOM XSS")';
            return $attrs;
        });
        $html_attrs = $frontend_ui->get_form_attributes($this->form_id);
        remove_all_filters('av_petitioner_form_attributes');

        // Ensures esc_url() explicitly stripped the bad protocol inside your foreach loop
        $this->assertStringNotContainsString('javascript:', $html_attrs);
    }

    // ============================================
    // RENDER TITLE TESTS
    // ============================================

    public function test_render_title_outputs_default_when_no_meta_exists()
    {
        $frontend_ui = new AV_Petitioner_Frontend_UI();
        
        ob_start();
        $frontend_ui->render_title($this->form_id);
        $output = ob_get_clean();

        $this->assertStringContainsString('Sign this petition', $output);
        $this->assertStringContainsString('petitioner__title', $output);
    }

    public function test_render_title_outputs_custom_title()
    {
        $frontend_ui = new AV_Petitioner_Frontend_UI();
        update_post_meta($this->form_id, '_petitioner_title', 'Save the Oceans!');
        
        ob_start();
        $frontend_ui->render_title($this->form_id);
        $output = ob_get_clean();

        $this->assertStringContainsString('Save the Oceans!', $output);
    }

    public function test_render_title_is_hidden_when_disabled_in_settings()
    {
        $frontend_ui = new AV_Petitioner_Frontend_UI();
        
        update_option('petitioner_show_title', 0); 
        
        ob_start();
        $frontend_ui->render_title($this->form_id);
        $output = ob_get_clean();

        delete_option('petitioner_show_title');

        $this->assertEmpty(trim($output));
    }

    // ============================================
    // RENDER MODAL TESTS
    // ============================================

    public function test_render_modal_is_hidden_when_disabled_in_settings()
    {
        $frontend_ui = new AV_Petitioner_Frontend_UI();
        
        update_option('petitioner_show_letter', 0);
        
        ob_start();
        $frontend_ui->render_modal($this->form_id);
        $output = ob_get_clean();

        delete_option('petitioner_show_letter');

        $this->assertEmpty(trim($output));
    }
}
