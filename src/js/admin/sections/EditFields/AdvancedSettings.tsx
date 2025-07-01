import { TextControl, SelectControl } from '@wordpress/components';
import PTRichText from '@admin/components/PTRichText';
import { useEditFormContext } from '@admin/context/EditFormContext';
import { DefaultValues } from '@admin/types/edit-form.types';
import { __ } from '@wordpress/i18n';

/*
 * Normalize the default values from the raw data
 * to ensure they match the expected structure.
 *
 * @param raw - The raw default values from the server.
 * @returns An object with default values for the form fields.
 */
const normalizeDefaultValues = (raw: unknown): DefaultValues => {
	const DEFAULT_SUBJECT = __('Thank you for signing the {{petition_title}}', 'petitioner');
	const DEFAULT_CONTENT =
		__('Thank you for signing the {{petition_title}}. Your signature has been recorded and will be sent to {{petition_target}}.', 'petitioner');

	const defaultValues: DefaultValues = {
		from_field: '',
		ty_email_subject: DEFAULT_SUBJECT,
		ty_email: DEFAULT_CONTENT,
		ty_email_subject_confirm: DEFAULT_SUBJECT,
		ty_email_confirm: DEFAULT_CONTENT,
		success_message_title: '',
		success_message: '',
	};

	if (typeof raw !== 'object' || raw === null) {
		return defaultValues;
	}

	const input = raw as Record<string, unknown>;

	for (const key of Object.keys(defaultValues) as (keyof DefaultValues)[]) {
		const value = input[key];
		if (typeof value === 'string' && value.trim().length > 0) {
			defaultValues[key] = value;
		}
	}

	return defaultValues;
};

function getThankYouDefaults(
	defaults: DefaultValues,
	approvalState: string
): { subject: string; content: string } {
	const isConfirmEmail = approvalState === 'Email';

	return {
		subject: isConfirmEmail
			? defaults.ty_email_subject_confirm
			: defaults.ty_email_subject,
		content: isConfirmEmail ? defaults.ty_email_confirm : defaults.ty_email,
	};
}

/**
 * Advanced Settings Component
 */
export default function AdvancedSettings() {
	const { formState, updateFormState } = useEditFormContext();

	const defaultValues = normalizeDefaultValues(
		window.petitionerData?.default_values
	);

	const defaultFromField = defaultValues?.from_field || '';

	const confirmEmails = formState.approval_state === 'Email';

	const { subject: defaultTYSubject, content: defaultTYEmailContent } =
		getThankYouDefaults(defaultValues, formState.approval_state);

	const defaultSuccessMessageTitle =
		defaultValues?.success_message_title || '';
	const defaultSuccessMessageContent = defaultValues?.success_message || '';

	return (
		<>
			<p>
				<input
					checked={!!formState.add_honeypot}
					type="checkbox"
					name="petitioner_add_honeypot"
					id="petitioner_add_honeypot"
					className="widefat"
					onChange={(e) =>
						updateFormState('add_honeypot', e.target.checked)
					}
				/>
				<label htmlFor="petitioner_add_honeypot">
					Add a honeypot field to the form for better spam protection?
				</label>
			</p>

			<p>
				<TextControl
					style={{ width: '100%' }}
					label="From field"
					value={formState.from_field}
					defaultValue={defaultFromField}
					type="email"
					help={`This is the email address that will appear in the 'From' field of the email. If empty will default to ${defaultFromField}.`}
					name="petitioner_from_field"
					id="petitioner_from_field"
					onChange={(value) => updateFormState('from_field', value)}
				/>
			</p>

			<p>
				<input
					checked={formState.require_approval}
					type="checkbox"
					name="petitioner_require_approval"
					id="petitioner_require_approval"
					className="widefat"
					onChange={(e) => {
						const isChecked = e.target.checked;
						updateFormState('require_approval', isChecked);
						updateFormState('approval_state', 'Email');

						window.petitionerData.require_approval = isChecked;
						// Trigger custom event
						const evt = new CustomEvent('onPtrApprovalChange', {
							detail: {
								requireApproval: isChecked,
							},
						});
						window.dispatchEvent(evt);
					}}
				/>
				<label htmlFor="petitioner_require_approval">
					Require approval for submissions?
				</label>
				<br />
				<small>
					When enabled, submissions will be saved as drafts and will
					require approval or an email confirmation before being
					published.
				</small>
			</p>

			{formState.require_approval && (
				<p>
					<SelectControl
						value={formState.approval_state}
						id="petitioner_approval_state"
						name="petitioner_approval_state"
						label="Approval behavior"
						options={[
							{
								value: 'Email',
								label: 'Automatic: Confirmed by email',
							},
							{
								value: 'Confirmed',
								label: 'Manual: confirmed by default',
							},
							{
								value: 'Declined',
								label: 'Manual: needs approval by default',
							},
						]}
						onChange={(value) => {
							updateFormState('approval_state', value);

							window.petitionerData.approval_state = value;
							// Trigger custom event
							const evt = new CustomEvent('onPtrApprovalChange', {
								detail: {
									approvalState: value,
								},
							});
							window.dispatchEvent(evt);
						}}
					/>
				</p>
			)}

			<p>
				<input
					checked={formState.override_ty_email}
					type="checkbox"
					name="petitioner_override_ty_email"
					id="petitioner_override_ty_email"
					className="widefat"
					onChange={(e) =>
						updateFormState('override_ty_email', e.target.checked)
					}
				/>
				<label htmlFor="petitioner_override_ty_email">
					Override the confirmation email?
					<br />
					<small>
						Use this to customize the thank you email sent when
						submitting a petition.
						{confirmEmails && formState.override_ty_email && (
							<>
								<br />
								<strong style={{ color: 'salmon' }}>
									Make sure to include the email confirmation
									variable. {'{{confirmation_link}}'}
								</strong>
							</>
						)}
					</small>
				</label>
			</p>

			{formState.override_ty_email && (
				<>
					<p>
						<TextControl
							style={{ width: '100%' }}
							type="text"
							required
							label="Thank you email subject *"
							value={
								formState?.ty_email_subject.length > 0
									? formState.ty_email_subject
									: defaultTYSubject
							}
							name="petitioner_ty_email_subject"
							id="petitioner_ty_email_subject"
							onChange={(value) =>
								updateFormState('ty_email_subject', value)
							}
						/>
					</p>
					<PTRichText
						label="Thank you email content"
						id="petitioner_ty_email"
						help={
							<div>
								This will be the content of the thank you email
								sent to the signer. You can use the following
								dynamic tags:
								<br />
								<div className="ptr-code-snippets">
									<input disabled value={`{{user_name}}`} />
									<input
										disabled
										value={`{{petition_letter}}`}
									/>
									<input
										disabled
										value={`{{petition_goal}}`}
									/>
									{formState.approval_state === 'Email' && (
										<input
											disabled
											style={{ minWidth: 140 }}
											value={`{{confirmation_link}}`}
										/>
									)}
								</div>
							</div>
						}
						value={
							formState?.ty_email?.length > 0
								? formState.ty_email
								: defaultTYEmailContent
						}
						onChange={(value) => updateFormState('ty_email', value)}
						height={150}
					/>
				</>
			)}

			<p>
				<input
					checked={formState.override_success_message}
					type="checkbox"
					name="petitioner_override_success_message"
					id="petitioner_override_success_message"
					className="widefat"
					onChange={(e) =>
						updateFormState(
							'override_success_message',
							e.target.checked
						)
					}
				/>
				<label htmlFor="petitioner_override_success_message">
					Override success message?
					<br />
					<small>
						Use this to customize the success message shown after
						submitting a petition.
					</small>
				</label>
			</p>

			{formState.override_success_message && (
				<>
					<p>
						<TextControl
							style={{ width: '100%' }}
							type="text"
							required
							label="Success message title *"
							value={
								formState?.success_message_title.length > 0
									? formState.success_message_title
									: defaultSuccessMessageTitle
							}
							name="petitioner_success_message_title"
							id="petitioner_success_message_title"
							onChange={(value) =>
								updateFormState('success_message_title', value)
							}
						/>
					</p>
					<PTRichText
						label="Thank you message content"
						id="petitioner_success_message"
						help={
							'This will be the content of the success message shown after submitting a petition.'
						}
						value={
							formState?.success_message?.length > 0
								? formState.success_message
								: defaultSuccessMessageContent
						}
						onChange={(value) =>
							updateFormState('success_message', value)
						}
						height={150}
					/>
				</>
			)}
		</>
	);
}
