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
		(newOrder: string[]) => {
			onOptionsChange(
				newOrder.flatMap((id) => {
					const option = options.find((item) => item.value === id);

					return option ? [option] : [];
				})
			);
		},
		[options, onOptionsChange]
	);

	const handleRemoveOption = useCallback(
		(optionToRemove: OptionItem) => {
			onOptionsChange(
				options.filter((option) => option.value !== optionToRemove.value)
			);
		},
		[options, onOptionsChange]
	);

	if (options.length === 0) {
		return null;
	}

	return (
		<div data-testid="option-list">
			<DndSortableProvider
				items={options.map((option) => option.value)}
				onReorder={handleReorder}
			>
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
						{options.map((option) => (
							<OptionRow
								key={option.value}
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
