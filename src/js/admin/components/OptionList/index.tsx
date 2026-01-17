import { useCallback, useMemo } from '@wordpress/element';
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
	const uniqueOptions = useMemo(() => {
		return [...new Set(options)];
	}, [options]);

	const handleReorder = useCallback(
		(newOrder: OptionItem[]) => {
			onOptionsChange(newOrder);
		},
		[onOptionsChange]
	);

	const handleRemoveOption = useCallback(
		(optionToRemove: OptionItem) => {
			const updatedOptions = uniqueOptions.filter(
				(option) => option !== optionToRemove
			);
			onOptionsChange(updatedOptions);
		},
		[uniqueOptions, onOptionsChange]
	);

	if (uniqueOptions.length === 0) {
		return null;
	}

	return (
		<div data-testid="option-list">
			<DndSortableProvider items={uniqueOptions} onReorder={handleReorder}>
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
						{uniqueOptions.map((option) => (
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
