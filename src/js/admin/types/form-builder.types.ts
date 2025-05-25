export type FieldType =
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

export interface TextField extends BaseField {
	type: 'text' | 'email';
	placeholder: string;
}

export interface SelectField extends BaseField {
	type: 'select';
}

export interface CheckboxField extends BaseField {
	type: 'checkbox';
	defaultValue: boolean;
}

export interface WysiwygField extends BaseField {
	type: 'wysiwyg';
	value: string;
}

export interface SubmitField extends BaseField {
	type: 'submit';
}

export type BuilderField =
	| TextField
	| SelectField
	| CheckboxField
	| WysiwygField
	| SubmitField;

export type BuilderFieldMap = Record<string, BuilderField>;

export interface FormBuilderContextValue {
	formBuilderFields: BuilderFieldMap;
	updateFormBuilderFields: (key: string, value: BuilderField) => void;
	builderEditScreen: string;
	setBuilderEditScreen: React.Dispatch<React.SetStateAction<string>>;
}

export interface FormBuilderContextProviderProps {
	children: React.ReactNode;
}