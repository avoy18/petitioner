import type { SubmissionItem, Submissions } from './consts';
import { __ } from '@wordpress/i18n';

export default class SubmissionsRenderer {
	constructor(
		private options: {
			wrapper: HTMLElement;
			submissions: Submissions | null;
			perPage?: number;
			total?: number;
			currentPage: number;
			onPageChange: (page: number) => void;
		}
	) {
		this.options.total = 20;
		this.options.perPage = 10;
		this.options.currentPage = this.options.currentPage || 1;

		if (!this.options.wrapper) {
			throw new Error('Element not found');
		}
	}

	public render() {
		if (!this.options.submissions) {
			return;
		}

		this.options.wrapper.innerHTML = this.getTemplate();
	}

	private getTemplate(): string {
		if (!this.options.submissions) {
			return '';
		}

		return `<section>
            <div class="submissions__list">
                <p>${this.renderSubmissionsList()}</p>
            </div>
            <div class="submissions__pagination">${this.renderPagination()}</div>
        </section>`;
	}

	private renderSubmissionsList() {
		if (
			!this.options.submissions ||
			this.options.submissions.length === 0
		) {
			return '';
		}

		return this.options.submissions
			.map((submission) => {
				return this.renderSubmissionItem(submission);
			})
			.join(', ');
	}

	private renderSubmissionItem(submission: SubmissionItem): string {
		return `<span class="submissions__item">${submission.fname} ${submission.lname}</span>`;
	}

	private renderPagination(): string {
		if (!this.options.total || !this.options.perPage) {
			return '';
		}
		const totalPages = Math.ceil(this.options.total / this.options.perPage);
		let paginationHTML = '<div class="ptr-pagination">';

		// Previous button
		paginationHTML += `<button onclick="${this.options.onPageChange(this.options.currentPage - 1)}" class="ptr-pagination__prev" data-page="prev" ${totalPages <= 1 ? 'disabled' : ''}> << </button>`;

		for (let i = 1; i <= totalPages; i++) {
			paginationHTML += `<button onclick="${this.options.onPageChange(i)}" class="ptr-pagination__item ${i === this.options.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
		}

		// Next button
		paginationHTML += `<button onclick="${this.options.onPageChange(this.options.currentPage + 1)}" class="ptr-pagination__next" data-page="next" ${totalPages <= 1 ? 'disabled' : ''}> >> </button>`;

		paginationHTML += '</div>';

		return paginationHTML;
	}
}
