import ReCaptcha from './recaptcha';
import HCaptcha from './hcaptcha';
import Turnstile from './turnstile';
import type { PetitionerWrapperElement, ApiResponse } from './consts';

/**
 * @class PetitionerForm
 *
 * Handles form submission, validation, modal interactions, and reCAPTCHA/hCaptcha integration.
 *
 * ### Features:
 * 1. Initializes form submission with AJAX.
 * 2. Integrates Google reCAPTCHA v3 and hCaptcha (invisible).
 * 3. Handles modal interactions (opening & closing).
 * 4. Prevents infinite reCaptcha/hCaptcha loops using a validation flag.
 * 5. Displays success/error messages upon submission.
 * 6. Ensures graceful handling if elements are missing.
 *
 * @example
 * ```js
 * const formElement = document.querySelector(".petitioner");
 * const petitionerForm = new PetitionerForm(formElement);
 * ```
 */
export default class PetitionerForm {
	private wrapper: PetitionerWrapperElement;
	private responseTitle: HTMLHeadingElement | null;
	private responseText: HTMLParagraphElement | null;
	private formEl: HTMLFormElement | null;
	private viewLetterBTN: HTMLButtonElement | null;
	private petitionerModal: HTMLDivElement | null;
	private modalClose: HTMLButtonElement | null;
	private backdrop: HTMLDivElement | null;
	private actionPath: string;
	private nonceEndpoint: string;
	private nonce: string;
	private captchaValidated: boolean = false;
	private hcaptcha: object | null = null;
	private turnstile: object | null = null;
	private _escListener: ((e: KeyboardEvent) => void) | null = null;

	constructor(wrapper: PetitionerWrapperElement) {
		this.wrapper = wrapper;
		this.responseTitle = null;
		this.responseText = null;
		this.formEl = null;
		this.viewLetterBTN = null;
		this.petitionerModal = null;
		this.modalClose = null;
		this.backdrop = null;

		// Get settings with proper fallbacks
		const settings = window?.petitionerFormSettings || {};
		const { actionPath = '', nonce = '', nonceEndpoint = '' } = settings;

		// AJAX action path
		this.actionPath = actionPath || '';
		this.nonceEndpoint = nonceEndpoint || '';
		this.nonce = nonce || '';

		if (!this.wrapper) return;

		// Initialize DOM elements with proper type casting
		this.responseTitle = this.wrapper.querySelector<HTMLHeadingElement>(
			'.petitioner__response > h3'
		);
		this.responseText = this.wrapper.querySelector<HTMLParagraphElement>(
			'.petitioner__response > p'
		);
		this.formEl = this.wrapper.querySelector<HTMLFormElement>('form');

		// Handling modal elements
		this.viewLetterBTN = this.wrapper.querySelector<HTMLButtonElement>(
			'.petitioner__btn--letter'
		);
		this.petitionerModal =
			this.wrapper.querySelector<HTMLDivElement>('.petitioner-modal');
		this.modalClose = this.wrapper.querySelector<HTMLButtonElement>(
			'.petitioner-modal__close'
		);
		this.backdrop = this.wrapper.querySelector<HTMLDivElement>(
			'.petitioner-modal__backdrop'
		);

		// Initialize captcha providers
		this.initializeCaptcha();

		// Set up event listeners
		this.setupEventListeners();
	}

	private initializeCaptcha(): void {
		if (typeof window.petitionerCaptcha === 'undefined') return;

		if (window.petitionerCaptcha.enableRecaptcha === '1' && this.formEl) {
			new ReCaptcha(this.formEl);
		}

		if (window.petitionerCaptcha.enableHcaptcha === '1' && this.formEl) {
			this.hcaptcha = new HCaptcha(this.formEl);
		}

		if (window.petitionerCaptcha.enableTurnstile === '1' && this.formEl) {
			this.turnstile = new Turnstile(this.formEl);
		}
	}

	private setupEventListeners(): void {
		if (this.formEl) {
			this.formEl.addEventListener(
				'submit',
				this.handleFormSubmit.bind(this)
			);
		}

		if (this.viewLetterBTN) {
			this.viewLetterBTN.addEventListener('click', () =>
				this.toggleModal(true)
			);
		}

		if (this.backdrop) {
			this.backdrop.addEventListener('click', () =>
				this.toggleModal(false)
			);
		}

		if (this.modalClose) {
			this.modalClose.addEventListener('click', () =>
				this.toggleModal(false)
			);
		}
	}

	private showResponseMSG(
		messaging: { title: string; message: string },
		isSuccess: boolean = false
	): void {
		this.wrapper?.classList.add('petitioner--submitted');
		const { title, message } = messaging || { title: '', message: '' };
		if (this.responseTitle) this.responseTitle.innerText = title;
		if (this.responseText) this.responseText.innerHTML = message;
	}

	private toggleModal(isShow: boolean = true): void {
		if (!this.petitionerModal) return;

		this.petitionerModal.classList[isShow ? 'add' : 'remove'](
			'petitioner-modal--visible'
		);

		if (isShow) {
			this._escListener = (e: KeyboardEvent): void => {
				if (e.key === 'Escape') this.toggleModal(false);
			};
			document.addEventListener('keydown', this._escListener);
		} else if (this._escListener) {
			document.removeEventListener('keydown', this._escListener);
			this._escListener = null;
		}
	}

	private handleFormSubmit(e: Event): void {
		e.preventDefault();

		// Validate hCaptcha if enabled
		if (this.shouldValidateHCaptcha()) {
			(this.hcaptcha as HCaptcha).validate(() => {
				this.captchaValidated = true;
				this.submitForm();
			});
			return;
		}

		// Validate Turnstile if enabled
		if (this.shouldValidateTurnstile()) {
			(this.turnstile as Turnstile).validate(() => {
				this.captchaValidated = true;
				this.submitForm();
			});
			return;
		}

		this.submitForm();
	}

	private shouldValidateHCaptcha(): boolean {
		return !!(
			window.petitionerCaptcha?.enableHcaptcha &&
			this.hcaptcha &&
			!this.captchaValidated
		);
	}

	private shouldValidateTurnstile(): boolean {
		return !!(
			window.petitionerCaptcha?.enableTurnstile &&
			this.turnstile &&
			!this.captchaValidated
		);
	}

	private async submitForm(): Promise<void> {
		if (!this.formEl) return;

		this.wrapper?.classList.add('petitioner--loading');

		try {
			const formData = new FormData(this.formEl as HTMLFormElement);
			const freshNonce = await this.getFreshNonce();
			formData.append('petitioner_nonce', freshNonce);
			const response = await fetch(this.actionPath, {
				method: 'POST',
				body: formData,
				credentials: 'same-origin',
				headers: { 'X-Requested-With': 'XMLHttpRequest' },
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const res = (await response.json()) as ApiResponse;

			if (res.success) {
				this.showResponseMSG(res.data, true);
			} else {
				this.showResponseMSG(res.data, false);
			}

			this.handleSubmissionComplete(formData);
		} catch (error) {
			console.error('Error:', error);
			alert('An unexpected error occurred. Please try again later.');
			this.handleSubmissionComplete();
		}
	}

	private handleSubmissionComplete(formData?: FormData): void {
		this.wrapper?.classList.remove('petitioner--loading');
		this.formEl?.reset();
		this.captchaValidated = false; // ✅ Reset for next submission

		if (formData) {
			const event = new CustomEvent('petitionerFormSubmit', {
				detail: { formData },
			});
			document.dispatchEvent(event);
		}
	}

	/**
	 * Fetches a fresh nonce from the server to avoid stale cached nonces.
	 * Falls back to the inline nonce if the endpoint is unavailable.
	 */
	private async getFreshNonce(): Promise<string> {
		try {
			const response = await fetch(this.nonceEndpoint, {
				method: 'GET',
				credentials: 'same-origin',
			});

			if (!response.ok) {
				throw new Error('Failed to fetch nonce');
			}

			const data = await response.json();

			if (data.success && data.data?.nonce) {
				this.nonce = data.data.nonce;
				return data.data.nonce;
			}

			throw new Error('Invalid nonce response');
		} catch (error) {
			console.warn('Could not fetch fresh nonce:', error);

			// Fallback to cached nonce, or bubble up if none exists
			if (this.nonce) {
				return this.nonce;
			}

			throw new Error('No nonce available');
		}
	}
}
