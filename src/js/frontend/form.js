import ReCaptcha from './recaptcha';
import HCaptcha from './hcaptcha';
import Turnstile from './turnstile';

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
	constructor(wrapper) {
		this.wrapper = wrapper;
		if (!this.wrapper) return;

		this.responseTitle = this.wrapper.querySelector(
			'.petitioner__response > h3'
		);
		this.responseText = this.wrapper.querySelector(
			'.petitioner__response > p'
		);
		this.formEl = this.wrapper.querySelector('form');

		// Handling modal
		this.viewLetterBTN = this.wrapper.querySelector(
			'.petitioner__btn--letter'
		);
		this.petitionerModal = this.wrapper.querySelector('.petitioner-modal');
		this.modalClose = this.wrapper.querySelector(
			'.petitioner-modal__close'
		);
		this.backdrop = this.wrapper.querySelector(
			'.petitioner-modal__backdrop'
		);

		// AJAX action path
		this.actionPath = this.formEl?.action ?? '';

		// Captcha
		this.captchaValidated = false;

		if (petitionerCaptcha?.enableRecaptcha) {
			new ReCaptcha(this.formEl);
		}

		if (petitionerCaptcha?.enableHcaptcha) {
			this.hcaptcha = new HCaptcha(this.formEl);
		}

		if (petitionerCaptcha?.enableTurnstile) {
			this.turnstile = new Turnstile(this.formEl);
		}

		// Event Listeners
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

	showResponseMSG(
		title = 'Something went wrong',
		text = 'Please try again',
		isSuccess = false
	) {
		this.wrapper.classList.add('petitioner--submitted');
		if (this.responseTitle) this.responseTitle.innerText = title;
		if (this.responseText) this.responseText.innerText = text;
	}

	toggleModal(isShow = true) {
		if (this.petitionerModal) {
			this.petitionerModal.classList[isShow ? 'add' : 'remove'](
				'petitioner-modal--visible'
			);
		}
	}

	handleFormSubmit(e) {
		e.preventDefault();

		// If hCaptcha is enabled, validate the captcha before submission
		if (
			petitionerCaptcha?.enableHcaptcha &&
			this.hcaptcha &&
			!this.captchaValidated
		) {
			this.hcaptcha.validate(() => {
				this.captchaValidated = true;
				this.formEl.dispatchEvent(
					new Event('submit', { bubbles: true })
				);
			});
			return;
		}

		// If Turnstile is enabled, validate the captcha before submission
		if (
			petitionerCaptcha?.enableTurnstile &&
			this.turnstile &&
			!this.captchaValidated
		) {
			this.turnstile.validate(() => {
				this.captchaValidated = true;
				this.formEl.dispatchEvent(
					new Event('submit', { bubbles: true })
				);
			});
			return;
		}

		this.wrapper.classList.add('petitioner--loading');
		const formData = new FormData(this.formEl);

		fetch(this.actionPath, {
			method: 'POST',
			body: formData,
			credentials: 'same-origin',
			headers: { 'X-Requested-With': 'XMLHttpRequest' },
		})
			.then((response) => response.json())
			.then((res) => {
				if (res.success) {
					this.showResponseMSG('Thank you!', res.data);
				} else {
					this.showResponseMSG(
						'Could not submit the form.',
						res.data
					);
				}
				this.wrapper.classList.remove('petitioner--loading');
				this.formEl.reset();
				this.captchaValidated = false; // ✅ Reset for next submission

				const event = new CustomEvent('petitionerFormSubmit', {
					detail: {
						formData,
					},
				});

				document.dispatchEvent(event);
			})
			.catch((error) => {
				console.error('Error:', error);
				alert('An unexpected error occurred. Please try again later.');
				this.wrapper.classList.remove('petitioner--loading');
				this.formEl.reset();
				this.captchaValidated = false;
			});
	}
}
