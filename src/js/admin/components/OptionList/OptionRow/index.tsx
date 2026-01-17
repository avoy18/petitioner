import { useSortable } from '@dnd-kit/sortable';
import { __ } from '@wordpress/i18n';
import { CSS } from '@dnd-kit/utilities';
import { ToggleControl } from '@wordpress/components';
import DragHandle from '@admin/components/DragHandle';
import { Row, DragCell, ToggleCell, ValueCell } from './styled';
import type { OptionRowProps } from './consts';

export default function OptionRow({
	value,
	isActive = false,
	onToggle = () => {},
}: OptionRowProps) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useSortable({ id: value });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: '0s',
	};

	return (
		<Row ref={setNodeRef} style={style} $isDragging={isDragging}>
			<DragCell>
				<DragHandle {...attributes} {...listeners} />
			</DragCell>
			<ValueCell>{value}</ValueCell>
			<ToggleCell>
				<ToggleControl
					checked={isActive}
					onChange={(checked) => onToggle(value, checked)}
					label={__('Active', 'petitioner')}
				/>
			</ToggleCell>
		</Row>
	);
}
