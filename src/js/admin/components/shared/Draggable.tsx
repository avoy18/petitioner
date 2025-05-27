// PtrDraggable.tsx (updated to use native drag)
import { useState } from '@wordpress/element';

export type PtrDraggableProps = {
	id?: string;
	onDragStart: (event: React.DragEvent) => void;
	onDragEnd: (event: React.DragEvent) => void;
	onClick: (event: React.MouseEvent) => void;
	onDragOver?: (event: React.DragEvent) => void;
	children: React.ReactNode;
};

export default function PtrDraggable(props: PtrDraggableProps) {
	const { id, onDragStart, onDragEnd, onClick, onDragOver, children } = props;
	const [selected, setSelected] = useState(false);

	return (
		<div
			id={id}
			className={`ptr-draggable ${selected ? ' ptr-draggable--selected' : ''}`}
			onClick={onClick}
		>
			<div
				draggable
				onDragStart={(event) => {
					setSelected(true);
					onDragStart(event);
				}}
				onDragEnd={(event) => {
					setSelected(false);
					onDragEnd(event);
				}}
				onDragOver={onDragOver}
			>
				{children}
			</div>
		</div>
	);
}
