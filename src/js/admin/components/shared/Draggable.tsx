import { Draggable } from '@wordpress/components';
import { useState } from '@wordpress/element';

type PtrDraggableProps = {
	id: string|undefined;
	onDragStart: (event: React.DragEvent) => void;
	onDragEnd: (event: React.DragEvent) => void;
	onClick: (event: React.MouseEvent) => void;
	children: React.ReactNode;
};

export default function PtrDraggable(props: PtrDraggableProps) {
	const { id, onDragStart, onDragEnd, onClick, onDragOver, children } = props;
	const [selected, setSelected] = useState(false);
	return (
		<div
			style={{ opacity: selected ? '0.5' : '1' }}
			id={id}
			onClick={onClick}
			className="ptr-draggable"
		>
			<Draggable
				elementId={id ?? ''}
				transferData={{}}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
			>
				{({ onDraggableStart, onDraggableEnd }) => (
					<div
						className="example-drag-handle"
						draggable
						onDragStart={(event) => {
							setSelected(true);
							onDraggableStart(event);
						}}
						onDragEnd={(event) => {
							setSelected(false);
							onDraggableEnd(event);
						}}
					>
						{children}
					</div>
				)}
			</Draggable>
		</div>
	);
}
