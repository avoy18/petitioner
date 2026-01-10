export default class ReCaptcha {
	constructor(petitionForm: HTMLElement | HTMLFormElement) {
		if (
			typeof window.petitionerCaptcha !== 'undefined' &&
			window.petitionerCaptcha.recaptchaSiteKey
		) {
			const recaptchaField = petitionForm.querySelector<HTMLInputElement>(
				'[name="petitioner-g-recaptcha-response"]'
			);

			if (recaptchaField) {
				recaptchaField.value = '';
			}

			petitionForm.addEventListener(
				'focusin',
				function () {
					if (recaptchaField && recaptchaField?.value) {
						return;
					}

					if (
						typeof window.grecaptcha === 'undefined' ||
						typeof window.grecaptcha?.ready === 'undefined'
					) {
						return;
					}

					window.grecaptcha.ready(function () {
						window.grecaptcha
							?.execute(
								window.petitionerCaptcha?.recaptchaSiteKey ||
									'',
								{}
							)
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
