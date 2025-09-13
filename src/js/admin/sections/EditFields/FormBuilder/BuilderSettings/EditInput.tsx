import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { TextControl, CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import type { BuilderField, TextField } from '@admin/sections/EditFields/FormBuilder/consts';

const isInputField = (field: BuilderField): field is TextField => {
	return field.type === 'text' || field.type === 'email'  || field.type === 'tel' || field.type === 'textarea';
};

export default function EditInput() {
	const { formBuilderFields, updateFormBuilderFields, builderEditScreen } =
		useFormBuilderContext();

	const currentField = formBuilderFields[builderEditScreen];

	if (!currentField || !isInputField(currentField)) {
		return null;
	}

	const [draftLabelValue, setDraftLabelValue] = useState(currentField.label);

	const [draftPlaceholderValue, setDraftPlaceholderValue] = useState(
		currentField.placeholder
	);

	const onLabelEditComplete = () => {
		updateFormBuilderFields(builderEditScreen, {
			...currentField,
			label: draftLabelValue,
		});
	};

	const onPlaceholderEditComplete = () => {
		updateFormBuilderFields(builderEditScreen, {
			...currentField,
			placeholder: draftPlaceholderValue,
		});
	};

	const onRequiredEditComplete = (value: boolean) => {
		updateFormBuilderFields(builderEditScreen, {
			...currentField,
			required: Boolean(value),
		});
	};

	return (
		<div>
			<p>
				<TextControl
					label="Field label"
					value={draftLabelValue}
					onChange={setDraftLabelValue}
					onBlur={onLabelEditComplete}
				/>
			</p>
			<p>
				<TextControl
					label="Placeholder"
					value={draftPlaceholderValue}
					onChange={setDraftPlaceholderValue}
					onBlur={onPlaceholderEditComplete}
				/>
			</p>
			{currentField?.type !== 'email' && (
				<p>
					<CheckboxControl
						label="Required"
						checked={currentField.required}
						onChange={onRequiredEditComplete}
					/>
				</p>
			)}
		</div>
	);
}
