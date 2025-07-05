export default class ReCaptcha {
	constructor(petitionForm: HTMLElement | HTMLFormElement) {
		if (
			typeof window.petitionerCaptcha !== 'undefined' &&
			window.petitionerCaptcha.recaptchaSiteKey
		) {
			const recaptchaField = petitionForm.querySelector(
				'[name="petitioner-g-recaptcha-response"]'
			);

			petitionForm.addEventListener(
				'focusin',
				function () {
					if (recaptchaField && recaptchaField.value) {
						return;
					}

					if (typeof grecaptcha === 'undefined' || typeof grecaptcha?.ready === 'undefined') {
						return;
					}

					grecaptcha.ready(function () {
						grecaptcha
							.execute(window.petitionerCaptcha.recaptchaSiteKey, {
								// action: 'submit',
							})
							.then((token) => {
								if (recaptchaField) {
									recaptchaField.value = token;
								}
							});
					});
				},
				{ once: true }
			);
		} else {
			console.error(
				'petitioner - reCAPTCHA site key is missing or reCAPTCHA failed to load.'
			);
		}
	}
}
