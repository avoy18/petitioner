import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import DndSortableProvider from '@admin/context/DndSortableProvider';
import type { OptionListProps } from './const';
import OptionRow from './OptionRow';
import { OptionsTable, TableBody, StyledTh } from './styled';
import type { OptionItem } from '@admin/sections/EditFields/FormBuilder/consts';

export default function OptionList({
	options,
	onOptionsChange,
}: OptionListProps) {
	const handleReorder = useCallback(
		(newOrder: OptionItem[]) => {
			onOptionsChange(newOrder);
		},
		[onOptionsChange]
	);

	const handleRemoveOption = useCallback(
		(optionToRemove: OptionItem) => {
			const updatedOptions = options.filter(
				(option) => option !== optionToRemove
			);
			onOptionsChange(updatedOptions);
		},
		[options, onOptionsChange]
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
							<StyledTh $width={'150px'} $align="right">
								{__('Actions', 'petitioner')}
							</StyledTh>
						</tr>
					</thead>
					<TableBody>
						{options.length > 0 &&
							options.map((option) => (
								<OptionRow
									key={option}
									value={option}
									onRemove={handleRemoveOption}
								/>
							))}
					</TableBody>
				</OptionsTable>
			</DndSortableProvider>
		</div>
	);
}
