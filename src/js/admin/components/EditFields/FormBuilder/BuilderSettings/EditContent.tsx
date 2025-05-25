import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import PTRichText from '@admin/components/shared/PTRichText';
import DOMPurify from 'dompurify';
import { WysiwygField, BuilderField } from 'src/js/types/form-builder.types';

const isWysiwygField = (field: BuilderField): field is WysiwygField => {
	return field.type === 'wysiwyg';
};

export default function EditContent() {
	const { formBuilderFields, updateFormBuilderFields, builderEditScreen } =
		useFormBuilderContext();

	const currentField = formBuilderFields[builderEditScreen];

	if (!currentField || !isWysiwygField(currentField)) {
		return null;
	}

	return (
		<div>
			<PTRichText
				label="Content"
				id={`petitioner_content_wisiwyg_${builderEditScreen}`}
				value={currentField?.value}
				onChange={(value: string) => {
					updateFormBuilderFields(builderEditScreen, {
						...currentField,
						value: DOMPurify.sanitize(value),
					});
				}}
				height={200}
			/>
		</div>
	);
}
