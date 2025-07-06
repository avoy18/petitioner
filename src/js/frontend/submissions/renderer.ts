import type { SubmissionItem, Submissions } from './consts';
import { __ } from '@wordpress/i18n';

/**
 * @class SubmissionsRenderer
 * Renders the submissions list and handles pagination.
 */
export default class SubmissionsRenderer {
	private paginationDiv: HTMLDivElement;
	private submissionListDiv: HTMLDivElement;

	constructor(
		private options: {
			wrapper: HTMLElement;
			submissions: Submissions; // initial submissions
			perPage?: number;
			total?: number;
			currentPage: number; // initial page
			onPageChange: (page: number) => Promise<Submissions>;
		}
	) {
		this.options.total = this.options.total || 20;
		this.options.perPage = this.options.perPage || 10;
		this.options.currentPage = this.options.currentPage || 1;

		this.submissionListDiv = document.createElement('div');
		this.submissionListDiv.className = 'submissions__list';

		this.paginationDiv = document.createElement('div');
		this.paginationDiv.className = 'submissions__pagination';

		if (!this.options.wrapper) {
			throw new Error('Element not found');
		}
	}

	private attachEventListeners() {
		if (!this.paginationDiv) return;

		this.paginationDiv.addEventListener('click', async (event) => {
			const target = event.target as HTMLElement;

			if (target.tagName === 'BUTTON') {
				const page = parseInt(target.dataset.page || '1', 10);
				if (!isNaN(page)) {
					this.options.currentPage = page;
					const newSubmissions =
						await this.options.onPageChange(page);
					this.options.submissions = newSubmissions;
					this.update();
				}
			}
		});
	}

	public render() {
		if (!this.options.submissions) {
			return;
		}

		this.options.wrapper.appendChild(this.submissionListDiv);
		this.options.wrapper.appendChild(this.paginationDiv);

		this.submissionListDiv.innerHTML = this.renderSubmissionsList();
		this.paginationDiv.innerHTML = this.renderPagination();

		this.attachEventListeners();
	}

	public update() {
		// Update the submissions list
		this.submissionListDiv.innerHTML = this.renderSubmissionsList();

		// Update the pagination
		this.paginationDiv.querySelectorAll('.active').forEach((btn) => {
			btn.classList.remove('active');
		});

		this.paginationDiv.querySelector(`[data-page="${this.options.currentPage}"]`)?.classList.add('active');
	}

	public renderSubmissionsList() {
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

	public renderSubmissionItem(submission: SubmissionItem): string {
		return `<span class="submissions__item">${submission.fname} ${submission.lname}</span>`;
	}

	public renderPagination(): string {
		if (!this.options.total || !this.options.perPage) {
			return '';
		}

		const totalPages = Math.ceil(this.options.total / this.options.perPage);

		if (totalPages <= 1) {
			return '';
		}

		let paginationHTML = '<div class="ptr-pagination">';

		for (let i = 1; i <= totalPages; i++) {
			paginationHTML += `<button class="ptr-pagination__item ${i === this.options.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
		}

		paginationHTML += '</div>';

		return paginationHTML;
	}
}
