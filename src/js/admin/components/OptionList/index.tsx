import { useCallback } from '@wordpress/element';
import { Panel, PanelBody, PanelHeader } from '@wordpress/components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DndSortableProvider from '@admin/context/DndSortableProvider';
import DragHandle from '@admin/components/DragHandle';
import type { OptionListProps } from './const';
import { RowWrapper, StyledOptionsList, OptionListLabel, StyledPanel } from './styled';

function OptionRow({ value }: { value: string }) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useSortable({ id: value });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: '0s',
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<RowWrapper ref={setNodeRef} style={style}>
			<DragHandle {...attributes} {...listeners} />
			<div>{value}</div>
		</RowWrapper>
	);
}

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
		</DndSortableProvider>
	);
}
