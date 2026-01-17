import { useSortable } from '@dnd-kit/sortable';
import { __ } from '@wordpress/i18n';
import { CSS } from '@dnd-kit/utilities';
import DragHandle from '@admin/components/DragHandle';
import { Row, DragCell, ValueCell } from './styled';
import { Button } from '@wordpress/components';

import type { OptionRowProps } from './consts';

export default function OptionRow({ value }: OptionRowProps) {
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
			<ValueCell>
				<Button
					showTooltip={true}
					icon="trash"
					isDestructive={true}
					variant="secondary"
					size="small"
					label={__('Remove option', 'petitioner')}
					onClick={() => {}}
				/>
			</ValueCell>
		</Row>
	);
}
