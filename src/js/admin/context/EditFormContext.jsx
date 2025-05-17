import {
	createContext,
	useContext,
	useState,
	useCallback,
} from '@wordpress/element';

const EditFormContext = createContext();

export function EditFormContextProvider({ children }) {
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
	} = window.petitionerData;

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

	const [builderEditScreen, setBuilderEditScreen] = useState('default');

	const updateFormState = useCallback((key, value) => {
		setFormState((prevState) => ({ ...prevState, [key]: value }));
	}, []);

	return (
		<EditFormContext.Provider
			value={{
				formState,
				updateFormState,
				builderEditScreen,
				setBuilderEditScreen,
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
