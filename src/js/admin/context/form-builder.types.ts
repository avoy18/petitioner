type FieldType =
	| 'text'
	| 'email'
	| 'select'
	| 'checkbox'
	| 'wysiwyg'
	| 'submit';

interface BaseField {
	type: FieldType;
	fieldName: string;
	label: string;
	required: boolean;
	removable: boolean;
}

interface TextField extends BaseField {
	type: 'text' | 'email';
	placeholder: string;
}

interface SelectField extends BaseField {
	type: 'select';
}

interface CheckboxField extends BaseField {
	type: 'checkbox';
	defaultValue: boolean;
}

interface WysiwygField extends BaseField {
	type: 'wysiwyg';
	value: string;
}

interface SubmitField extends BaseField {
	type: 'submit';
}

type BuilderField =
	| TextField
	| SelectField
	| CheckboxField
	| WysiwygField
	| SubmitField;

export type BuilderFieldMap = Record<string, BuilderField>;

export interface FormBuilderContextValue {
	formBuilderFields: FormBuilderFieldsMap;
	updateFormBuilderFields: (key: string, value: BuilderField) => void;
	builderEditScreen: string;
	setBuilderEditScreen: React.Dispatch<React.SetStateAction<string>>;
}

export interface FormBuilderContextProviderProps {
	children: React.ReactNode;
}
