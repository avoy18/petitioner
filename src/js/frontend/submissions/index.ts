import { safelyParseJSON } from '@js/utilities';
import SubmissionsRenderer from '@js/frontend/submissions/renderer';
import type { SubmissionSettings, Submissions } from './consts';

declare global {
	interface Window {
		petitionerSubmissionSettings: {
			actionPath: string;
			nonce: string;
		};
	}
}

export default class PetitionerSubmissions {
	private settings?: SubmissionSettings;
	private submissions: Submissions | undefined;
	private renderer?: SubmissionsRenderer;
	private ajaxurl: string;
	private nonce: string;
	private currentPage: number = 1;
	private totalResults: number = 10;

	constructor(private wrapper: HTMLElement) {
		if (!this.wrapper) {
			throw new Error('Element not found');
		}

		const settings = this.wrapper.dataset.ptrSettings;
		this.ajaxurl = window?.petitionerSubmissionSettings?.actionPath || '';
		this.nonce = window?.petitionerSubmissionSettings?.nonce || '';

		if (!this.ajaxurl || !this.nonce) {
			throw new Error('AJAX URL or nonce is not defined in settings');
		}

		if (!settings) {
			throw new Error('Wrapper is missing data-ptr-settings attribute');
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

		await this.fetchSubmissions();

		if (
			typeof this.submissions === 'object' &&
			this.submissions?.length > 0
		) {
			this.renderer = new SubmissionsRenderer({
				wrapper: this.wrapper,
				submissions: this.submissions,
				perPage: this.settings.per_page,
				total: this.totalResults,
				currentPage: this.currentPage,
				onPageChange: async (pageNum: number) => {
					this.currentPage = pageNum;
					await this.fetchSubmissions();
					return this.submissions ?? [];
				},
			});

			this.renderer.render();
		}
	}

	private async fetchSubmissions() {
		const submissions = await fetch(
			`${this.ajaxurl}&form_id=${this.settings?.form_id}&per_page=${this.settings?.per_page}&page=${this.currentPage}`
		);

		if (!submissions.ok) {
			throw new Error('Failed to fetch submissions');
		}

		const response = await submissions.json();

		if (!response.success) {
			throw new Error('Failed to fetch submissions: ' + response.data);
		}

		console.log('Fetched submissions:', response.data);

		this.totalResults = Number(response.data.total) || 0;
		this.submissions = response.data.submissions || [];
	}
}
