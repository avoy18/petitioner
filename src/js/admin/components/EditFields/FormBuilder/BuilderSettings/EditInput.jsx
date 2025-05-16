import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { TextControl, CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function EditInput() {
	const { formBuilderFields, updateFormBuilderFields, builderEditScreen } =
		useFormBuilderContext();

	const currentField = formBuilderFields[builderEditScreen];

	if (!currentField) {
		return null;
	}

	const [draftLabelValue, setDraftLabelValue] = useState(currentField.label);

	const [draftPlaceholderValue, setDraftPlaceholderValue] = useState(
		currentField.placeholder
	);

	const onLabelEditComplete = () => {
		updateFormBuilderFields(builderEditScreen, {
			...formBuilderFields[builderEditScreen],
			label: draftLabelValue,
		});
	};

	const onPlaceholderEditComplete = () => {
		updateFormBuilderFields(builderEditScreen, {
			...formBuilderFields[builderEditScreen],
			placeholder: draftPlaceholderValue,
		});
	};

	const onRequiredEditComplete = (value) => {
		updateFormBuilderFields(builderEditScreen, {
			...formBuilderFields[builderEditScreen],
			required: value,
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
