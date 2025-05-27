import { Panel, PanelBody } from '@wordpress/components';
import { useRef, useState, useEffect } from '@wordpress/element';
import BuilderSettings from './BuilderSettings';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { FormBuilderContextProvider } from '@admin/context/FormBuilderContext';
import DynamicField from './DynamicField';

function FormBuilderComponent() {
	const formRef = useRef<HTMLDivElement | null>(null);

	const { fieldOrder, setFieldOrder } = useFormBuilderContext();

	const [draggedKey, setDraggedKey] = useState<string | null>(null);
	const [hoveredKey, setHoveredKey] = useState<string | null>(null);

	const handleDragStart = (e: React.DragEvent, key: string) => {
		setDraggedKey(key);
		e.dataTransfer.effectAllowed = 'move';

		const transparentImg = new Image();
		transparentImg.src =
			'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='; // 1x1 transparent gif
		e.dataTransfer.setDragImage(transparentImg, 0, 0);

		formRef.current?.classList.add('is-dragging');
	};

	const handleDragEnd = () => {
		setDraggedKey(null);
		setHoveredKey(null);
		formRef.current?.classList.remove('is-dragging');
	};

	const { formBuilderFields } = useFormBuilderContext();

	const VisualPositionIndicator = (props: { fieldKey: string }) => {
		const { fieldKey } = props;

		const handleReorder = () => {
			if (
				typeof draggedKey === 'string' &&
				typeof hoveredKey === 'string' &&
				draggedKey !== hoveredKey
			) {
				const draggedIndex = fieldOrder.indexOf(draggedKey);
				const hoveredIndex = fieldOrder.indexOf(hoveredKey);

				if (draggedIndex === -1 || hoveredIndex === -1) {
					console.warn(
						`Dragged key (${draggedKey}) or hovered key (${hoveredKey}) not found in fieldOrder.`
					);
					return;
				}

				const updatedOrder = [...fieldOrder];
				const [movedItem] = updatedOrder.splice(draggedIndex, 1);

				const adjustedIndex =
					hoveredIndex > draggedIndex
						? hoveredIndex - 1
						: hoveredIndex;

				updatedOrder.splice(adjustedIndex, 0, movedItem);
				setFieldOrder(updatedOrder);
			}
		};

		return (
			<span
				onDragOver={() => {
					setHoveredKey(fieldKey);
					handleReorder();
				}}
				className={`ptr-visual-position ${hoveredKey == fieldKey ? 'active' : ''}`}
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
											<div key={key}>
												<VisualPositionIndicator
													fieldKey={key}
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
														handleDragStart(e, key)
													}
													onDragEnd={handleDragEnd}
												/>
											</div>
										);
									})}
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
