import { Draggable } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function PtrDraggable({ id, onDragStart, onDragEnd, children }) {
	const [selected, setSelected] = useState(false);
	return (
		<div style={{ opacity: selected ? '0.5' : '1' }} id={id}>
			<Draggable
				elementId={id}
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
