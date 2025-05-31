import { Panel, PanelBody } from '@wordpress/components';
import DndSortableProvider from '@admin/context/DndSortableProvider';
import { BuilderField } from '@admin/types/form-builder.types';
import BuilderSettings from './BuilderSettings';
import {
	FormBuilderContextProvider,
	DRAGGABLE_FIELD_TYPES,
	useFormBuilderContext,
} from '@admin/context/FormBuilderContext';
import SortableField from './SortableField';

function generateUniqueFieldId() {
	return `field_${Date.now()}`;
}

function createDefaultField(type: string): BuilderField {
	return {
		type,
		fieldName: `New ${type}`,
		label: `${type} field`,
		required: false,
		removable: true,
		...(type === 'checkbox' && { defaultValue: false }),
		...(type === 'text' && { placeholder: 'Placeholder text' }),
	} as BuilderField;
}

function FormBuilderComponent() {
	const {
		fieldOrder,
		setFieldOrder,
		formBuilderFields,
		addFormBuilderField,
	} = useFormBuilderContext();

	const handleDragEnd = (result: DropResult) => {
		const { source, destination, draggableId } = result;

		if (!destination) return;

		// Dragged from the left palette into the form
		if (
			source.droppableId === 'field-palette' &&
			destination.droppableId === 'form-fields'
		) {
			const newFieldId = generateUniqueFieldId();
			const newField = createDefaultField(draggableId); // based on field type

			addFormBuilderField(newFieldId, newField);

			setFieldOrder((prev) => {
				const updated = [...prev];
				updated.splice(destination.index, 0, newFieldId);
				return updated;
			});
			return;
		}

		// Regular reordering inside form
		if (
			source.droppableId === 'form-fields' &&
			destination.droppableId === 'form-fields'
		) {
			const reordered = [...fieldOrder];
			const [moved] = reordered.splice(source.index, 1);
			reordered.splice(destination.index, 0, moved);
			setFieldOrder(reordered);
		}
	};

	console.log(fieldOrder);

	return (
		<DndSortableProvider
			items={fieldOrder}
			onReorder={setFieldOrder}
			onInsert={(fieldType, position) => {
				const newId = generateUniqueFieldId();
				const newField = createDefaultField(fieldType);
				addFormBuilderField(newId, newField);
				setFieldOrder((prev) => {
					const updated = [...prev];
					updated.splice(position, 0, newId);
					return updated;
				});
			}}
		>
			<input
				type="hidden"
				name="petitioner_form_fields"
				value={JSON.stringify(formBuilderFields)}
			/>
			<div
				className="ptr-form-builder"
				style={{
					display: 'flex',
					flexDirection: 'row',
					padding: '24px 16px',
				}}
			>
				<div
					className="ptr-form-builder__settings"
					style={{ width: '30%' }}
				>
					<BuilderSettings />
				</div>
				<div
					className="ptr-form-builder__form"
					style={{ width: '70%' }}
				>
					<Panel>
						<div className="ptr-form-builder__form-header">
							<h3>Form builder</h3>
							<p>
								Drag and drop fields to build your form. Click
								on each field to edit it's properties
							</p>
						</div>

						<PanelBody>
							{fieldOrder.map((fieldKey) => {
								return <SortableField id={fieldKey} />;
							})}
						</PanelBody>
					</Panel>
				</div>
			</div>
		</DndSortableProvider>
	);
}

export default function FormBuilder() {
	return (
		<FormBuilderContextProvider>
			<FormBuilderComponent />
		</FormBuilderContextProvider>
	);
}
