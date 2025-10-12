import { TextControl, SelectControl } from '@wordpress/components';
import PTRichText from '@admin/components/PTRichText';
import { useEditFormContext } from '@admin/context/EditFormContext';
import type { DefaultValues } from '@admin/sections/EditFields/consts';
import { __ } from '@wordpress/i18n';
import CheckboxInput from '@admin/components/CheckboxInput';

/*
 * Normalize the default values from the raw data
 * to ensure they match the expected structure.
 *
 * @param raw - The raw default values from the server.
 * @returns An object with default values for the form fields.
 */
export const normalizeDefaultValues = (raw: unknown): DefaultValues => {
	const DEFAULT_SUBJECT = __(
		'Thank you for signing the {{petition_title}}',
		'petitioner'
	);
	const DEFAULT_CONTENT = __(
		'Thank you for signing the {{petition_title}}. Your signature has been recorded and will be sent to {{petition_target}}.',
		'petitioner'
	);

	const defaultValues: DefaultValues = {
		from_field: '',
		ty_email_subject: DEFAULT_SUBJECT,
		ty_email: DEFAULT_CONTENT,
		ty_email_subject_confirm: DEFAULT_SUBJECT,
		ty_email_confirm: DEFAULT_CONTENT,
		success_message_title: '',
		success_message: '',
		country_list: [],
	};

	if (typeof raw !== 'object' || raw === null) {
		return defaultValues;
	}

	const input = raw as Record<string, unknown>;

	for (const key of Object.keys(defaultValues) as (keyof DefaultValues)[]) {
		const value = input[key];

		if (key === 'country_list') {
			if (Array.isArray(value)) {
				defaultValues[key] = value;
			}

			continue;
		}

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
			<CheckboxInput
				checked={!!formState.add_honeypot}
				name="petitioner_add_honeypot"
				label={__(
					'Add a honeypot field to the form for better spam protection?',
					'petitioner'
				)}
				onChange={(e) =>
					updateFormState('add_honeypot', e.target.checked)
				}
			/>

			<p>
				<TextControl
					style={{ width: '100%' }}
					label={__('From field', 'petitioner')}
					value={formState.from_field}
					defaultValue={defaultFromField}
					type="email"
					help={__(
						`This is the email address that will appear in the 'From' field of the email. If empty will default to ${defaultFromField}.`,
						'petitioner'
					)}
					name="petitioner_from_field"
					id="petitioner_from_field"
					onChange={(value) => updateFormState('from_field', value)}
				/>
			</p>

			<CheckboxInput
				checked={formState.require_approval}
				name="petitioner_require_approval"
				label={__('Require approval for submissions?', 'petitioner')}
				help={__(
					'When enabled, submissions will be saved as drafts and will require approval or an email confirmation before being published.',
					'petitioner'
				)}
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

			{formState.require_approval && (
				<p>
					<SelectControl
						value={formState.approval_state}
						id="petitioner_approval_state"
						name="petitioner_approval_state"
						label={__('Approval behavior', 'petitioner')}
						options={[
							{
								value: 'Email',
								label: __(
									'Automatic: Confirmed by email',
									'petitioner'
								),
							},
							{
								value: 'Confirmed',
								label: __(
									'Manual: confirmed by default',
									'petitioner'
								),
							},
							{
								value: 'Declined',
								label: __(
									'Manual: needs approval by default',
									'petitioner'
								),
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

			<CheckboxInput
				checked={formState.override_ty_email}
				name="petitioner_override_ty_email"
				label={__('Override the confirmation email?', 'petitioner')}
				help={
					<>
						{__(
							'Use this to customize the thank you email sent when submitting a petition.',
							'petitioner'
						)}
						{confirmEmails && formState.override_ty_email && (
							<>
								<br />
								<strong style={{ color: 'salmon' }}>
									{__(
										'Make sure to include the email confirmation variable.',
										'petitioner'
									)}{' '}
									{'{{confirmation_link}}'}
								</strong>
							</>
						)}
					</>
				}
				onChange={(e) =>
					updateFormState('override_ty_email', e.target.checked)
				}
			/>

			{formState.override_ty_email && (
				<>
					<p>
						<TextControl
							style={{ width: '100%' }}
							type="text"
							required
							label={__(
								'Thank you email subject *',
								'petitioner'
							)}
							value={
								String(formState?.ty_email_subject).length > 0
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
						label={__('Thank you email content', 'petitioner')}
						id="petitioner_ty_email"
						help={
							<div>
								{__(
									'This will be the content of the thank you email sent to the signer. You can use the following dynamic tags:',
									'petitioner'
								)}
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
							String(formState?.ty_email).length > 0
								? formState.ty_email
								: defaultTYEmailContent
						}
						onChange={(value) => updateFormState('ty_email', value)}
						height={150}
					/>
				</>
			)}

			<CheckboxInput
				name="petitioner_override_success_message"
				label={__('Override success message?', 'petitioner')}
				help={__(
					'Use this to customize the success message shown after submitting a petition.',
					'petitioner'
				)}
				checked={formState.override_success_message}
				onChange={(e) =>
					updateFormState(
						'override_success_message',
						e.target.checked
					)
				}
			/>

			{formState.override_success_message && (
				<>
					<p>
						<TextControl
							style={{ width: '100%' }}
							type="text"
							label={__('Success message title', 'petitioner')}
							// @ts-ignore - the string here should work fine
							value={
								String(formState?.success_message_title).length > 0
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
						label={__('Success message content', 'petitioner')}
						id="petitioner_success_message"
						help={__(
							'This will be the content of the success message shown after submitting a petition.',
							'petitioner'
						)}
						value={
							String(formState?.success_message).length > 0
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

			<CheckboxInput
				name="petitioner_hide_last_names"
				label={__(
					"Hide signee's last names on the frontend",
					'petitioner'
				)}
				help={__(
					'This will only show the first letter of their last name on the submission list. For example: John D.',
					'petitioner'
				)}
				checked={formState.hide_last_names}
				onChange={(e) =>
					updateFormState('hide_last_names', e.target.checked)
				}
			/>
		</>
	);
}
