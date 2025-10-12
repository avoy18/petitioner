export type FieldType =
	| 'text'
	| 'email'
	| 'select'
	| 'checkbox'
	| 'wysiwyg'
	| 'submit';

interface BaseField {
	fieldKey?: string;
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

export type FieldKey = 
	| 'fname'
	| 'lname' 
	| 'email'
	| 'submit'
	| 'phone'
	| 'country'
	| 'street_address'
	| 'city'
	| 'postal_code'
	| 'accept_tos'
	| 'legal'
	| 'comments'
	| 'name'
	| 'consent'
	| 'submitted_at';

export type BuilderFieldMap = Record<string, BuilderField>;

export interface FormBuilderContextValue {
	formBuilderFields: BuilderFieldMap;
	updateFormBuilderFields: (key: string, value: BuilderField) => void;
	builderEditScreen: string;
	setBuilderEditScreen: React.Dispatch<React.SetStateAction<string>>;
	removeFormBuilderField: (key: string) => void;
	addFormBuilderField: (id: string, field: BuilderField) => void;
	fieldOrder: string[];
	setFieldOrder: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface FormBuilderContextProviderProps {
	children: React.ReactNode;
}

export type FieldOrderItems = string[];