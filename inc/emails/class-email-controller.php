<?php

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * AV_Petitioner_Email
 *
 * A class to handle email sendoff.
 */
class AV_Petitioner_Email_Controller
{
    public static function send($to, $subject, $message, $headers = [])
    {
        /**
         * In case the email is sent to multiple recipients, 
         * we need to split the emails and send them one by one
         */
        if (strpos($to, ',') !== false) {
            $emails = explode(',', $to);
            $success = true;
            
            foreach ($emails as $email) {
                $email = trim($email);

                $email_sent = wp_mail(
                    $email,
                    $subject,
                    $message,
                    $headers
                );

                if (!$email_sent) {
                    $success = false;
                }
            }

            // Return true if all emails were sent successfully
            return $success;
        }

        return wp_mail($to, $subject, $message, $headers);
    }

    public static function build_headers($from, $cc = '', $bcc = '')
    {
        $headers = ['Content-Type: text/html; charset=UTF-8'];
        if ($from) $headers[] = 'From: ' . $from;
        if ($cc) $headers[] = 'CC: ' . $cc;
        if ($bcc) $headers[] = 'BCC: ' . $bcc;
        return $headers;
    }
}
