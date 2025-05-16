import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { TextControl, CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

export default function EditSubmit() {
	const { formBuilderFields, updateFormBuilderFields, builderEditScreen } =
		useFormBuilderContext();

	const currentField = formBuilderFields[builderEditScreen];

	if (!currentField) {
		return null;
	}

	const [draftLabelValue, setDraftLabelValue] = useState(currentField.label);

	const onLabelEditComplete = () => {
		updateFormBuilderFields(builderEditScreen, {
			...formBuilderFields[builderEditScreen],
			label: draftLabelValue,
		});
	};

	return (
		<div>
			<p>
				<TextControl
					label="Button text"
					value={draftLabelValue}
					onChange={setDraftLabelValue}
					onBlur={onLabelEditComplete}
				/>
			</p>
		</div>
	);
}
