import type { SubmissionItem, SubmissionRendererOptions } from './consts';

/**
 * @class SubmissionsRenderer
 * Renders the submissions list and handles pagination.
 */
export default class SubmissionsRenderer {
	public paginationDiv: HTMLDivElement;
	public submissionListDiv: HTMLDivElement;
	public prevPageLabel: string;
	public nextPageLabel: string;

	constructor(public options: SubmissionRendererOptions) {
		this.options.currentPage = this.options.currentPage || 1;

		this.submissionListDiv = document.createElement('div');
		this.submissionListDiv.className = 'submissions__list';

		this.paginationDiv = document.createElement('div');
		this.paginationDiv.className = 'submissions__pagination';

		this.prevPageLabel = window?.petitionerSubmissionSettings?.labels?.prevPage || 'Previous page';
		this.nextPageLabel = window?.petitionerSubmissionSettings?.labels?.nextPage || 'Next page';

		if (!this.options.wrapper) {
			throw new Error('Element not found');
		}
	}

	public attachEventListeners() {
		if (!this.paginationDiv) return;

		this.paginationDiv.addEventListener('click', async (event) => {
			const target = event.target as HTMLButtonElement;

			if (target && !target.disabled && target.dataset.page) {
				const page = parseInt(target.dataset.page, 10);
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

		// Update the pagination completely to reflect ellipses and new active states
		this.paginationDiv.innerHTML = this.renderPagination();
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
		return `<span class="submissions__item">${submission.name}</span>`;
	}

	private getPaginationRange(
		totalPages: number,
		currentPage: number
	): (number | string)[] {
		const initialPagesToShow = 1;
		const adjacentPages = 1;
		const range: number[] = [];
		const rangeWithDots: (number | string)[] = [];
		let lastNum = 0;

		// Determine which page numbers to show
		for (let i = 1; i <= totalPages; i++) {
			if (
				i <= initialPagesToShow ||
				i === totalPages ||
				(i >= currentPage - adjacentPages &&
					i <= currentPage + adjacentPages)
			) {
				range.push(i);
			}
		}

		// Insert ellipses where there are gaps
		for (const i of range) {
			if (lastNum > 0 && i - lastNum !== 1) {
				rangeWithDots.push('...');
			}
			rangeWithDots.push(i);
			lastNum = i;
		}

		return rangeWithDots;
	}

	public renderPagination(): string {
		if (
			!this.options.total ||
			!this.options.perPage ||
			!this.options.pagination
		) {
			return '';
		}

		const totalPages = Math.ceil(this.options.total / this.options.perPage);

		if (totalPages <= 1) {
			return '';
		}

		const currentPage = this.options.currentPage || 1;
		let paginationHTML = '<div class="ptr-pagination">';

		// Prev Button
		if (currentPage > 1) {
			paginationHTML += `<button class="ptr-pagination__item ptr-pagination__item--prev" data-page="${currentPage - 1}" aria-label="${this.prevPageLabel}">&lsaquo;</button>`;
		} else {
			paginationHTML += `<button class="ptr-pagination__item ptr-pagination__item--prev" disabled aria-label="${this.prevPageLabel}">&lsaquo;</button>`;
		}

		if (!this.options.hidePageNumbers) {
			const rangeWithDots = this.getPaginationRange(totalPages, currentPage);

			// Render the numbers and dots
			for (const page of rangeWithDots) {
				if (page === '...') {
					paginationHTML += `<span class="ptr-pagination__dots">...</span>`;
				} else {
					paginationHTML += `<button class="ptr-pagination__item ${page === currentPage ? 'active' : ''}" data-page="${page}">${page}</button>`;
				}
			}
		}

		// Next Button
		if (currentPage < totalPages) {
			paginationHTML += `<button class="ptr-pagination__item ptr-pagination__item--next" data-page="${currentPage + 1}" aria-label="${this.nextPageLabel}">&rsaquo;</button>`;
		} else {
			paginationHTML += `<button class="ptr-pagination__item ptr-pagination__item--next" disabled aria-label="${this.nextPageLabel}">&rsaquo;</button>`;
		}

		paginationHTML += '</div>';

		return paginationHTML;
	}
}

export class SubmissionsRendererTable extends SubmissionsRenderer {
	constructor(public options: SubmissionRendererOptions) {
		super(options);
	}

	public render() {
		if (!this.options.submissions) {
			return;
		}

		this.options.wrapper.appendChild(this.submissionListDiv);
		this.options.wrapper.appendChild(this.paginationDiv);
		this.options.wrapper.style = this.getWrapperStyles();
		this.submissionListDiv.innerHTML = this.renderSubmissionsList();
		this.paginationDiv.innerHTML = this.renderPagination();

		this.attachEventListeners();
	}

	public renderSubmissionsList() {
		if (
			!this.options.submissions ||
			this.options.submissions.length === 0
		) {
			return '';
		}

		const labels = this.prepareLabels();

		const list = this.options.submissions
			.map((submission) => {
				return this.renderSubmissionItem(submission);
			})
			.join('');

		return `
		<div class="submissions__item submissions__item--heading">
			${labels
				.map((key) => {
					return `<div>${key}</div>`;
				})
				.join('')}
		</div>
		${list}`;
	}

	public prepareLabels() {
		// get 1 entry from submissions and map out existing fields
		const labels: string[] = [];
		const submissionEntry = this.options.submissions[0];

		Object.keys(submissionEntry).forEach((key: string) => {
			if (
				!this.options.labels?.[key] ||
				!this.options.fields.includes(key)
			) {
				return;
			}

			labels.push(this.options.labels?.[key]);
		});

		return labels;
	}

	public renderSubmissionItem(submission: SubmissionItem): string {
		const filteredKeys = Object.keys(submission).filter(
			(key) =>
				this.options.labels &&
				key in this.options.labels &&
				this.options.fields.includes(key)
		);

		return `<div class="submissions__item">
			${filteredKeys
				.map((key) => {
					const renderedValue =
						key === 'fname'
							? `${submission.fname} ${submission.lname}`
							: submission?.[key];
					return `<div class="submissions__item__inner">
						<strong>${this.options.labels?.[key] || key}:</strong>
						${renderedValue ? renderedValue : ''}
					</div>`;
				})
				.join('')}
		</div>`;
	}

	/**
	 *
	 * @returns string final CSS for the wrapper
	 */
	public getWrapperStyles() {
		const labels = this.prepareLabels();
		return `--ptr-submission-columns: ${labels.length}`;
	}
}
