// Global type definitions for Petitioner Form

interface PetitionerFormSettings {
	actionPath?: string;
	nonce?: string;
}

interface PetitionerCaptcha {
	enableRecaptcha?: boolean;
	enableHcaptcha?: boolean;
	enableTurnstile?: boolean;
}

interface CaptchaValidationCallback {
	(): void;
}

interface CaptchaProvider {
	validate(callback: CaptchaValidationCallback): void;
}

interface ApiResponse {
	success: boolean;
	data: string;
}

interface CustomEventDetail {
	formData: FormData;
}

declare global {
	interface Window {
		petitionerFormSettings?: PetitionerFormSettings;
	}

	const petitionerCaptcha: PetitionerCaptcha | undefined;

	// Captcha class constructors (assuming they exist globally)
	class ReCaptcha {
		constructor(form: HTMLFormElement);
	}

	class HCaptcha implements CaptchaProvider {
		constructor(form: HTMLFormElement);
		validate(callback: CaptchaValidationCallback): void;
	}

	class Turnstile implements CaptchaProvider {
		constructor(form: HTMLFormElement);
		validate(callback: CaptchaValidationCallback): void;
	}
}

export {}; // This makes the file a module and ensures global declarations work
