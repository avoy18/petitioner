import { useCallback } from '@wordpress/element';
import { PanelBody, PanelHeader } from '@wordpress/components';
import DndSortableProvider from '@admin/context/DndSortableProvider';
import type { OptionListProps } from './const';
import OptionRow from './OptionRow';
import { StyledOptionsList, OptionListLabel, StyledPanel } from './styled';

export default function OptionList({
	label,
	options,
	maxHeight = 500,
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
		<DndSortableProvider items={options} onReorder={handleReorder}>
			<div data-testid="option-list">
				<StyledPanel>
					<PanelHeader>
						{label && <OptionListLabel>{label}</OptionListLabel>}
					</PanelHeader>
					<PanelBody>
						<StyledOptionsList $maxHeight={maxHeight}>
							{options.map((value) => (
								<OptionRow key={value} value={value} />
							))}
						</StyledOptionsList>
					</PanelBody>
				</StyledPanel>
			</div>
		</DndSortableProvider>
	);
}
