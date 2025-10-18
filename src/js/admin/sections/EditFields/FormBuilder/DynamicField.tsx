import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { Button } from '@wordpress/components';
import styled from 'styled-components';
import { sanitizeField } from '@admin/utilities';

const FakeFieldLabel = styled.p`
	min-height: 18px;
	font-size: 14px;
	color: rgba(var(--ptr-admin-color-dark), 0.6);
	background: #fff;
	margin-bottom: 0;
`;

const FakeField = styled.div`
	border: 1px solid var(--ptr-admin-color-grey, #ccc);
	width: 100%;
	min-height: 37px;
	padding: var(--ptr-admin-spacing-sm, 4px);
	border-radius: var(--ptr-admin-input-border-radius, 4px);
	box-sizing: border-box;
	font-size: var(--ptr-admin-fs-sm);
	color: rgba(var(--ptr-admin-color-dark, #000), 0.6);
	pointer-events: none;
`;

const StyledTextarea = styled(FakeField)`
	min-height: 100px;
`;

export default function DynamicField({
	name = '',
	inputType = 'text',
	label = 'Field Label',
	value = '',
	defaultValue = false,
	placeholder = '',
	required = false,
	fieldName = '',
	removable = false,
}) {
	const {
		setBuilderEditScreen,
		builderEditScreen,
		formBuilderFields,
		removeFormBuilderField,
	} = useFormBuilderContext();

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
					`Are you sure you want to remove the ${fieldName} field?`
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
					label={`Edit the ${fieldName} field`}
				/>
				{removable && (
					<Button
						showTooltip={true}
						icon="trash"
						isDestructive={true}
						variant="secondary"
						size="small"
						label={`Remove the ${fieldName} field`}
						onClick={handleFieldRemoval}
					/>
				)}
			</div>
		);
	};

	let FinalField = (
		<>
			<FakeFieldLabel>{label}</FakeFieldLabel>
			<FakeField>{placeholder}</FakeField>
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
				<label
					htmlFor={name}
					dangerouslySetInnerHTML={{ __html: sanitizeField(label) }}
				/>
			</>
		);
	} else if (inputType === 'submit') {
		FinalField = <button dangerouslySetInnerHTML={{ __html: sanitizeField(label) }} />
	} else if (inputType === 'textarea') {
		FinalField = (
			<>
				<FakeFieldLabel
					dangerouslySetInnerHTML={{ __html: sanitizeField(label) }}
				/>
				<StyledTextarea>{placeholder}</StyledTextarea>
			</>
		);
	} else if (inputType === 'wysiwyg') {
		FinalField = (
			<div
				dangerouslySetInnerHTML={{
					__html: sanitizeField(value),
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
