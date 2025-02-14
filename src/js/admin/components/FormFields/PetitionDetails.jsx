import React from 'react';
import { TextControl } from '@wordpress/components';
import PTRichText from './PTRichText';

/**
 * ✅ Petition Details Component
 */
export default function PetitionDetails({ formState, updateFormState }) {
	return (
		<>
			<p>
				<TextControl
					style={{ width: '100%' }}
					required
					label="Petition title *"
					value={formState.title}
					name="petitioner_title"
					id="petitioner_title"
					onChange={(value) => updateFormState('title', value)}
				/>
			</p>

			<p>
				<input
					checked={formState.send_to_representative}
					type="checkbox"
					name="petitioner_send_to_representative"
					id="petitioner_send_to_representative"
					className="widefat"
					onChange={(e) =>
						updateFormState(
							'send_to_representative',
							e.target.checked
						)
					}
				/>
				<label htmlFor="petitioner_send_to_representative">
					Send this email to a representative?
				</label>
			</p>

			<p>
				<TextControl
					style={{ width: '100%' }}
					required
					type="text"
					label="Petition target email *"
					value={formState.email}
					help="(can have multiple, separated by commas)"
					name="petitioner_email"
					id="petitioner_email"
					onChange={(value) => updateFormState('email', value)}
				/>
			</p>

			<p>
				<TextControl
					style={{ width: '100%' }}
					type="text"
					label="Petition CC emails"
					value={formState.cc_emails}
					help="(can have multiple, separated by commas)"
					name="petitioner_cc_emails"
					id="petitioner_cc_emails"
					onChange={(value) => updateFormState('cc_emails', value)}
				/>
			</p>

			<hr />
			<h3>Emails</h3>
			<p>
				<TextControl
					style={{ width: '100%' }}
					type="text"
					required
					label="Petition subject *"
					value={formState.subject}
					name="petitioner_subject"
					id="petitioner_subject"
					onChange={(value) => updateFormState('subject', value)}
				/>
			</p>

			<PTRichText
				label="Petition letter"
				id="petitioner_letter"
				help="This will be the main content of the email sent to the representative."
				value={formState.letter}
				onChange={(value) => updateFormState('letter', value)}
			/>

			<br />
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
						Use this to customize the confirmation email sent when
						submitting a petition.
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
							label="Confirmation email subject *"
							value={formState.ty_email_subject}
							name="petitioner_ty_email_subject"
							id="petitioner_ty_email_subject"
							onChange={(value) =>
								updateFormState('ty_email_subject', value)
							}
						/>
					</p>
					<PTRichText
						label="Confirmation email content"
						id="petitioner_ty_email"
						help={
							<div>
								This will be the content of the confirmation
								email sent to the signer. You can use the
								following dynamic tags:
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
								</div>
							</div>
						}
						value={formState.ty_email}
						onChange={(value) => updateFormState('ty_email', value)}
						height={150}
					/>
				</>
			)}
		</>
	);
}
