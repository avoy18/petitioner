import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';

type Props = {
	items: string[];
	onReorder: (newOrder: string[]) => void;
	children: React.ReactNode;
};

export default function DndSortableProvider({
	items,
	onReorder,
	children,
}: Props) {
	const sensors = useSensors(useSensor(PointerSensor));

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (active.id !== over?.id) {
			const oldIndex = items.indexOf(active.id as string);
			const newIndex = items.indexOf(over?.id as string);
			const reordered = arrayMove(items, oldIndex, newIndex);
			console.log('Reordered items:', reordered);
			onReorder(reordered);
		}
	};

	return (
		<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				{children}
			</SortableContext>
		</DndContext>
	);
}