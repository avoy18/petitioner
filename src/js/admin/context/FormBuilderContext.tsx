import {
	createContext,
	useContext,
	useState,
	useCallback,
} from '@wordpress/element';
import { isNonEmptyObject } from '@admin/utilities';
import { __ } from '@wordpress/i18n';

import type {
	BuilderFieldMap,
	BuilderField,
	FormBuilderContextValue,
	FormBuilderContextProviderProps,
	FieldOrderItems,
} from '@admin/sections/EditFields/FormBuilder/consts';

export const FormBuilderContext = createContext<FormBuilderContextValue | null>(
	null
);

export const DRAGGABLE_FIELD_TYPES = [
	{
		fieldKey: 'phone',
		type: 'tel',
		fieldName: __('Phone #', 'petitioner'),
		label: __('Phone #', 'petitioner'),
		value: '',
		required: false,
		removable: true,
		description: __(
			'Allows users to enter their phone number. The pattern is set to allow only digits.',
			'petitioner'
		),
	},
	{
		fieldKey: 'date_of_birth',
		type: 'date',
		fieldName: __('Date of Birth', 'petitioner'),
		label: __('Date of Birth', 'petitioner'),
		value: '',
		required: false,
		removable: true,
		description: __(
			'Allows users to enter their date of birth using a date picker.',
			'petitioner'
		),
	},
	{
		fieldKey: 'country',
		type: 'select',
		fieldName: __('Country', 'petitioner'),
		label: __('Country', 'petitioner'),
		required: false,
		removable: true,
	},
	{
		fieldKey: 'street_address',
		type: 'text',
		fieldName: __('Street address', 'petitioner'),
		label: __('Street address', 'petitioner'),
		value: '',
		required: false,
		removable: true,
	},
	{
		fieldKey: 'city',
		type: 'text',
		fieldName: __('City', 'petitioner'),
		label: __('City', 'petitioner'),
		value: '',
		required: false,
		removable: true,
	},
	{
		fieldKey: 'postal_code',
		type: 'text',
		fieldName: __('Postal code', 'petitioner'),
		label: __('Postal code', 'petitioner'),
		value: '',
		required: false,
		removable: true,
	},
	{
		fieldKey: 'accept_tos',
		type: 'checkbox',
		fieldName: 'Terms of service checkbox',
		label: __(
			'By submitting this form, I agree to the terms of service',
			'petitioner'
		),
		defaultValue: false,
		required: true,
		removable: true,
	},
	{
		fieldKey: 'hide_name',
		type: 'checkbox',
		fieldName: __('Keep me anonymous checkbox', 'petitioner'),
		label: __('Keep my name anonymous', 'petitioner'),
		defaultValue: false,
		required: false,
		removable: true,
		description: __(
			'Allows users to opt-in to keep their name anonymous in public signature lists.',
			'petitioner'
		),
	},
	{
		fieldKey: 'newsletter',
		type: 'checkbox',
		fieldName: __('Newsletter opt-in checkbox', 'petitioner'),
		label: __('Subscribe to newsletter', 'petitioner'),
		defaultValue: false,
		required: false,
		removable: true,
		description: __(
			'Allows users to opt-in to receive newsletter updates.',
			'petitioner'
		),
	},
	{
		fieldKey: 'legal',
		type: 'wysiwyg',
		fieldName: __('Legal text', 'petitioner'),
		label: '',
		value: __('By submitting, you agree to our terms.', 'petitioner'),
		required: false,
		removable: true,
	},
	{
		fieldKey: 'comments',
		type: 'textarea',
		fieldName: __('Comments', 'petitioner'),
		label: __('Comments', 'petitioner'),
		placeholder: '',
		required: false,
		removable: true,
	},
] as BuilderField[];

export const DEFAULT_BUILDER_FIELDS: BuilderFieldMap = {
	fname: {
		fieldKey: 'fname',
		type: 'text',
		fieldName: __('First name', 'petitioner'),
		label: __('First name', 'petitioner'),
		placeholder: __('John', 'petitioner'),
		required: true,
		removable: false,
	},
	lname: {
		fieldKey: 'lname',
		type: 'text',
		fieldName: __('Last name', 'petitioner'),
		label: __('Last name', 'petitioner'),
		placeholder: __('Smith', 'petitioner'),
		required: true,
		removable: false,
	},
	email: {
		fieldKey: 'email',
		type: 'email',
		fieldName: __('Your email', 'petitioner'),
		label: __('Your email', 'petitioner'),
		placeholder: __('Smith', 'petitioner'),
		required: true,
		removable: false,
	},
	submit: {
		fieldKey: 'submit',
		type: 'submit',
		fieldName: __('Submit button', 'petitioner'),
		label: __('Sign this petition', 'petitioner'),
		required: true,
		removable: false,
	},
};

export const ALl_POSSIBLE_FIELDS = [
	...DRAGGABLE_FIELD_TYPES,
	...Object.values(DEFAULT_BUILDER_FIELDS),
];

export function FormBuilderContextProvider({
	children,
}: FormBuilderContextProviderProps) {
	const { form_fields = {}, field_order = [] } = window.petitionerData;

	const startingFormFields = isNonEmptyObject(form_fields)
		? (form_fields as BuilderFieldMap)
		: DEFAULT_BUILDER_FIELDS;

	const [formBuilderFields, setFormBuilderFields] =
		useState(startingFormFields);

	const [builderEditScreen, setBuilderEditScreen] = useState('default');

	const updateFormBuilderFields = useCallback(
		<K extends keyof BuilderFieldMap>(
			key: K,
			value: BuilderFieldMap[K]
		) => {
			setFormBuilderFields((prevState) => ({
				...prevState,
				[key]: value,
			}));
		},
		[]
	);

	const removeFormBuilderField = <K extends keyof BuilderFieldMap>(
		key: K
	) => {
		// remove from the order array
		setFieldOrder((prevOrder) => prevOrder.filter((item) => item !== key));

		// remove from the fields map
		setFormBuilderFields((prevState) => {
			const newState = { ...prevState };
			delete newState[key];
			return newState;
		});
	};

	const addFormBuilderField = useCallback(
		(id: string, field: BuilderField) => {
			setFormBuilderFields((prevState) => {
				const newField = { ...field };
				delete newField['fieldKey'];
				return { ...prevState, [id]: newField };
			});
		},
		[]
	);

	const defaultFieldOrder =
		Array.isArray(field_order) && field_order.length
			? field_order
			: Object.keys(formBuilderFields);

	const [fieldOrder, setFieldOrder] =
		useState<FieldOrderItems>(defaultFieldOrder);

	return (
		<FormBuilderContext.Provider
			value={{
				formBuilderFields,
				updateFormBuilderFields,
				builderEditScreen,
				setBuilderEditScreen,
				removeFormBuilderField,
				fieldOrder,
				setFieldOrder,
				addFormBuilderField,
			}}
		>
			{children}
		</FormBuilderContext.Provider>
	);
}

export function useFormBuilderContext() {
	const context = useContext(FormBuilderContext);
	if (!context) {
		throw new Error(
			'useFormBuilderContext must be used within an FormBuilderContextProvider'
		);
	}
	return context;
}
