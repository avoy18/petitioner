// DndSortableProvider.tsx
import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
	DragStartEvent,
} from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';
import { useState } from '@wordpress/element';

type Props = {
	items: string[];
	onReorder: (newOrder: string[]) => void;
	onInsert?: (type: string, position: number) => void;
	children: React.ReactNode;
};

export default function DndSortableProvider({
	items,
	onReorder,
	onInsert,
	children,
}: Props) {
	const sensors = useSensors(useSensor(PointerSensor));
	const [activeId, setActiveId] = useState<string | null>(null);
	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) {
			setActiveId(null);
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
		setActiveId(null);
	};

	return (
		<DndContext
			sensors={sensors}
			onDragStart={handleDragStart}
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
