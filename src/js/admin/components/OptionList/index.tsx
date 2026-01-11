import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import DndSortableProvider from '@admin/context/DndSortableProvider';
import type { OptionListProps } from './const';
import OptionRow from './OptionRow';
import { OptionsTable, TableBody, StyledTh } from './styled';

export default function OptionList({
	options,
	onOptionsChange,
}: OptionListProps) {
	const handleReorder = useCallback(
		(newOrder: string[]) => {
			onOptionsChange(newOrder);
		},
		[onOptionsChange]
	);

	if (options.length === 0) {
		return null;
	}

	return (
		<div data-testid="option-list">
			<DndSortableProvider items={options} onReorder={handleReorder}>
				<OptionsTable>
					<thead>
						<tr>
							<StyledTh $width={'32px'}></StyledTh>
							<StyledTh>{__('Value', 'petitioner')}</StyledTh>
							<StyledTh $width={'150px'}>
								{__('Show in forms', 'petitioner')}
							</StyledTh>
						</tr>
					</thead>
					<TableBody>
						{options.map((value) => (
							<OptionRow key={value} value={value} />
						))}
					</TableBody>
				</OptionsTable>
			</DndSortableProvider>
		</div>
	);
}
