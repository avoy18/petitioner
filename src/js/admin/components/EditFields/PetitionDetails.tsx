import React from 'react';
import { TextControl } from '@wordpress/components';
import PTRichText from '../shared/PTRichText';
import { useEditFormContext } from '@admin/context/EditFormContext';

/**
 * Petition Details Component
 */
export default function PetitionDetails() {
	const { formState, updateFormState } = useEditFormContext();
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

			{formState.send_to_representative && (
				<>
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
							onChange={(value) =>
								updateFormState('email', value)
							}
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
							onChange={(value) =>
								updateFormState('cc_emails', value)
							}
						/>
					</p>
				</>
			)}

			<hr />
			<h3>Letter details</h3>
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
				value={String(formState.letter)}
				onChange={(value) => updateFormState('letter', value)}
			/>
		</>
	);
}
