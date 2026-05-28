import {
	describe,
	it,
	expect,
	vi,
	beforeAll,
	beforeEach,
	afterAll,
	afterEach,
} from 'vitest';
import PetitionerSubmissions from '@js/frontend/submissions';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const NONCE = 'test_nonce_abc';
const AJAX_URL = 'http://localhost:1337/wp-admin/admin-ajax.php?action=petitioner_get_submissions';

const MOCK_SUBMISSIONS = [
	{ name: 'Alice', email: 'alice@example.com', submitted_at: '2026-05-20 10:00:00', is_featured: '0' },
	{ name: 'Bob', email: 'bob@example.com', submitted_at: '2026-05-21 14:30:00', is_featured: '1' },
	{ name: 'Charlie', email: 'charlie@example.com', submitted_at: '2026-05-22 09:15:00', is_featured: '0' },
];

const MOCK_LABELS = {
	name: 'Name',
	email: 'Email',
	submitted_at: 'Date',
};

const VALID_SETTINGS = {
	form_id: 348,
	per_page: 10,
	style: 'simple',
	fields: 'name, email, submitted_at',
	show_pagination: true,
	hide_page_numbers: false,
};

const restHandlers = [
	http.get('http://localhost:1337/wp-admin/admin-ajax.php', () => {
		return HttpResponse.json({
			success: true,
			data: {
				submissions: MOCK_SUBMISSIONS,
				total: 25,
				labels: MOCK_LABELS,
			},
		});
	}),
];

const server = setupServer(...restHandlers);

describe('PetitionerSubmissions', () => {
	let wrapper: HTMLDivElement;

	beforeAll(() => {
		server.listen({ onUnhandledRequest: 'error' });
	});

	afterAll(() => {
		server.close();
	});

	afterEach(() => {
		server.resetHandlers();
		wrapper?.remove();
	});

	beforeEach(() => {
		wrapper = document.createElement('div');
		wrapper.className = 'petitioner-submissions';
		document.body.appendChild(wrapper);

		window.petitionerSubmissionSettings = {
			actionPath: AJAX_URL,
			nonce: NONCE,
			labels: {
				prevPage: 'Previous page',
				nextPage: 'Next page',
			},
		};
	});

	describe('Constructor validation', () => {
		it('should throw if wrapper is falsy', () => {
			expect(() => new PetitionerSubmissions(null as any)).toThrow(
				'Element not found'
			);
		});

		it('should throw if AJAX URL is missing from global settings', () => {
			window.petitionerSubmissionSettings = {
				actionPath: '',
				nonce: NONCE,
			};

			wrapper.dataset.ptrSettings = JSON.stringify(VALID_SETTINGS);

			expect(() => new PetitionerSubmissions(wrapper)).toThrow(
				'AJAX URL or nonce is not defined in settings'
			);
		});

		it('should throw if nonce is missing from global settings', () => {
			window.petitionerSubmissionSettings = {
				actionPath: AJAX_URL,
				nonce: '',
			};

			wrapper.dataset.ptrSettings = JSON.stringify(VALID_SETTINGS);

			expect(() => new PetitionerSubmissions(wrapper)).toThrow(
				'AJAX URL or nonce is not defined in settings'
			);
		});

		it('should throw if data-ptr-settings attribute is missing', () => {
			expect(() => new PetitionerSubmissions(wrapper)).toThrow(
				'Wrapper is missing data-ptr-settings attribute'
			);
		});

		it('should throw if data-ptr-settings contains invalid JSON', () => {
			wrapper.dataset.ptrSettings = 'not valid json';

			expect(() => new PetitionerSubmissions(wrapper)).toThrow(
				'Invalid settings provided for PetitionerSubmissions'
			);
		});

		it('should throw if settings are missing required fields', () => {
			wrapper.dataset.ptrSettings = JSON.stringify({
				form_id: 348,
				// missing per_page, style
			});

			expect(() => new PetitionerSubmissions(wrapper)).toThrow(
				'Invalid settings provided for PetitionerSubmissions'
			);
		});
	});

	describe('Initialization and rendering (simple style)', () => {
		it('should fetch submissions and render a simple list', async () => {
			wrapper.dataset.ptrSettings = JSON.stringify(VALID_SETTINGS);

			new PetitionerSubmissions(wrapper);

			// Wait for async init to complete
			await vi.waitFor(() => {
				const list = wrapper.querySelector('.submissions__list');
				expect(list).not.toBeNull();
				expect(list?.innerHTML).toContain('Alice');
			});

			const list = wrapper.querySelector('.submissions__list');
			expect(list?.innerHTML).toContain('Bob');
			expect(list?.innerHTML).toContain('Charlie');
		});

		it('should render pagination when total exceeds per_page', async () => {
			wrapper.dataset.ptrSettings = JSON.stringify(VALID_SETTINGS);

			new PetitionerSubmissions(wrapper);

			await vi.waitFor(() => {
				const pagination = wrapper.querySelector('.submissions__pagination');
				expect(pagination?.innerHTML).toContain('ptr-pagination');
			});

			const paginationDiv = wrapper.querySelector('.submissions__pagination');
			const prevBtn = paginationDiv?.querySelector('.ptr-pagination__item--prev') as HTMLButtonElement;
			const nextBtn = paginationDiv?.querySelector('.ptr-pagination__item--next') as HTMLButtonElement;

			// On page 1, prev should be disabled
			expect(prevBtn?.disabled).toBe(true);
			// There are more pages, so next should be enabled
			expect(nextBtn?.disabled).toBe(false);
		});

		it('should not render pagination when disabled in settings', async () => {
			wrapper.dataset.ptrSettings = JSON.stringify({
				...VALID_SETTINGS,
				show_pagination: false,
			});

			new PetitionerSubmissions(wrapper);

			await vi.waitFor(() => {
				const list = wrapper.querySelector('.submissions__list');
				expect(list).not.toBeNull();
			});

			const paginationDiv = wrapper.querySelector('.submissions__pagination');
			expect(paginationDiv?.innerHTML).toBe('');
		});
	});

	describe('Initialization and rendering (table style)', () => {
		it('should render a table-style layout with headings', async () => {
			wrapper.dataset.ptrSettings = JSON.stringify({
				...VALID_SETTINGS,
				style: 'table',
			});

			new PetitionerSubmissions(wrapper);

			await vi.waitFor(() => {
				const list = wrapper.querySelector('.submissions__list');
				expect(list?.innerHTML).toContain('submissions__item--heading');
			});

			const list = wrapper.querySelector('.submissions__list');
			// Should contain column headings from labels
			expect(list?.innerHTML).toContain('Name');
			expect(list?.innerHTML).toContain('Email');
			expect(list?.innerHTML).toContain('Date');
		});

		it('should set CSS custom property for column count', async () => {
			wrapper.dataset.ptrSettings = JSON.stringify({
				...VALID_SETTINGS,
				style: 'table',
			});

			new PetitionerSubmissions(wrapper);

			await vi.waitFor(() => {
				const list = wrapper.querySelector('.submissions__list');
				expect(list).not.toBeNull();
			});

			expect(wrapper.style.cssText).toContain('--ptr-submission-columns');
		});
	});

	describe('Empty submissions', () => {
		it('should not render list items when submissions are empty', async () => {
			let isResolved = false;
			server.use(
				http.get('http://localhost:1337/wp-admin/admin-ajax.php', () => {
					isResolved = true;
					return HttpResponse.json({
						success: true,
						data: {
							submissions: [],
							total: 0,
							labels: MOCK_LABELS,
						},
					});
				})
			);

			wrapper.dataset.ptrSettings = JSON.stringify(VALID_SETTINGS);

			new PetitionerSubmissions(wrapper);

			// Wait deterministically for the API request to complete
			await vi.waitFor(() => {
				expect(isResolved).toBe(true);
			});

			// Flush microtasks so the component's async init() chain finishes processing the response
			await new Promise((resolve) => setTimeout(resolve, 0));

			const list = wrapper.querySelector('.submissions__list');
			// With empty submissions, the renderer is never created
			expect(list).toBeNull();
		});
	});


	describe('Pagination interaction', () => {
		it('should update submissions when next page button is clicked', async () => {
			const page2Submissions = [
				{ name: 'Dave', email: 'dave@example.com', submitted_at: '2026-05-23 11:00:00', is_featured: '0' },
				{ name: 'Eve', email: 'eve@example.com', submitted_at: '2026-05-24 15:00:00', is_featured: '0' },
			];

			let requestCount = 0;
			server.use(
				http.get('http://localhost:1337/wp-admin/admin-ajax.php', ({ request }) => {
					requestCount++;
					const url = new URL(request.url);
					const page = url.searchParams.get('page') || '1';

					return HttpResponse.json({
						success: true,
						data: {
							submissions: page === '2' ? page2Submissions : MOCK_SUBMISSIONS,
							total: 25,
							labels: MOCK_LABELS,
						},
					});
				})
			);

			wrapper.dataset.ptrSettings = JSON.stringify(VALID_SETTINGS);

			new PetitionerSubmissions(wrapper);

			// Wait for initial render
			await vi.waitFor(() => {
				const list = wrapper.querySelector('.submissions__list');
				expect(list?.innerHTML).toContain('Alice');
			});

			// Click the next page button
			const nextBtn = wrapper.querySelector('.ptr-pagination__item--next') as HTMLButtonElement;
			expect(nextBtn).not.toBeNull();
			nextBtn.click();

			// Wait for page 2 to render
			await vi.waitFor(() => {
				const list = wrapper.querySelector('.submissions__list');
				expect(list?.innerHTML).toContain('Dave');
			});

			const list = wrapper.querySelector('.submissions__list');
			expect(list?.innerHTML).toContain('Eve');
			expect(list?.innerHTML).not.toContain('Alice');
		});
	});
});
