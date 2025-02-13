/**
 * hCaptcha logic
 *
 * 1. Initializes hCaptcha on a new class instance
 * 2. Checks if hCaptcha is enabled and ready
 * 3. Renders the hCaptcha widget upon form submit
 * 4. Calls a form submit callback function when the hCaptcha token is received
 */
export default class HCaptcha {
	constructor(currentForm) {
		this.form = currentForm;
		this.hcaptchaField = this.form.querySelector(
			'[name="petitioner-h-captcha-response"]'
		);
		this.hcaptchaContainer = this.form.querySelector(
			'.petitioner-h-captcha-container'
		);

		if (
			typeof hcaptcha === 'undefined' ||
			!petitionerCaptcha?.enableHcaptcha ||
			!petitionerCaptcha?.hcaptchaSiteKey ||
			!this.hcaptchaContainer
		) {
			console.warn('❌ petitioner - hCaptcha is not enabled or missing.');
			return;
		}

		this.initHCaptcha();
	}

	initHCaptcha() {
		this.widgetId = hcaptcha.render(this.hcaptchaContainer, {
			sitekey: petitionerCaptcha.hcaptchaSiteKey,
			size: 'invisible',
			callback: this.handleSuccess.bind(this),
		});
	}

	handleSuccess(token) {
		if (!token) {
			console.warn('❌ petitioner - hCaptcha token missing.');
			return;
		}

		if (!this.hcaptchaField) {
			console.error('❌ petitioner - hCaptcha input field not found.');
			return;
		}

		this.hcaptchaField.value = token;

		if (typeof this.callbackFunction === 'function') {
			this.callbackFunction();
		}
	}

	validate(callback) {
		if (!this.hcaptchaField || this.hcaptchaField.value) {
			callback();
			return;
		}

		this.callbackFunction = callback;
		hcaptcha.execute(this.widgetId);
	}
}
