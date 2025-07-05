import { CaptchaValidationCallback } from './types/frontend';
/**
 * hCaptcha logic
 *
 * 1. Initializes hCaptcha on a new class instance
 * 2. Checks if hCaptcha is enabled and ready
 * 3. Renders the hCaptcha widget upon form submit
 * 4. Calls a form submit callback function when the hCaptcha token is received
 */

// hCaptcha SDK types
interface HCaptchaConfig {
	sitekey: string;
	size: 'invisible' | 'compact' | 'normal';
	callback: (token: string) => void;
}

interface HCaptchaSDK {
	render(container: HTMLElement, config: HCaptchaConfig): string;
	execute(widgetId: string): void;
}

// Extend global declarations for hCaptcha
declare global {
	const hcaptcha: HCaptchaSDK | undefined;
}

export default class HCaptcha {
	private form: HTMLElement;
	private hcaptchaField: HTMLInputElement | null;
	private hcaptchaContainer: HTMLElement | null;
	private widgetId: string | null = null;
	private callbackFunction: CaptchaValidationCallback | null = null;

	constructor(currentForm: HTMLElement) {
		this.form = currentForm;
		this.hcaptchaField = this.form.querySelector<HTMLInputElement>(
			'[name="petitioner-h-captcha-response"]'
		);
		this.hcaptchaContainer = this.form.querySelector<HTMLElement>(
			'.petitioner-h-captcha-container'
		);

		if (!this.isHCaptchaReady()) {
			// console.warn('❌ petitioner - hCaptcha is not enabled or missing.');
			return;
		}

		this.initHCaptcha();
	}

	private isHCaptchaReady(): boolean {
		return !!(
			typeof hcaptcha !== 'undefined' &&
			window.petitionerCaptcha?.enableHcaptcha &&
			window.petitionerCaptcha?.hcaptchaSiteKey &&
			this.hcaptchaContainer
		);
	}

	private initHCaptcha(): void {
		if (
			!hcaptcha ||
			!window.petitionerCaptcha?.hcaptchaSiteKey ||
			!this.hcaptchaContainer
		) {
			return;
		}

		this.widgetId = hcaptcha.render(this.hcaptchaContainer, {
			sitekey: window.petitionerCaptcha.hcaptchaSiteKey,
			size: 'invisible',
			callback: this.handleSuccess.bind(this),
		});
	}

	private handleSuccess(token: string): void {
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

	public validate(callback: CaptchaValidationCallback): void {
		if (!this.hcaptchaField || this.hcaptchaField.value) {
			callback();
			return;
		}

		this.callbackFunction = callback;

		if (hcaptcha && this.widgetId) {
			hcaptcha.execute(this.widgetId);
		}
	}
}
