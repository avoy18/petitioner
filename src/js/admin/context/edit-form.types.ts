type CheckboxValue = boolean | number;
type TextValue = string | null;
type NumberValue = number | null;

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
	approval_state: TextValue;
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
	form_id?: string | number;
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
