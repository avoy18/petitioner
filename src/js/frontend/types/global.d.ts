import { PetitionerCaptcha, PetitionerFormSettings } from './frontend';

declare global {
    interface Window {
        petitionerFormSettings?: PetitionerFormSettings;
        petitionerCaptcha?: PetitionerCaptcha;
    }
}

export {}; // This makes the file a module and ensures global declarations work
