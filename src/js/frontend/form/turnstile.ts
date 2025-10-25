export default class Turnstile {
	private form: HTMLElement;
	private turnstileField: HTMLInputElement | null;
	private turnstileContainer: HTMLElement | null;
	private widgetId: string | null = null;
	private callbackFunction: (() => void) | null = null;

	constructor(petitionForm: HTMLElement) {
		this.form = petitionForm;
		this.turnstileField = this.form.querySelector(
			'[name="petitioner-turnstile-response"]'
		);
		this.turnstileContainer = this.form.querySelector(
			'.petitioner-turnstile-container'
		);

		if (
			typeof window?.turnstile === 'undefined' ||
			!window.petitionerCaptcha?.turnstileSiteKey ||
			!this.turnstileContainer
		) {
			// console.warn('❌ petitioner - Turnstile is not enabled or missing.');
			return;
		}

		this.initTurnstile();
	}

	initTurnstile() {

		const sitekey = window.petitionerCaptcha?.turnstileSiteKey;

		if (!sitekey) {
			this.handleError();
			return;
		}

		this.widgetId = window?.turnstile?.render?.(this.turnstileContainer, {
			sitekey,
			callback: this.handleSuccess.bind(this),
			theme: 'light',
			'error-callback': this.handleError.bind(this),
		});
	}

	handleSuccess(token: string) {
		if (!token) {
			console.warn('❌ petitioner - Turnstile token missing.');
			return;
		}

		if (!this.turnstileField) {
			console.error('❌ petitioner - Turnstile input field not found.');
			return;
		}

		this.turnstileField.value = token;

		if (typeof this.callbackFunction === 'function') {
			this.callbackFunction();
		}
	}

	handleError() {
		console.error('❌ petitioner - Turnstile encountered an error.');
	}

	validate(callback: () => void) {
		if (!this.turnstileField || this.turnstileField.value) {
			callback();
			return;
		}

		this.callbackFunction = callback;
		if (this.widgetId) {
			window?.turnstile?.execute?.(this.widgetId);
		}
	}
}
