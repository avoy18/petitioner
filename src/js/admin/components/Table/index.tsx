import { TableHeading, HeadingLabel } from './styled';
import type { TableProps, SortDirection, HeadingProps } from './consts';
import { useState, useCallback } from '@wordpress/element';

export function Table({
	headings,
	rows,
	emptyMessage = 'No data available',
	className = '',
	onSort = () => {},
}: TableProps) {
	const hasRows = rows.length > 0;

	const [sort, setSort] = useState<HeadingProps['id'] | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>();

	const handleSortChange = (id: HeadingProps['id']) => {
		setSort(id);

		const newDirection =
			sort === id ? (sortDirection === 'desc' ? 'asc' : 'desc') : 'desc';

		setSortDirection(newDirection);

		onSort({
			order: newDirection,
			orderby: id,
		});
	};

	return (
		<table
			className={`wp-list-table widefat fixed striped table-view-list posts ${className}`}
		>
			<thead>
				<tr>
					{headings.map(({ id, width, label }, idx) => (
						<TableHeading
							key={id}
							$width={width}
							className={
								sort !== id ? '' : `sorted ${sortDirection}`
							}
							onClick={() => {
								handleSortChange(id);
							}}
						>
							<HeadingLabel>
								{label}
								<div className="sorting-indicators">
									<span
										className="sorting-indicator asc"
										aria-hidden="true"
									></span>
									<span
										className="sorting-indicator desc"
										aria-hidden="true"
									></span>
								</div>
							</HeadingLabel>
						</TableHeading>
					))}
				</tr>
			</thead>

			{hasRows ? (
				<tbody>
					{rows.map((cells, rowIdx) => (
						<tr key={rowIdx}>
							{cells.map((cell, cellIdx) => (
								<td key={cellIdx}>{cell}</td>
							))}
						</tr>
					))}
				</tbody>
			) : (
				<tbody>
					<tr>
						<td
							colSpan={headings.length}
							style={{ textAlign: 'center' }}
						>
							{emptyMessage}
						</td>
					</tr>
				</tbody>
			)}
		</table>
	);
}
