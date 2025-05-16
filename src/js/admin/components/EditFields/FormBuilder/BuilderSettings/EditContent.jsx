import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { TextControl, CheckboxControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import PTRichText from '@admin/components/shared/PTRichText';

export default function EditContent() {
	const { formBuilderFields, updateFormBuilderFields, builderEditScreen } =
		useFormBuilderContext();

	const currentField = formBuilderFields[builderEditScreen];

	if (!currentField) {
		return null;
	}

	return (
		<div>
			<PTRichText
				label="Thank you email content"
				id={`petitioner_content_wisiwyg_${builderEditScreen}`}
				value={currentField?.value}
				onChange={(value) => {
                    console.log(value);
					updateFormBuilderFields(builderEditScreen, {
						...formBuilderFields[builderEditScreen],
						value: value,
					});
				}}
				height={200}
			/>
		</div>
	);
}
