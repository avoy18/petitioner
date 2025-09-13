import { safelyParseJSON } from '@js/utilities';
import SubmissionsRenderer, {
	SubmissionsRendererTable,
} from '@js/frontend/submissions/renderer';
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
	private labels: { [key: string]: string } | {};

	constructor(private wrapper: HTMLElement) {
		if (!this.wrapper) {
			throw new Error('Element not found');
		}

		const settings = this.wrapper.dataset.ptrSettings;
		this.ajaxurl = window?.petitionerSubmissionSettings?.actionPath || '';
		this.nonce = window?.petitionerSubmissionSettings?.nonce || '';
		this.labels = {};

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
			!settingsJSON.per_page ||
			!settingsJSON.style
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
			const RenderClass =
				this.settings.style === 'simple'
					? SubmissionsRenderer
					: SubmissionsRendererTable;

			this.renderer = new RenderClass({
				wrapper: this.wrapper,
				submissions: this.submissions,
				perPage: this.settings.per_page,
				total: this.totalResults,
				currentPage: this.currentPage,
				labels: this.labels,
				fields: this.settings.fields
					? this.settings.fields.split(',').map((f) => f.trim())
					: [],
				pagination: this.settings.show_pagination,
				onPageChange: async (pageNum: number) => {
					this.currentPage = pageNum;
					await this.fetchSubmissions();
					return this.submissions ?? [];
				},
			});

			this.renderer.render();
		}
	}

	private buildURL() {
		const url = new URL(this.ajaxurl, window.location.origin);

		url.searchParams.set('form_id', String(this.settings?.form_id));
		url.searchParams.set('per_page', String(this.settings?.per_page));
		url.searchParams.set('page', String(this.currentPage));

		if (this.settings?.fields) {
			url.searchParams.set('fields', this.settings.fields);
		}

		return url.toString();
	}

	private async fetchSubmissions() {
		const fetchURL = this.buildURL();
		const submissions = await fetch(fetchURL);

		if (!submissions.ok) {
			throw new Error('Failed to fetch submissions');
		}

		const response = await submissions.json();

		if (!response.success) {
			throw new Error('Failed to fetch submissions: ' + response.data);
		}

		this.totalResults = Number(response.data.total) || 0;
		this.submissions = response.data.submissions || [];
		console.log(this.submissions);
		console.log(this.submissions);
		this.labels = response.data.labels || [];
	}
}
