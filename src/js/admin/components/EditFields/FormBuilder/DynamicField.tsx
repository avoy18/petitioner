import PtrDraggable from '@admin/components/shared/Draggable';
import { getFieldTypeGroup } from '@admin/utilities';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { FieldType } from '@admin/types/form-builder.types';
import { Button } from '@wordpress/components';
import { useCallback } from '@wordpress/element';

export default function DynamicField({
	name = '',
	type = 'text',
	label = 'Field Label',
	value = '',
	defaultValue = false,
	placeholder = '',
	required = false,
	removable = false,
	onDragStart = (): boolean | void => true,
	onDragEnd = (): boolean | void => true,
}) {
	const { setBuilderEditScreen, builderEditScreen } = useFormBuilderContext();

	const inputType = getFieldTypeGroup(type as FieldType);

	const handleFieldEdit = (event: React.MouseEvent) => {
		event.preventDefault();
		setBuilderEditScreen(name);
	};

	const isActive = builderEditScreen === name;

	const fieldClassName = `ptr-fake-field ptr-fake-field--${inputType} ${!isActive ? '' : 'ptr-fake-field--active'}`;

	const FieldActions = useCallback(() => {
		const handleFieldDelete = (event: React.MouseEvent) => {
			event.preventDefault();
			if (
				window.confirm(
					`Are you sure you want to delete the ${label} field?`
				)
			) {
				// Logic to delete the field goes here
				console.log(`Field ${name} deleted.`);
			}
		};

		return (
			<div className="ptr-actions">
				<Button
					showTooltip={true}
					icon="edit"
					variant="secondary"
					onClick={handleFieldEdit}
					size="small"
					label={`Edit the ${label} field`}
				/>
				{removable && (
					<Button
						showTooltip={true}
						icon="trash"
						isDestructive={true}
						variant="secondary"
						size="small"
						label={`Delete the ${label} field`}
						onClick={handleFieldDelete}
					/>
				)}
			</div>
		);
	}, [label, handleFieldEdit]);

	let FinalField = (
		<div className={fieldClassName}>
			<FieldActions />
			<p className="ptr-fake-field__label">{label}</p>
			<div className="ptr-fake-field__input">{placeholder}</div>
		</div>
	);

	if (inputType === 'checkbox') {
		FinalField = (
			<div className={fieldClassName}>
				<FieldActions />
				<input
					type="checkbox"
					id={name}
					name={name}
					required={required}
					checked={defaultValue === true}
				/>
				<label htmlFor={name}>{label}</label>
			</div>
		);
	} else if (inputType === 'submit') {
		FinalField = (
			<div className={fieldClassName}>
				<FieldActions />
				<button>{label}</button>
			</div>
		);
	} else if (inputType === 'wysiwyg') {
		FinalField = (
			<div className={fieldClassName}>
				<FieldActions />
				<div
					dangerouslySetInnerHTML={{
						__html: value,
					}}
				></div>
			</div>
		);
	}

	return (
		<PtrDraggable
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			id={'draggable_' + name}
			onClick={handleFieldEdit}
		>
			<>
				{FinalField}
				<FieldActions />
			</>
		</PtrDraggable>
	);
}
