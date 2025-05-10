import {
	createContext,
	useContext,
	useState,
	useCallback,
} from '@wordpress/element';

import { safelyParseJSON } from '@admin/utilities';

const FormBuilderContext = createContext();

export function FormBuilderContextProvider({ children }) {
	const { form_fields = '{}' } = window.petitionerData;

	const parsedFormFields = safelyParseJSON(form_fields);

	const [builderEditScreen, setBuilderEditScreen] = useState('default');

	const defaultBuilderFields = {
		first_name: {
			type: 'text',
			label: 'First name',
			placeholder: 'John',
			required: true,
			removable: false,
		},
		last_name: {
			type: 'text',
			label: 'Last name',
			placeholder: 'Smith',
			required: true,
			removable: false,
		},
		email: {
			type: 'email',
			label: 'Last name',
			placeholder: 'Smith',
			required: true,
			removable: false,
		},
		country: {
			type: 'country',
			label: 'Country',
			required: false,
			removable: true,
		},
		legal: {
			type: 'legal',
			label: 'Legal text',
			required: false,
			removable: true,
		},
	};

	const [formBuilderFields, setFormBuilderFields] = useState(
		parsedFormFields ? parsedFormFields : defaultBuilderFields
	);

	const updateFormBuilderFields = useCallback((key, value) => {
		setFormBuilderFields((prevState) => ({ ...prevState, [key]: value }));
	}, []);

	const updateFormState = useCallback((key, value) => {
		setFormState((prevState) => ({ ...prevState, [key]: value }));
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
