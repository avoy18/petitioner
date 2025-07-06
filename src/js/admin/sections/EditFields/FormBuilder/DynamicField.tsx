import { getFieldTypeGroup } from '@admin/utilities';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import type { FieldType } from '@admin/sections/EditFields/FormBuilder/consts';
import { Button } from '@wordpress/components';

export default function DynamicField({
	name = '',
	type = 'text',
	label = 'Field Label',
	value = '',
	defaultValue = false,
	placeholder = '',
	required = false,
	removable = false,
}) {
	const {
		setBuilderEditScreen,
		builderEditScreen,
		formBuilderFields,
		removeFormBuilderField,
	} = useFormBuilderContext();

	const inputType = getFieldTypeGroup(type as FieldType);

	const handleFieldEdit = (event: React.MouseEvent) => {
		event.preventDefault();
		setBuilderEditScreen(name);
	};

	const isActive = builderEditScreen === name;

	const fieldClassName = `ptr-fake-field ptr-fake-field--${inputType} ${!isActive ? '' : 'ptr-fake-field--active'}`;

	const FieldActions = () => {
		const currentField = formBuilderFields[name];

		if (!currentField) {
			return null;
		}

		const handleFieldRemoval = (event: React.MouseEvent) => {
			event.preventDefault();
			if (
				window.confirm(
					`Are you sure you want to remove the ${label} field?`
				)
			) {
				removeFormBuilderField(name);
				setBuilderEditScreen('default');
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
						label={`Remove the ${label} field`}
						onClick={handleFieldRemoval}
					/>
				)}
			</div>
		);
	};

	let FinalField = (
		<>
			<p className="ptr-fake-field__label">{label}</p>
			<div className="ptr-fake-field__input">{placeholder}</div>
		</>
	);

	if (inputType === 'checkbox') {
		FinalField = (
			<>
				<input
					type="checkbox"
					id={name}
					name={name}
					checked={defaultValue === true}
				/>
				<label htmlFor={name}>{label}</label>
			</>
		);
	} else if (inputType === 'submit') {
		FinalField = <button>{label}</button>;
	} else if (inputType === 'wysiwyg') {
		FinalField = (
			<div
				dangerouslySetInnerHTML={{
					__html: value,
				}}
			></div>
		);
	}

	return (
		<div
			onClick={(e: React.MouseEvent) => {
				if ((e.target as HTMLElement).closest('.ptr-actions')) return;
				handleFieldEdit(e);
			}}
			className={fieldClassName}
			data-testid={`ptr-fake-field-${name}`}
		>
			<FieldActions />
			{FinalField}
		</div>
	);
}
