import {
	createContext,
	useContext,
	useState,
	useCallback,
} from '@wordpress/element';

import { __ } from '@wordpress/i18n';

import { safelyParseJSON } from '@admin/utilities';

const FormBuilderContext = createContext();

const defaultBuilderFields = {
	first_name: {
		type: 'text',
		fieldName: __('First name', 'petitioner'),
		label: __('First name', 'petitioner'),
		placeholder: __('John', 'petitioner'),
		required: true,
		removable: false,
	},
	last_name: {
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
	terms: {
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
		type: 'legal',
		fieldName: __('Legal text', 'petitioner'),
		label: __('Legal text', 'petitioner'),
		required: false,
		removable: true,
	},
};

export function FormBuilderContextProvider({ children }) {
	const { form_fields = '{}' } = window.petitionerData;

	const parsedFormFields = safelyParseJSON(form_fields);

	const [builderEditScreen, setBuilderEditScreen] = useState('default');

	const [formBuilderFields, setFormBuilderFields] = useState(
		parsedFormFields ? parsedFormFields : defaultBuilderFields
	);

	const updateFormBuilderFields = useCallback((key, value) => {
		setFormBuilderFields((prevState) => ({ ...prevState, [key]: value }));
	}, []);

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
