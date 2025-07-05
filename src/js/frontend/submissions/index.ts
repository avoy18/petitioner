import { safelyParseJSON } from '@js/utilities';
import SubmissionsRenderer from '@js/frontend/submissions/renderer';
import type { SubmissionSettings } from './consts';

const submissionData = {
	total: 22,
	data: [
		{
			id: 1,
			fname: 'Anton',
			lname: 'Voytenko',
			date: '2023-10-01',
		},
		{
			id: 2,
			fname: 'John',
			lname: 'Doe',
			date: '2023-10-02',
		},
		{
			id: 2,
			fname: 'John',
			lname: 'Doe',
			date: '2023-10-02',
		},
		{
			id: 2,
			fname: 'John',
			lname: 'Doe',
			date: '2023-10-02',
		},
	],
};

export default class PetitionerSubmissions {
	private settings?: SubmissionSettings;
	private submissions?: Record<string, unknown>[];
	private renderer?: SubmissionsRenderer;

	constructor(private wrapper: HTMLElement) {
		if (!this.wrapper) {
			throw new Error('Element not found');
		}

		const settings = this.wrapper.dataset.ptrSettings;

		if (!settings) {
			return;
		}

		const settingsJSON = safelyParseJSON(settings);

		if (
			!settingsJSON ||
			typeof settingsJSON !== 'object' ||
			!settingsJSON.form_id ||
			!settingsJSON.per_page
		) {
			throw new Error(
				'Invalid settings provided for PetitionerSubmissions'
			);
		}

		this.settings = settingsJSON as SubmissionSettings;

		this.init();
	}

	private async init() {
		if (!this.settings) {
			return;
		}

		this.submissions = await this.fetchSubmissions();

		this.renderer = new SubmissionsRenderer({
			wrapper: this.wrapper,
			submissions: this.submissions,
			onPageChange: () => {},
			fetchData: async (page: number) => {
				// Fetch data for the specified page
				return this.fetchSubmissions();
			},
		});

		this.renderer.render();
	}

	private async fetchSubmissions() {
		return [
			...submissionData.data,
			...submissionData.data,
			...submissionData.data,
			...submissionData.data,
			...submissionData.data,
			...submissionData.data,
			...submissionData.data,
			...submissionData.data,
			...submissionData.data,
			...submissionData.data,
			...submissionData.data,
		];
	}
}
