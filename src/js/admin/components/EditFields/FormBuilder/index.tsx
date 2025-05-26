import { Panel, PanelBody } from '@wordpress/components';
import { useRef, useState, useEffect } from '@wordpress/element';
import BuilderSettings from './BuilderSettings';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { FormBuilderContextProvider } from '@admin/context/FormBuilderContext';
import DynamicField from './DynamicField';

function FormBuilderComponent() {
	const formRef = useRef<HTMLDivElement | null>(null);

	const { fieldOrder, setFieldOrder } = useFormBuilderContext();

	const [draggedKey, setDraggedKey] = useState<number | null>(null);
	// const [hoveredKey, setHoveredKey] = useState<number | null>(null);

	const handleDragStart = (e: React.DragEvent, index: number) => {
		setDraggedKey(index);
		e.dataTransfer.effectAllowed = 'move';
		formRef.current?.classList.add('is-dragging');
	};

	const handleDragEnd = () => {
		setDraggedKey(null);
		// setHoveredKey(null);
		formRef.current?.classList.remove('is-dragging');
	};

	const { formBuilderFields } = useFormBuilderContext();

	const VisualPositionIndicator = ({ id }) => {
		const hoveredKey = id;

		return (
			<span
				onDragOver={() => {
					// setHoveredKey(id);
					if (
						typeof draggedKey === 'number' &&
						typeof hoveredKey === 'number' &&
						draggedKey !== hoveredKey
					) {
						const updatedOrder = [...fieldOrder];
						const [movedItem] = updatedOrder.splice(draggedKey, 1);
						updatedOrder.splice(hoveredKey, 0, movedItem);
						setFieldOrder(updatedOrder);
					}
				}}
				id={id}
				className={`ptr-visual-position ${hoveredKey == id ? 'active' : ''}`}
			></span>
		);
	};

	return (
		<>
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
					ref={formRef}
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
							<div className="ptr-field-wrapper">
								{fieldOrder?.length > 0 &&
									fieldOrder.map((key, index) => {
										const currentField =
											formBuilderFields[key];
										return (
											<>
												<VisualPositionIndicator
													id={index}
												/>
												<DynamicField
													name={key}
													type={currentField.type}
													label={currentField.label}
													placeholder={
														'placeholder' in
														currentField
															? currentField.placeholder
															: undefined
													}
													value={
														'value' in currentField
															? currentField.value
															: undefined
													}
													required={
														currentField.required
													}
													removable={
														currentField.removable
													}
													defaultValue={
														'defaultValue' in
														currentField
															? currentField.defaultValue
															: undefined
													}
													onDragStart={(e) =>
														handleDragStart(
															e,
															index
														)
													}
													onDragEnd={handleDragEnd}
												/>
											</>
										);
									})}

								<VisualPositionIndicator
									id={fieldOrder?.length}
								/>
							</div>
						</PanelBody>
					</Panel>
				</div>
			</div>
		</>
	);
}

export default function FormBuilder() {
	return (
		<FormBuilderContextProvider>
			<FormBuilderComponent />
		</FormBuilderContextProvider>
	);
}
