import { PetitionerCaptcha, PetitionerFormSettings } from './form/consts';

declare global {
    interface Window {
        petitionerFormSettings?: PetitionerFormSettings;
        petitionerCaptcha?: PetitionerCaptcha;
        grecaptcha?: {
            ready: (callback: () => void) => void;
            execute: (siteKey: string, options?: { action?: string }) => Promise<string>;
        };
    }
}

export {}; // This makes the file a module and ensures global declarations work
