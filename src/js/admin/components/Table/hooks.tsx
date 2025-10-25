import { useMemo } from '@wordpress/element';
import { Button } from '@wordpress/components';
import type { HeadingProps } from './consts';

/**
 * Hook for generating pagination buttons.
 * 
 * @param total - Total number of items
 * @param perPage - Number of items per page
 * @param currentPage - Current active page number
 * @param onPageChange - Callback when page changes
 * @returns Array of pagination button elements
 */
export const usePagination = (
	total: number,
	perPage: number,
	currentPage: number,
	onPageChange: (page: number) => void
) => {
	return useMemo(() => {
		const totalPages = Math.ceil(total / perPage);
		const buttons = [];

		for (let i = 1; i <= totalPages; i++) {
			buttons.push(
				<Button
					variant={currentPage !== i ? 'secondary' : 'primary'}
					key={i}
					onClick={() => onPageChange(i)}
					data-page={i}
				>
					{i}
				</Button>
			);
		}

		return buttons;
	}, [total, perPage, currentPage, onPageChange]);
};

/**
 * Hook for dynamically building table headings with optional conditional columns.
 * 
 * @param baseHeadings - Base heading configuration
 * @param conditionalHeadings - Array of conditional headings with their conditions
 * @returns Final array of table headings
 * 
 * @example
 * const headings = useTableHeadings(
 *   [{ id: 'name', label: 'Name' }],
 *   [{ condition: showStatus, heading: { id: 'status', label: 'Status' } }]
 * );
 */
export const useTableHeadings = (
	baseHeadings: HeadingProps[],
	conditionalHeadings: Array<{
		condition: boolean;
		heading: HeadingProps;
	}> = []
) => {
	return useMemo(() => {
		const finalHeadings = [...baseHeadings];

		conditionalHeadings.forEach(({ condition, heading }) => {
			if (condition) {
				finalHeadings.push(heading);
			}
		});

		return finalHeadings;
	}, [baseHeadings, conditionalHeadings]);
};