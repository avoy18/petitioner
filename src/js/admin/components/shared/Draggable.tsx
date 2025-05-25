import { Draggable } from '@wordpress/components';
import { DraggableProps } from '@wordpress/components/build-types/draggable/types';
import { useState } from '@wordpress/element';

type DraggableProps = {
	id: string|undefined;
	onDragStart: (event: React.DragEvent) => void;
	onDragEnd: (event: React.DragEvent) => void;
	onClick: (event: React.MouseEvent) => void;
	children: React.ReactNode;
};

export default function PtrDraggable(props: DraggableProps) {
	const { id, onDragStart, onDragEnd, onClick, children } = props;
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
