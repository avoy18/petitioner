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
	onInsert?: (id: string, position: number) => void;
	children: React.ReactNode;
};

export default function DndSortableProvider({
	items,
	onReorder,
	onInsert,
	children,
}: Props) {
	const sensors = useSensors(useSensor(PointerSensor));

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) {
			return;
		}

		const isFromPalette = active.data.current?.from === 'palette';

		if (isFromPalette && onInsert) {
			const insertIndex = items.indexOf(over.id as string);
			onInsert(
				active.id as string,
				insertIndex >= 0 ? insertIndex : items.length
			);
		} else if (active.id !== over.id) {
			const oldIndex = items.indexOf(active.id as string);
			const newIndex = items.indexOf(over.id as string);
			onReorder(arrayMove(items, oldIndex, newIndex));
		}
	};

	return (
		<DndContext
			sensors={sensors}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={items}
				strategy={verticalListSortingStrategy}
			>
				{children}
			</SortableContext>
		</DndContext>
	);
}
