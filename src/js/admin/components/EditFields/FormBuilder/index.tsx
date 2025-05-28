import { Panel, PanelBody } from '@wordpress/components';
import { useRef, useState, useEffect } from '@wordpress/element';
import BuilderSettings from './BuilderSettings';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { FormBuilderContextProvider } from '@admin/context/FormBuilderContext';
import DynamicField from './DynamicField';

import {
	DragDropContext,
	Droppable,
	Draggable,
	DropResult,
} from 'react-beautiful-dnd';

function FormBuilderComponent() {
	const { fieldOrder, setFieldOrder, formBuilderFields } =
		useFormBuilderContext();

	const handleDragEnd = (result: DropResult) => {
		const { destination, source } = result;

		if (!destination || destination.index === source.index) return;

		const reordered = Array.from(fieldOrder);
		const [movedItem] = reordered.splice(source.index, 1);
		reordered.splice(destination.index, 0, movedItem);

		setFieldOrder(reordered);
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
