import {
	createContext,
	useContext,
	useState,
	useCallback,
} from '@wordpress/element';

import { __ } from '@wordpress/i18n';

import {
	BuilderField,
	TextField,
	CheckboxField,
	WysiwygField,
	BuilderFieldMap,
	FormBuilderContextValue,
	FormBuilderContextProviderProps,
} from './form-builder.types';

export const FormBuilderContext = createContext<FormBuilderContextValue | null>(
	null
);

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
	country: {
		type: 'select',
		fieldName: __('Country', 'petitioner'),
		label: __('Country', 'petitioner'),
		required: false,
		removable: true,
	},
	accept_tos: {
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
	legal: {
		type: 'wysiwyg',
		fieldName: __('Legal text', 'petitioner'),
		label: '',
		value: __('By submitting, you agree to our terms.', 'petitioner'),
		required: false,
		removable: true,
	},
	submit: {
		type: 'submit',
		fieldName: __('Submit button', 'petitioner'),
		label: __('Sign this petition', 'petitioner'),
		required: true,
		removable: false,
	},
};

/*
 * This function normalizes the raw form fields data into a consistent format.
 * It ensures that each field has the required properties and types,
 * applying default values where necessary.
 * It also handles type-specific enhancements for fields like text, checkbox, and wysiwyg.
 */
export function normalizeFormFields(raw: unknown): BuilderFieldMap {
	const output: BuilderFieldMap = {};
	const source =
		typeof raw === 'object' && raw !== null
			? (raw as Record<string, unknown>)
			: {};

	for (const [key, defaultField] of Object.entries(defaultBuilderFields)) {
		const value = source[key];
		if (typeof value !== 'object' || value === null) {
			output[key] = defaultField;
			continue;
		}

		const incoming = value as Record<string, unknown>;

		// Base validation
		if (
			typeof incoming.type !== 'string' ||
			typeof incoming.fieldName !== 'string' ||
			typeof incoming.required !== 'boolean' ||
			typeof incoming.removable !== 'boolean'
		) {
			output[key] = defaultField;
			continue;
		}

		const base: BuilderField = {
			type: incoming.type as BuilderField['type'],
			fieldName: incoming.fieldName as string,
			label:
				typeof incoming.label === 'string'
					? incoming.label
					: defaultField.label,
			required: incoming.required as boolean,
			removable: incoming.removable as boolean,
		} as BuilderField;

		// Type-specific enhancements
		switch (incoming.type) {
			case 'text':
			case 'email':
				(base as TextField).placeholder =
					typeof incoming.placeholder === 'string'
						? incoming.placeholder
						: ((defaultField as TextField).placeholder ?? '');
				break;

			case 'checkbox':
				(base as CheckboxField).defaultValue =
					typeof incoming.defaultValue === 'boolean'
						? incoming.defaultValue
						: ((defaultField as CheckboxField).defaultValue ??
							false);
				break;

			case 'wysiwyg':
				(base as WysiwygField).value =
					typeof incoming.value === 'string'
						? incoming.value
						: ((defaultField as WysiwygField).value ?? '');
				break;

			case 'select':
				// Extend here if `select` gets options, etc.
				break;

			case 'submit':
				break;

			default:
				output[key] = defaultField;
				continue;
		}

		output[key] = base;
	}

	return output;
}

export function FormBuilderContextProvider({
	children,
}: FormBuilderContextProviderProps) {
	const { form_fields = {} } = window.petitionerData;

	const startingFormFields = normalizeFormFields(form_fields);

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

	return (
		<FormBuilderContext.Provider
			value={{
				formBuilderFields,
				updateFormBuilderFields,
				builderEditScreen,
				setBuilderEditScreen,
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
