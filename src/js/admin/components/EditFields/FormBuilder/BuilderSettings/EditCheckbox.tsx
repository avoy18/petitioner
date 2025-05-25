import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { TextControl, CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { CheckboxField, BuilderField } from 'src/js/types/form-builder.types';

function isCheckboxField(field: BuilderField): field is CheckboxField {
	return field.type === 'checkbox';
}

export default function EditCheckbox() {
	const { formBuilderFields, updateFormBuilderFields, builderEditScreen } =
		useFormBuilderContext();

	const currentField = formBuilderFields[builderEditScreen];

	if (!currentField || !isCheckboxField(currentField)) {
		return null;
	}

	const [draftLabelValue, setDraftLabelValue] = useState(currentField.label);

	const onLabelEditComplete = () => {
		updateFormBuilderFields(builderEditScreen, {
			...currentField,
			label: draftLabelValue,
		});
	};

	const onRequiredEditComplete = (value: boolean) => {
		updateFormBuilderFields(builderEditScreen, {
			...currentField,
			required: Boolean(value),
		});
	};

	const onDefaultValueComplete = (value: boolean) => {
		updateFormBuilderFields(builderEditScreen, {
			...currentField,
			defaultValue: Boolean(value),
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
				<CheckboxControl
					label="Default value"
					checked={currentField.defaultValue}
					onChange={onDefaultValueComplete}
				/>
			</p>

			<p>
				<CheckboxControl
					label="Required"
					checked={currentField.required}
					onChange={onRequiredEditComplete}
				/>
			</p>
		</div>
	);
}
