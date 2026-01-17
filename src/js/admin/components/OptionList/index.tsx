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
			onOptionsChange(newOrder.map((value) => ({ value })));
		},
		[onOptionsChange]
	);

	const optionArray = options.map((option) => option.value);

	if (options.length === 0) {
		return null;
	}

	return (
		<div data-testid="option-list">
			<DndSortableProvider items={optionArray} onReorder={handleReorder}>
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
						{optionArray.length > 0 &&
							optionArray.map((value) => (
								<OptionRow
									key={value}
									value={value}
								/>
							))}
					</TableBody>
				</OptionsTable>
			</DndSortableProvider>
		</div>
	);
}
