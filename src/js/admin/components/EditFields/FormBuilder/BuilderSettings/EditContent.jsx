import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import PTRichText from '@admin/components/shared/PTRichText';
import { sanitizeText } from '@wordpress/server-side-render';
import DOMPurify from 'dompurify';

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
				label="Content"
				id={`petitioner_content_wisiwyg_${builderEditScreen}`}
				value={currentField?.value}
				onChange={(value) => {
					updateFormBuilderFields(builderEditScreen, {
						...formBuilderFields[builderEditScreen],
						value: DOMPurify.sanitize(value),
					});
				}}
				height={200}
			/>
		</div>
	);
}
