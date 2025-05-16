import { Panel, PanelBody, Button } from '@wordpress/components';
import { useRef } from '@wordpress/element';
import PtrDraggable from '@admin/components/shared/Draggable';
import BuilderSettings from './BuilderSettings/';
import { useEditFormContext } from '@admin/context/EditFormContext';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { FormBuilderContextProvider } from '@admin/context/FormBuilderContext';
import { getFieldTypeGroup } from '@admin/utilities';

function FormBuilderComponent() {
	const formRef = useRef(null);

	const { setBuilderEditScreen, builderEditScreen, formBuilderFields } =
		useFormBuilderContext();

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
		value = '',
		placeholder = '',
		required = false,
	}) => {
		const inputType = getFieldTypeGroup(type);

		const handleFieldEdit = (event) => {
			event.preventDefault();
			setBuilderEditScreen(name);
		};

		const isActive = builderEditScreen === name;

		const fieldClassName = `ptr-fake-field ptr-fake-field--${inputType} ${!isActive ? '' : 'ptr-fake-field--active'}`;

		let FinalField = (
			<div className={fieldClassName}>
				<p className="ptr-fake-field__label">{label}</p>
				<div className="ptr-fake-field__input">{placeholder}</div>
			</div>
		);

		if (inputType === 'checkbox') {
			FinalField = (
				<div className={fieldClassName}>
					<input
						type="checkbox"
						id={name}
						name={name}
						required={required}
					/>
					<label htmlFor={name}>{label}</label>
				</div>
			);
		} else if (inputType === 'submit') {
			FinalField = (
				<div className={fieldClassName}>
					<button>
						{label}
					</button>
				</div>
			);
		} else if (inputType === 'wysiwyg') {
			FinalField = (
				<div
					className={fieldClassName}
					dangerouslySetInnerHTML={{
						__html: value,
					}}
				></div>
			);
		}

		return (
			<PtrDraggable
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				id={'draggable_' + name}
				onClick={handleFieldEdit}
			>
				{FinalField}
			</PtrDraggable>
		);
	};

	const formBuilderKeys = Object.keys(formBuilderFields);

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
								{formBuilderKeys?.length > 0 &&
									formBuilderKeys.map((key) => {
										const currentField =
											formBuilderFields[key];
										return (
											<>
												<span className="ptr-visual-position"></span>
												<DynamicField
													name={key}
													type={currentField?.type}
													label={currentField?.label}
													placeholder={
														currentField?.placeholder
													}
													value={currentField?.value}
												/>
											</>
										);
									})}

								<span className="ptr-visual-position"></span>
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
