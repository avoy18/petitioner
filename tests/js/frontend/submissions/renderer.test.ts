import { describe, it, expect, vi, beforeEach } from 'vitest';
import SubmissionsRenderer, { SubmissionsRendererTable } from '@js/frontend/submissions/renderer';
import type { SubmissionRendererOptions } from '@js/frontend/submissions/consts';

describe('SubmissionsRenderer', () => {
	let wrapper: HTMLDivElement;
	let defaultOptions: SubmissionRendererOptions;

	beforeEach(() => {
		wrapper = document.createElement('div');
		defaultOptions = {
			wrapper,
			submissions: [
				{ name: 'Alice' },
				{ name: 'Bob' }
			],
			perPage: 2,
			total: 10,
			currentPage: 1,
			labels: {},
			fields: ['name'],
			pagination: true,
			onPageChange: vi.fn().mockResolvedValue([
				{ name: 'Charlie' },
				{ name: 'David' }
			]),
		};
	});

	it('should throw an error if wrapper is not provided', () => {
		expect(() => new SubmissionsRenderer({ ...defaultOptions, wrapper: null as any })).toThrow('Element not found');
	});

	it('should render submissions correctly', () => {
		const renderer = new SubmissionsRenderer(defaultOptions);
		renderer.render();

		const list = wrapper.querySelector('.submissions__list');
		expect(list).not.toBeNull();
		expect(list?.innerHTML).toContain('Alice');
		expect(list?.innerHTML).toContain('Bob');
	});

	it('should not render pagination if total pages <= 1', () => {
		const renderer = new SubmissionsRenderer({ ...defaultOptions, total: 2, perPage: 2 });
		renderer.render();

		const pagination = wrapper.querySelector('.submissions__pagination');
		expect(pagination?.innerHTML).toBe('');
	});

	it('should render pagination correctly', () => {
		const renderer = new SubmissionsRenderer(defaultOptions);
		renderer.render();

		const pagination = wrapper.querySelector('.submissions__pagination');
		expect(pagination).not.toBeNull();
		
		const buttons = pagination?.querySelectorAll('button');
		expect(buttons).toBeDefined();
		expect(buttons?.length).toBeGreaterThan(0);
		
		const prevBtn = pagination?.querySelector('.ptr-pagination__item--prev') as HTMLButtonElement;
		expect(prevBtn.disabled).toBe(true);

		const nextBtn = pagination?.querySelector('.ptr-pagination__item--next') as HTMLButtonElement;
		expect(nextBtn.disabled).toBe(false);
		expect(nextBtn.dataset.page).toBe('2');
	});

	it('should handle pagination clicks and call onPageChange', async () => {
		const renderer = new SubmissionsRenderer(defaultOptions);
		renderer.render();

		const nextBtn = wrapper.querySelector('.ptr-pagination__item--next') as HTMLButtonElement;
		
		// Simulate click
		nextBtn.click();

		// Check if onPageChange was called with page 2
		expect(defaultOptions.onPageChange).toHaveBeenCalledWith(2);

		// Wait for microtasks to process (since onPageChange is awaited)
		await vi.waitFor(() => {
			expect(defaultOptions.submissions[0].name).toBe('Charlie');
			const list = wrapper.querySelector('.submissions__list');
			expect(list?.innerHTML).toContain('Charlie');
		});
	});

	describe('getPaginationRange (Private Method Math Logic)', () => {
		it('should calculate correct range for page 1 out of 8', () => {
			const renderer = new SubmissionsRenderer({ ...defaultOptions, total: 16 });
			// @ts-ignore - access private method for testing
			const range = renderer.getPaginationRange(8, 1);
			expect(range).toEqual([1, 2, '...', 8]);
		});

		it('should calculate correct range for page 4 out of 8', () => {
			const renderer = new SubmissionsRenderer({ ...defaultOptions, total: 16 });
			// @ts-ignore
			const range = renderer.getPaginationRange(8, 4);
			expect(range).toEqual([1, '...', 3, 4, 5, '...', 8]);
		});

		it('should calculate correct range for page 8 out of 8', () => {
			const renderer = new SubmissionsRenderer({ ...defaultOptions, total: 16 });
			// @ts-ignore
			const range = renderer.getPaginationRange(8, 8);
			expect(range).toEqual([1, '...', 7, 8]);
		});
	});

	describe('SubmissionsRendererTable', () => {
		it('should render table headings and items correctly', () => {
			const tableOptions = {
				...defaultOptions,
				fields: ['name', 'country'],
				labels: { name: 'Full Name', country: 'Country of Origin' },
				submissions: [
					{ name: 'Alice', country: 'USA' }
				]
			};

			const renderer = new SubmissionsRendererTable(tableOptions);
			renderer.render();

			const list = wrapper.querySelector('.submissions__list');
			expect(list).not.toBeNull();
			
			// Should contain heading
			expect(list?.innerHTML).toContain('submissions__item--heading');
			expect(list?.innerHTML).toContain('Full Name');
			expect(list?.innerHTML).toContain('Country of Origin');

			// Should contain row item with bold labels
			expect(list?.innerHTML).toContain('<strong>Full Name:</strong>');
			expect(list?.innerHTML).toContain('Alice');
			expect(list?.innerHTML).toContain('USA');
		});
	});

	describe('Options Updates', () => {
		it('should recalculate pagination when perPage is changed', () => {
			// Start with 10 total items, 5 per page = 2 pages
			const renderer = new SubmissionsRenderer({ ...defaultOptions, total: 10, perPage: 5 });
			renderer.render();

			let pagination = wrapper.querySelector('.ptr-pagination');
			expect(pagination?.querySelectorAll('button[data-page]:not(.ptr-pagination__item--prev):not(.ptr-pagination__item--next)').length).toBe(2); // Page 1 and 2

			// Change perPage to 2 = 5 pages
			renderer.options.perPage = 2;
			renderer.update();

			pagination = wrapper.querySelector('.ptr-pagination');
			const buttons = Array.from(pagination?.querySelectorAll('button[data-page]:not(.ptr-pagination__item--prev):not(.ptr-pagination__item--next)') || []);
			expect(buttons.length).toBe(3); // Pages 1, 2, and 5
			expect(buttons.map(b => b.textContent)).toEqual(['1', '2', '5']);
		});

		it('should only show prev/next buttons when hidePageNumbers is true', () => {
			const renderer = new SubmissionsRenderer({ ...defaultOptions, total: 10, perPage: 2, hidePageNumbers: true });
			renderer.render();

			let pagination = wrapper.querySelector('.ptr-pagination');
			
			// Verify prev and next exist
			const prevBtn = pagination?.querySelector('.ptr-pagination__item--prev');
			const nextBtn = pagination?.querySelector('.ptr-pagination__item--next');
			expect(prevBtn).not.toBeNull();
			expect(nextBtn).not.toBeNull();

			// Verify NO numeric buttons exist
			const numericButtons = pagination?.querySelectorAll('button[data-page]:not(.ptr-pagination__item--prev):not(.ptr-pagination__item--next)');
			expect(numericButtons?.length).toBe(0);

			// Verify NO ellipses exist
			const ellipses = pagination?.querySelectorAll('.ptr-pagination__dots');
			expect(ellipses?.length).toBe(0);
		});
	});
});
