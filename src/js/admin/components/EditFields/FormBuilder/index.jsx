import { Panel, PanelBody, Button } from '@wordpress/components';
import { useRef } from '@wordpress/element';

import PtrDraggable from './../../shared/Draggable';
import BuilderSettings from './BuilderSettings';
import { useEditFormContext } from '@admin/context/EditFormContext';

const getFieldTypeGroup = (type) => {
	if (['text', 'number', 'email', 'first_name', 'last_name'].includes(type))
		return 'input';
	if (['select', 'country'].includes(type)) return 'select';
	if (['checkbox', 'terms'].includes(type)) return 'checkbox';

	return type;
};

export default function FormBuilder() {
	const formRef = useRef(null);

	const { formBuilderFields, setBuilderEditScreen } = useEditFormContext();

	const handleDragStart = (event) => {
		formRef.current.classList.add('is-dragging');
	};

	const handleDragEnd = (event) => {
		formRef.current.classList.remove('is-dragging');
	};

	const DynamicField = ({
		name = '',
		type = 'text', // 'name', 'email', 'country', 'text', 'number', 'textarea', 'select', 'checkbox', 'radio'
		label = 'Field Label',
		placeholder = 'Placeholder',
		required = false,
	}) => {
		const inputType = getFieldTypeGroup(type);

		const isInputField = inputType === 'input';

		const isCheckboxField = inputType === 'checkbox';

		const isDropdownField = inputType === 'select';

		const handleFieldEdit = (event) => {
			event.preventDefault();

			setBuilderEditScreen(inputType);
		};

		return (
			<PtrDraggable
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				id={'draggable_' + name}
				onClick={handleFieldEdit}
			>
				{isInputField && (
					<div className="ptr-fake-field ptr-fake-field--input">
						{label}
					</div>
				)}

				{isDropdownField && (
					<div className="ptr-fake-field ptr-fake-field--dropdown">
						{label}
					</div>
				)}

				{isCheckboxField && (
					<div className="ptr-fake-field ptr-fake-field--checkbox">
						<input
							type="checkbox"
							id={name}
							name={name}
							required={required}
							disabled={true}
						/>
						<label htmlFor={name}>{label}</label>
					</div>
				)}

				{inputType === 'legal' && (
					<div className="ptr-fake-field ptr-fake-field--legal">
						{label}
					</div>
				)}
			</PtrDraggable>
		);
	};

	console.log('formBuilderFields', formBuilderFields);

	return (
		<>
			<input
				type="text"
				name="form_fields"
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
								<span className="ptr-visual-position"></span>
								<DynamicField
									name="first_name"
									type="first_name"
									label="First Name"
								/>
								<span className="ptr-visual-position"></span>
								<DynamicField
									name="last_name"
									type="last_name"
									label="Last Name"
								/>
								<span className="ptr-visual-position"></span>
								<DynamicField
									name="email"
									type="email"
									label="Your email"
								/>
								<span className="ptr-visual-position"></span>
								<DynamicField
									name="country"
									type="country"
									label="Your country"
								/>
								<span className="ptr-visual-position"></span>
								<DynamicField
									name="terms"
									type="terms"
									label="By submitting this form, I agree to the terms of service"
								/>
								<DynamicField
									name="legal"
									type="legal"
									label="Legal text"
								/>
								<div>
									<Button disabled={true} variant="primary">
										Sign this petition
									</Button>
								</div>
							</div>
						</PanelBody>
					</Panel>
				</div>
			</div>
		</>
	);
}
