// Global type definitions for Petitioner Form

export type PetitionerWrapperElement = HTMLElement | null;

export type PetitionerFormSettings = {
	actionPath?: string;
	nonce?: string;
}

export type PetitionerCaptcha = {
	enableRecaptcha?: boolean;
	enableHcaptcha?: boolean;
	enableTurnstile?: boolean;
	recaptchaSiteKey?: string;
	hcaptchaSiteKey?: string;
	turnstileSiteKey?: string;
}

export type CaptchaValidationCallback = {
	(): void;
}

export type CaptchaProvider = {
	validate(callback: CaptchaValidationCallback): void;
}

export type CustomEventDetail = {
	formData: FormData;
}
