export type CheckboxValue = boolean;
export type TextValue = string | number;
export type NumberValue = number | null;
export type ApprovalState = 'Email' | 'Confirmed' | 'Declined';

export type FormID = number|null;

export type DefaultValues = {
	from_field: string;
	ty_email_subject: string;
	ty_email: string;
	ty_email_subject_confirm: string;
	ty_email_confirm: string;
	success_message_title: string;
	success_message: string;
};

export type PetitionerData = {
	title: TextValue;
	send_to_representative: CheckboxValue;
	email: TextValue;
	cc_emails: TextValue;
	show_goal: CheckboxValue;
	goal: NumberValue;
	show_country: CheckboxValue;
	subject: TextValue;
	require_approval: CheckboxValue;
	approval_state: ApprovalState;
	letter: TextValue;
	add_legal_text: CheckboxValue;
	legal_text: TextValue;
	add_consent_checkbox: CheckboxValue;
	consent_text: TextValue;
	override_ty_email: CheckboxValue;
	ty_email: TextValue;
	ty_email_subject: TextValue;
	from_field: TextValue;
	add_honeypot: CheckboxValue;
	form_id?: FormID;
	default_values?: DefaultValues;
	success_message_title?: TextValue;
	override_success_message?: CheckboxValue;
	success_message?: TextValue;
    hide_last_names: boolean;
	active_tab: string;
};

export interface EditFormContextValue {
	formState: PetitionerData;

	updateFormState: <K extends keyof PetitionerData>(
		key: K,
		value: PetitionerData[K]
	) => void;
}

export interface EditFormContextProviderProps {
	children: React.ReactNode;
}
