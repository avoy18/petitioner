import { TableHeading, HeadingLabel, StyledTable } from './styled';
import type { TableProps, SortDirection, HeadingProps } from './consts';
import { useState } from '@wordpress/element';

export * from './hooks';

export function Table({
	headings,
	rows,
	emptyMessage = 'No data available',
	className = '',
	clickable = false,
	onSort = () => {},
	onItemSelect = () => {},
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
		<StyledTable
			$clickable={clickable}
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
					{rows.map(({ cells, id }, rowIdx) => (
						<tr onClick={() => onItemSelect(id)} key={id}>
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
		</StyledTable>
	);
}
