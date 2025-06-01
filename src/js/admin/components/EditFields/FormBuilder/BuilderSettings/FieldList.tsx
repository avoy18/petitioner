// FieldList.tsx
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { DRAGGABLE_FIELD_TYPES } from '@admin/context/FormBuilderContext';
import styled from 'styled-components';
import DragHandle from '@admin/components/shared/DragHandle';
import { __ } from '@wordpress/i18n';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { ref } from 'process';

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
	const { fieldOrder } = useFormBuilderContext();
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useDraggable({
			id,
			data: {
				from: 'palette',
				type: id,
			},
		});

	const alreadyExists = fieldOrder.includes(id);

	const style = {
		transform: CSS.Translate.toString(transform),
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 1000 : 'auto',
		cursor: isDragging ? 'grabbing' : 'grab',
	};

	const finalAttributes = !alreadyExists
		? {
				...listeners,
				...attributes,
				ref: setNodeRef,
				style,
			}
		: {
				style: {
					opacity: 0.5,
					cursor: 'not-allowed',
				},
			};

	return (
		<FieldPaletteItem {...finalAttributes}>
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
				{__(
					'Below is a list of additional fields you can add to your form.',
					'petitioner'
				)}
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
