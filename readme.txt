=== Petitioner ===
Contributors: avoytenko
Donate link: https://avoy.me/
Tags: petition, activism, form, community, email
Requires at least: 5.9
Tested up to: 6.7.2
Stable Tag: 0.2.6
Requires PHP: 8.0
License: GPLv2 or later 
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Create and manage petitions with Petitioner, send them to the target email, and export submissions to CSV.

== Description ==

[Plugin homepage](https://getpetitioner.com).
Petitioner is a WordPress plugin that allows you to create petitions and send them to the target email.

Features:
- Unlimited petitions: Create and manage an unlimited number of petitions.
- Ability to approve/deny petitions and set the default approval behavior (approved by default or declined)
- Option to send customizable email confirmations or thank you emails
- Modern and responsive design: The plugin features a modern, mobile-friendly design for a seamless user experience.
- Color customizations & custom CSS options
- WYSIWYG editor: Easily edit petition letters and confirmation emails using a modern WYSIWYG editor.
- Form submissions export: Export petition signups and submission data to a CSV file for easy reporting.
- Email functionality: Automatically send petition letters to representatives via email.
- Spam protection with reCAPTCHA and hCaptcha
- Gutenberg integration with a custom petition block!

== Development and Source Code ==

The source code for this plugin is publicly available on GitHub:
[https://github.com/avoy18/petitioner](https://github.com/avoy18/petitioner)

== Frequently Asked Questions ==

= How do I show the petition on my website? =

Create your first petition under Petitioner -> Add new. Once you do that, you can either use a shortcode provided on the creation page or a Gutenberg block.

= How do I customize the styles? =

You can customize your petitions under Petitioner -> Settings. You can change the colors, conditionally display certain fields, and add custom CSS.

= How do I see and export the submissions? =

Simply open the edit page for the petition in question and you will see a table with all of the submissions. There will also be a button to export.

= Can I request features? =

Absolutely! Feel free to reach out through [this contact form](https://getpetitioner.com/contact/)

== Screenshots ==

1. Petition on the frontend
2. Petition letter (frontend)
3. Gutenberg block
4. Edit page
5. Form settings
6. Submissions

== Changelog ==

= 0.2.7 =
* Add better DB schema handling
* Allow overriding the "from" field
* Add a honeypot option for additional spam protection
* Create custom filters (petitioner_send_ty_email, petitioner_send_to_representative, petitioner_after_submission)
* New shortcodes (petitioner-goal, petitioner-submission-count, petitioner-goal-progress-ui, petitioner-letter-modal-ui)
* Minor bug fixes and UI improvements

= 0.2.6 =
* Fix export button not showing up
* Fix custom CSS not applying with custom colors
* Add confirmation emails

= 0.2.5 =
* Allow editing confirmation emails

= 0.2.4 =
* Bug fixes after the previous release

= 0.2.3 =
* Add Google reCAPTCHA and hCaptcha
* Allow multiple target emails
* Add optional legal disclaimer & consent checkbox
* Refactor & organize editor UI

= 0.2.2 =
* Added the ability to approve/deny petitions
* Reworked the edit fields & submissions UI

= 0.2.0 =
* Added the country field
* Improved checkbox styles
* Added color customizer to the settings page

= 0.1.4 =
* Improved readme & docs
* Improved asset enqueuing
* Fixed internalization issues
* Improved plugin escaping and sanitization

= 0.1.3 =
* New plugin settings page

= 0.1.2 =
* New Gutenberg block

= 0.1.1 =
* Added more sanitization and preparing for the wp.org upload

= 0.1.0 =
* Initial version of the plugin

== Upgrade Notice ==

= 0.1.3 =
* This version adds the Gutenberg block and fixes a few minor issues

= 0.1.4 =
* This version adds several minor security and maintainability tweaks and fixes a few minor bugs