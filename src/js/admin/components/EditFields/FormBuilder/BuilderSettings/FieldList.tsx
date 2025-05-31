// FieldList.tsx
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { DRAGGABLE_FIELD_TYPES } from '@admin/context/FormBuilderContext';
import styled from 'styled-components';
import DragHandle from '@admin/components/shared/DragHandle';
import { __ } from '@wordpress/i18n';
const FieldPaletteWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;

const FieldPaletteItem = styled.div`
	padding: 4px 8px;
	border-radius: 4px;
	background: rgba(00, 00, 00, 0.01);
	border: 1px solid rgba(00, 00, 00, 0.1);
	cursor: grab;
	display: flex;
	align-items: center;
	gap: 4px;
`;

function PaletteDraggable({ id, label }: { id: string; label: string }) {
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id,
		});

	const style = {
		transform: CSS.Translate.toString(transform),
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<FieldPaletteItem
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
		>
			<DragHandle />
			{label}
		</FieldPaletteItem>
	);
}

export default function FieldList() {
	return (
		<FieldPaletteWrapper>
			<h3>{__('Available fields', 'petitioner')}</h3>
			<p>
				{__('Drag and drop fields to add to your form. Click on each field to edit its properties.', 'petitioner')}
			</p>
			{DRAGGABLE_FIELD_TYPES.map((field) => (
				<PaletteDraggable
					key={field.key}
					id={field.key as string}
					label={field.fieldName}
				/>
			))}
		</FieldPaletteWrapper>
	);
}
