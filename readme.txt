=== Petitioner ===
Contributors: avoytenko
Donate link: https://avoy.me/
Tags: petition, activism, form, community, email
Requires at least: 5.9
Tested up to: 6.8
Stable Tag: 0.4.2
Requires PHP: 8.0
License: GPLv2 or later 
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Create and manage petitions with Petitioner, send them to the target email, and export submissions to CSV.

== Description ==

[Plugin homepage & demo](https://getpetitioner.com).
[Documentation](https://getpetitioner.com/docs/).
Petitioner is a WordPress plugin that allows you to create petitions and send them to the target email.

### Features:
**Unlimited petitions** 
Create and manage an unlimited number of petitions.

**Drag and drop form builder**
* Add/remove/reorder fields based on your needs
* Add rich text to the form for disclaimers and legal text
* Edit field's label, placeholder, and required state

**Control submission behaviour**
* Email functionality: Automatically send petition letters to representatives via email.
* Ability to store submissions without sending emails to the rep.
* Ability to manually approve/deny petitions and set the default approval behavior (approved by default or declined)
* Option to confirm emails via email
* Customize email confirmations, petition letters, and thank you emails
* Form submissions export: Export petition signups and submission data to a CSV file for easy reporting.

**Design & layout features**
* The plugin features a modern, mobile-friendly design for a seamless user experience.
* Color customizations & custom CSS options
* WYSIWYG editor: Easily edit petition letters and confirmation emails using a modern WYSIWYG editor.
* Gutenberg integration with a custom petition block!
* Several shortcodes to take your petitions to the next level

**Spam protection features**
* Captcha integrations: reCAPTCHA, hCaptcha, and Cloudflare Turnstile
* Akismet integration - handle spam seamlessly without adding any js libraries
* Honeypot field
* Email confirmations
* Compatible with all of the popular SMTP plugins (uses wp_mail behind the scenes)


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

= What if I have more questions? = 

You can find a more extensive FAQ [on the main website](https://getpetitioner.com/docs/). Additionally, yu can reach out to me via [this contact form](https://getpetitioner.com/contact/)

== Screenshots ==

1. Petition on the frontend
2. Petition letter (frontend)
3. Gutenberg block
4. Edit page
5. Form builder
6. Advanced settings
7. Submissions
8. Settings
9. Integrations

== Changelog ==

= 0.4.2 =
* Bugfix: add the new fields to the CSV export

= 0.4.1 =
* Bugfix: Ensure plugin version is always set in the database and automatically re-run database migrations if missing or old

= 0.4.0 =
* Brand new drag and drop form builder
    * Add/remove/reorder the form fields
    * Automatic migration from the old editing experience
    * Edit individual field settings
    * Add rich text to the form
    * Add new optional fields
* Moved admin js to typescript
* Add basic testing
* Bug fixes: fixing the bug with the nonce field not validating on some environments

= 0.3.4 =
* Bugfix: fix an occasional error related to unnecessary nonce sanitization

= 0.3.3 =
* Submissions tab improvements, special thanks to [@Shahraz98](https://github.com/Shahraz98)
    * Add ability to resend confirmation emails
    * Add a button to resend all confirmation emails at once (please use this with caution)
    * Refactored the code & improved the submissions UI
* Fix a bug with the export button
* Fix a bug with the wrong number on the submission count when the confirmation behavious is auto-denied by default
* Fix a minor bug with the textdomain loading too early
* Add basic translations to French, Ukrainian, Russian, and Dutch

= 0.3.2 =
* Bug fixes:
    * Fix a bug with hCaptcha breaking forms on Firefox, special thanks to [@Shahraz98](https://github.com/Shahraz98)
    * Fix the recaptcha code running when recaptcha is used by another plugin

= 0.3.1 =
* Add custom javascript event - petitionerFormSubmit
* Improve readme to highlight the latest features

= 0.3.0 =
* Spam protection improvements:
    * Add a honeypot option for additional spam protection
    * Akismet integration - handle spam seamlessly without adding any js libraries
    * Integrate with Cloudflare Turnstile - a privacy first captcha
* Create custom filters (petitioner_send_ty_email, petitioner_send_to_representative, petitioner_after_submission, petitioner_get_styled_message)
* New shortcodes (petitioner-goal, petitioner-submission-count, petitioner-goal-progress-ui, petitioner-letter-modal-ui)
* Bug fixes and UI improvements
    * Better style emails visually
    * Allow overriding the "from" field
    * A new and improved settings page
    * Add better DB schema handling
    * Fix a bug with confirmed emails not sending letters to the rep
* Add a translation template

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