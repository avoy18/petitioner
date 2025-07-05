import { safelyParseJSON } from '@js/utilities';

type SubmissionSettings = {
    form_id: number;
    per_page: number;
}

export default class PetitionerSubmissions {
    private settings?: SubmissionSettings;

	constructor(private wrapper: HTMLElement) {
		if (!this.wrapper) {
			throw new Error('Element not found');
		}

		const settings = this.wrapper.dataset.ptrSettings;

		if (!settings) {
			return;
		}

        const settingsJSON = safelyParseJSON(settings);

        if(!settingsJSON || typeof settingsJSON !== 'object' || !settingsJSON.form_id || !settingsJSON.per_page) {
            throw new Error('Invalid settings provided for PetitionerSubmissions');
        }

		this.settings = settingsJSON as SubmissionSettings;

        this.init();
	}

    private init() {
        console.log('initialized with the settings:', this.settings);
    }

}
