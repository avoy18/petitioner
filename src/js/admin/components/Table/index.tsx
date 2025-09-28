import { TableHeading } from './styled';
import type { TableProps } from './consts';
import { Icon, Button } from '@wordpress/components';

export function Table({
	headings,
	rows,
	emptyMessage = 'No data available',
	className = '',
}: TableProps) {
	const hasRows = rows.length > 0;

	return (
		<table
			className={`wp-list-table widefat fixed striped table-view-list posts ${className}`}
		>
			<thead>
				<tr>
					{headings.map(({ width, label }, idx) => (
						<TableHeading key={idx} $width={width}>
							{label} 
                            {/* <Icon icon={'sort'} /> */}
							{/* <span className="dashicon dashicons dashicons-sort" /> */}
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
