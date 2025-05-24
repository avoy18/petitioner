import {
	createContext,
	useContext,
	useState,
	useCallback,
} from '@wordpress/element';
import {
	EditFormContextValue,
	PetitionerData,
	EditFormContextProviderProps,
} from './edit-form.types';

const EditFormContext = createContext<EditFormContextValue | null>(null);

/**
 * Validates and normalizes the petitioner data from the global window object.
 * It ensures that all required fields are present and have default values
 * if they are missing. This function is used to initialize the form state
 * in the EditFormContextProvider.
 * @returns Normalized petitioner data from the global window object.
 */
const normalizePetitionerData = () => {
	const rawData = window.petitionerData || {};
	const defaultData: PetitionerData = {
		title: '',
		send_to_representative: false,
		email: '',
		cc_emails: '',
		show_goal: true,
		goal: 0,
		show_country: false,
		subject: '',
		require_approval: false,
		approval_state: 'approved',
		letter: '',
		add_legal_text: false,
		legal_text: '',
		add_consent_checkbox: false,
		consent_text: '',
		override_ty_email: false,
		ty_email: '',
		ty_email_subject: '',
		from_field: '',
		add_honeypot: true,
		form_id: '',
	};

	return { ...defaultData, ...rawData };
};

export function EditFormContextProvider({
	children,
}: EditFormContextProviderProps) {
	const petitionerData = normalizePetitionerData();

	const {
		title = '',
		send_to_representative = false,
		email = '',
		cc_emails = '',
		show_goal = true,
		goal = 0,
		show_country = false,
		subject = '',
		require_approval = false,
		approval_state = 'approved',
		letter = '',
		add_legal_text = false,
		consent_text = '',
		legal_text = '',
		form_id = '',
		add_consent_checkbox = false,
		override_ty_email = false,
		ty_email = '',
		ty_email_subject = '',
		from_field = '',
		add_honeypot = true,
	} = petitionerData;

	const [formState, setFormState] = useState({
		title,
		send_to_representative,
		email,
		cc_emails,
		show_goal,
		goal,
		show_country,
		subject,
		require_approval,
		approval_state,
		letter,
		add_legal_text,
		legal_text,
		add_consent_checkbox,
		consent_text,
		override_ty_email,
		ty_email,
		ty_email_subject,
		from_field,
		add_honeypot,
	});

	const updateFormState = useCallback(
		<K extends keyof PetitionerData>(key: K, value: PetitionerData[K]) => {
			setFormState((prevState) => ({ ...prevState, [key]: value }));
		},
		[]
	);

	return (
		<EditFormContext.Provider
			value={{
				formState,
				updateFormState,
			}}
		>
			{children}
		</EditFormContext.Provider>
	);
}

export function useEditFormContext() {
	const context = useContext(EditFormContext);
	if (!context) {
		throw new Error(
			'useEditFormContext must be used within an EditFormContextProvider'
		);
	}
	return context;
}
