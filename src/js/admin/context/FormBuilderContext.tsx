import {
	createContext,
	useContext,
	useState,
	useCallback,
} from '@wordpress/element';
import { isNonEmptyObject } from '@admin/utilities';
import { __ } from '@wordpress/i18n';

import {
	BuilderFieldMap,
	BuilderField,
	FormBuilderContextValue,
	FormBuilderContextProviderProps,
} from '../types/form-builder.types';

export const FormBuilderContext = createContext<FormBuilderContextValue | null>(
	null
);

export const DRAGGABLE_FIELD_TYPES = [
	{
		key: 'phone',
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
		key: 'country',
		type: 'select',
		fieldName: __('Country', 'petitioner'),
		label: __('Country', 'petitioner'),
		required: false,
		removable: true,
	},
	{
		key: 'street_address',
		type: 'text',
		fieldName: __('Street address', 'petitioner'),
		label: __('Street address', 'petitioner'),
		value: '',
		required: false,
		removable: true,
	},
	{
		key: 'city',
		type: 'text',
		fieldName: __('City', 'petitioner'),
		label: __('City', 'petitioner'),
		value: '',
		required: false,
		removable: true,
	},
	{
		key: 'postal_code',
		type: 'text',
		fieldName: __('Postal code', 'petitioner'),
		label: __('Postal code', 'petitioner'),
		value: '',
		required: false,
		removable: true,
	},
	{
		key: 'accept_tos',
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
		key: 'legal',
		type: 'wysiwyg',
		fieldName: __('Legal text', 'petitioner'),
		label: '',
		value: __('By submitting, you agree to our terms.', 'petitioner'),
		required: false,
		removable: true,
	},
] as BuilderField[];

const defaultBuilderFields: BuilderFieldMap = {
	fname: {
		type: 'text',
		fieldName: __('First name', 'petitioner'),
		label: __('First name', 'petitioner'),
		placeholder: __('John', 'petitioner'),
		required: true,
		removable: false,
	},
	lname: {
		type: 'text',
		fieldName: __('Last name', 'petitioner'),
		label: __('Last name', 'petitioner'),
		placeholder: __('Smith', 'petitioner'),
		required: true,
		removable: false,
	},
	email: {
		type: 'email',
		fieldName: __('Your email', 'petitioner'),
		label: __('Your email', 'petitioner'),
		placeholder: __('Smith', 'petitioner'),
		required: true,
		removable: false,
	},
	// country: {
	// 	type: 'select',
	// 	fieldName: __('Country', 'petitioner'),
	// 	label: __('Country', 'petitioner'),
	// 	required: false,
	// 	removable: true,
	// },
	// accept_tos: {
	// 	type: 'checkbox',
	// 	fieldName: 'Terms of service checkbox',
	// 	label: __(
	// 		'By submitting this form, I agree to the terms of service',
	// 		'petitioner'
	// 	),
	// 	defaultValue: false,
	// 	required: true,
	// 	removable: true,
	// },
	// legal: {
	// 	type: 'wysiwyg',
	// 	fieldName: __('Legal text', 'petitioner'),
	// 	label: '',
	// 	value: __('By submitting, you agree to our terms.', 'petitioner'),
	// 	required: false,
	// 	removable: true,
	// },
	submit: {
		type: 'submit',
		fieldName: __('Submit button', 'petitioner'),
		label: __('Sign this petition', 'petitioner'),
		required: true,
		removable: false,
	},
};

export function FormBuilderContextProvider({
	children,
}: FormBuilderContextProviderProps) {
	const { form_fields = {}, field_order = [] } = window.petitionerData;

	const startingFormFields = isNonEmptyObject(form_fields)
		? (form_fields as BuilderFieldMap)
		: defaultBuilderFields;

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
			setFormBuilderFields((prevState) => ({
				...prevState,
				[id]: field,
			}));
		},
		[]
	);

	const defaultFieldOrder =
		Array.isArray(field_order) && field_order.length
			? field_order
			: Object.keys(formBuilderFields);

	const [fieldOrder, setFieldOrder] = useState<string[]>(defaultFieldOrder);

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
