import { useSortable } from '@dnd-kit/sortable';
import DragHandle from '@admin/components/DragHandle';
import { CSS } from '@dnd-kit/utilities';
import { RowWrapper } from './styled';

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
		</RowWrapper>
	);
}
