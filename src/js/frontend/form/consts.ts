// Global type definitions for Petitioner Form

export type PetitionerWrapperElement = HTMLElement | null;

export type PetitionerFormSettings = {
	actionPath?: string;
	nonceEndpoint?: string;
	nonce?: string;
};

export type PetitionerCaptcha = {
	enableRecaptcha?: '1' | '0';
	enableHcaptcha?: '1' | '0';
	enableTurnstile?: '1' | '0';
	recaptchaSiteKey?: string;
	hcaptchaSiteKey?: string;
	turnstileSiteKey?: string;
};

export type CaptchaValidationCallback = {
	(): void;
};

export type CaptchaProvider = {
	validate(callback: CaptchaValidationCallback): void;
};

export type CustomEventDetail = {
	formData: FormData;
	success: boolean;
};

export type ApiResponse = {
	success: boolean;
	data: {
		title: string;
		message: string;
	};
};
