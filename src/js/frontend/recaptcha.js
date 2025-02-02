export default class ReCaptcha {
	constructor(petitionForm) {
		if (
			typeof petitionerCaptcha !== 'undefined' &&
			petitionerCaptcha.recaptchaSiteKey
		) {
			const recaptchaField = petitionForm.querySelector(
				'[name="petitioner-g-recaptcha-response"]'
			);

			petitionForm.addEventListener(
				'focusin',
				function () {
					grecaptcha.ready(function () {
						grecaptcha
							.execute(petitionerCaptcha.recaptchaSiteKey, {
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
