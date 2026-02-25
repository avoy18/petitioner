<?php

use WorDBless\BaseTestCase;

class Test_Email_Confirmations extends BaseTestCase
{

    public function set_up()
    {
        parent::set_up();
    }

    public function tear_down()
    {
        parent::tear_down();
    }

    // ============================================
    // GENERATE_CONFIRMATION_TOKEN TESTS
    // ============================================

    public function test_generate_confirmation_token_returns_string()
    {
        $token = AV_Email_Confirmations::generate_confirmation_token();

        $this->assertIsString($token);
    }

    public function test_generate_confirmation_token_generates_unique_tokens()
    {
        $token1 = AV_Email_Confirmations::generate_confirmation_token();
        $token2 = AV_Email_Confirmations::generate_confirmation_token();

        $this->assertNotEquals($token1, $token2);
    }
}
