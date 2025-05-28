import { Panel, PanelBody } from '@wordpress/components';
import { useRef, useState, useEffect } from '@wordpress/element';
import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from 'react-beautiful-dnd';
import BuilderSettings from './BuilderSettings';
import {
	FormBuilderContextProvider,
	DRAGGABLE_FIELD_TYPES,
	useFormBuilderContext,
} from '@admin/context/FormBuilderContext';
import DynamicField from './DynamicField';

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

function FieldList() {
	return (
		<Droppable droppableId="field-palette" isDropDisabled={true}>
			{(provided) => (
				<div ref={provided.innerRef} {...provided.droppableProps}>
					{DRAGGABLE_FIELD_TYPES.map((fieldType, index) => (
						<Draggable
							key={fieldType.key}
							draggableId={fieldType.key}
							index={index}
						>
							{(provided) => (
								<div
									ref={provided.innerRef}
									{...provided.draggableProps}
									{...provided.dragHandleProps}
									className="field-palette-item"
								>
									{fieldType.fieldName}
								</div>
							)}
						</Draggable>
					))}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
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

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
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
					{/* <BuilderSettings /> */}
					<FieldList />
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
							<Droppable droppableId="form-fields">
								{(provided) => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className="ptr-field-wrapper"
									>
										{fieldOrder.map((fieldKey, index) => {
											const currentField =
												formBuilderFields[fieldKey];

											const ptrProps = {
												name: fieldKey,
												type: currentField.type,
												label: currentField.label,
												placeholder:
													'placeholder' in
													currentField
														? currentField.placeholder
														: undefined,
												value:
													'value' in currentField
														? currentField.value
														: undefined,
												required: currentField.required,
												removable:
													currentField.removable,
												defaultValue:
													'defaultValue' in
													currentField
														? currentField.defaultValue
														: undefined,
											};

											return (
												<Draggable
													key={fieldKey}
													draggableId={fieldKey}
													index={index}
												>
													{(provided, snapshot) => (
														<div
															ref={
																provided.innerRef
															}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={{
																...provided
																	.draggableProps
																	.style,
																opacity:
																	snapshot.isDragging
																		? 0.5
																		: 1,
															}}
														>
															<DynamicField
																{...ptrProps}
																name={fieldKey}
															/>
														</div>
													)}
												</Draggable>
											);
										})}

										{provided.placeholder}
									</div>
								)}
							</Droppable>
						</PanelBody>
					</Panel>
				</div>
			</div>
		</DragDropContext>
	);
}

export default function FormBuilder() {
	return (
		<FormBuilderContextProvider>
			<FormBuilderComponent />
		</FormBuilderContextProvider>
	);
}
