import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { SubmissionItem } from '../submissions/consts';
import './simple-list/';
import './table-list/';

const ajaxUrl = window?.petitionerSubmissionSettings?.actionPath ?? '';
const nonce = window?.petitionerSubmissionSettings?.nonce ?? '';

if (!ajaxUrl || !nonce) {
	throw new Error('AJAX URL or nonce is not defined in settings');
}

/**
 *
 * <petitioner-submissions form-id="7" show_pagination="true" style="table" per_page="30" fields="name,city,submitted_at,date_of_birth"></petitioner-submissions>
 */
@customElement('petitioner-submissions')
export class PetitionerSubmissions extends LitElement {
	@property({ type: Number, attribute: 'form-id' }) formId = 0;
	@property({ type: Number, attribute: 'per-page' }) perPage = 10;
	@property({ type: String, attribute: 'form-style' }) formStyle = 'simple';
	@property({ type: String, attribute: 'fields' }) formFields = '';
	@property({ type: Boolean, attribute: 'show_pagination' }) showPagination =
		false;
	@property({ type: Object }) labels = {};
	@property({ type: String }) ajaxurl: string = ajaxUrl;
	@property({ type: String }) nonce: string = nonce;
	@property({ type: Number }) totalResults: number = 10;
	@property({ type: Array }) submissions: SubmissionItem[] = [];
	@property({ type: Number }) currentPage: number = 1;

	async fetchSubmissions() {
		const fetchURL = this.buildURL();
		console.log(fetchURL);
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

		this.labels = response.data.labels || [];
		console.log(this.totalResults);
		console.log(this.submissions);
		console.log(this.labels);
		console.log(response);
	}

	private buildURL() {
		const url = new URL(this.ajaxurl, window.location.origin);

		url.searchParams.set('form_id', String(this.formId));
		url.searchParams.set('per_page', String(this.perPage));
		url.searchParams.set('page', String(this.currentPage));

		if (this.formFields) {
			url.searchParams.set('fields', this.formFields);
		}

		return url.toString();
	}

	// async firstUpdated() {
	// 	await this.fetchSubmissions();
	//     this.requestUpdate();
	// }

	async connectedCallback() {
		super.connectedCallback();
		try {
			await this.fetchSubmissions();
		} catch (err) {
			console.error(err);
		}
	}

	getLabels() {
		return this.labels;
	}

	renderListComponent() {
		if (this.formStyle === 'table') {
			return html`<simple-list
				.submissions=${this.submissions}
				.labels=${this.labels}
			></simple-list>`;
		}
		return html`<table-list
			.submissions=${this.submissions}
			.labels=${this.labels}
		></table-list>`;
	}

	render() {
		return html`
            ${JSON.stringify(this.submissions)}
			<div class="submissions__list">${this.renderListComponent()}</div>
		`;
	}

	createRenderRoot() {
		return this; // render into light DOM, no shadow for backwards compatibility
	}
}
