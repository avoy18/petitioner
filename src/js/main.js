import PetitionerForm from './frontend/form';
import '../scss/style.scss';

const allPetitions = document.querySelectorAll('.petitioner');

if (typeof petitionerRecaptcha !== 'undefined' && petitionerRecaptcha.siteKey) {
	// Use MutationObserver to wait for grecaptcha to be available
	const observer = new MutationObserver((mutations, obs) => {
		if (typeof grecaptcha !== 'undefined') {
			obs.disconnect(); // Stop observing once loaded

			// Attach reCAPTCHA execution only when form is interacted with
			allPetitions.forEach((petition) => {
				const recaptchaField = petition.querySelector(
					'[name="petitioner-g-recaptcha-response"]'
				);

				petition.addEventListener(
					'focusin',
					function () {
						grecaptcha.ready(function () {
							grecaptcha
								.execute(petitionerRecaptcha.siteKey, {
									action: 'submit',
								})
								.then((token) => {
									if (recaptchaField) {
										recaptchaField.value = token;
									}
								});
						});
					},
					{ once: true }
				); // Ensures execution happens only once per form interaction
			});
		}
	});

	// Observe changes in the <body> for dynamically loaded scripts
	observer.observe(document.body, { childList: true, subtree: true });
} else {
	console.error(
		'petitioner - reCAPTCHA site key is missing or reCAPTCHA failed to load.'
	);
}

// Initialize each form
allPetitions.forEach((petition) => {
	new PetitionerForm(petition);
});
