import { useSortable } from '@dnd-kit/sortable';
import DragHandle from '@admin/components/DragHandle';
import { CSS } from '@dnd-kit/utilities';
import { __ } from '@wordpress/i18n';
import { ToggleControl } from '@wordpress/components';
import { RowWrapper, ToggleControlWrapper } from './styled';

export default function OptionRow({ value }: { value: string }) {
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
			<ToggleControlWrapper>
				<ToggleControl
					checked={false}
					onChange={(checked) => {
						console.log(checked);
					}}
					label={__('Active', 'petitioner')}
				/>
			</ToggleControlWrapper>
		</RowWrapper>
	);
}
