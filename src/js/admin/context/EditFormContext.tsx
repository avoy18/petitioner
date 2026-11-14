import {
	createContext,
	useContext,
	useState,
	useCallback,
} from '@wordpress/element';
import type {
	EditFormContextValue,
	GoalDisplay,
	PetitionerData,
	EditFormContextProviderProps,
} from '@admin/sections/EditFields/consts';

function normalizeGoalDisplay(value: unknown): GoalDisplay {
	if (value === 'show' || value === 'hide' || value === 'inherit') {
		return value;
	}

	// Legacy checkbox meta is 0 or 1, saved even when no control existed.
	return 'inherit';
}

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

	// Normalize goal: legacy number → milestone array
	let normalizedGoal = [{ value: 0, count_start: 0 }];
	if (Array.isArray(rawData.goal) && rawData.goal.length > 0) {
		normalizedGoal = rawData.goal.map((m: Record<string, unknown>) => ({
			value: Number(m.value) || 0,
			count_start: Number(m.count_start) || 0,
		}));
	} else if (typeof rawData.goal === 'number' || typeof rawData.goal === 'string') {
		normalizedGoal = [{ value: Number(rawData.goal) || 0, count_start: 0 }];
	}

	const defaultData: PetitionerData = {
		title: '',
		send_to_representative: false,
		email: '',
		cc_emails: '',
		show_goal: 'inherit',
		goal: normalizedGoal,
		show_country: false,
		subject: '',
		require_approval: false,
		approval_state: 'Confirmed',
		letter: '',
		add_legal_text: false,
		legal_text: '',
		add_consent_checkbox: false,
		consent_text: '',
		override_ty_email: false,
		ty_email: '',
		ty_email_subject: '',
		override_success_message: false,
		success_message_title: '',
		success_message: '',
		from_field: '',
		from_name: '',
		add_honeypot: true,
		form_id: null,
		hide_last_names: true,
		redirect_url: '',
		confirm_success_url: '',
		confirm_error_url: '',
		active_tab: 'default'
	};

	return {
		...defaultData,
		...rawData,
		goal: normalizedGoal,
		show_goal: normalizeGoalDisplay(rawData.show_goal),
	};
};

export function EditFormContextProvider({
	children,
}: EditFormContextProviderProps) {
	const petitionerData = normalizePetitionerData();

	const [formState, setFormState] = useState(petitionerData);

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
