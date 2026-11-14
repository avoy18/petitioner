import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEditFormContext } from '@admin/context/EditFormContext';

/**
 * Contact Details Component
 */
export default function ContactDetails() {
	const { formState, updateFormState } = useEditFormContext();

	return (
		<>
			<p>
				<TextControl
					style={{ width: '100%' }}
					label={__('Form title', 'petitioner')}
					value={formState.title}
					name="petitioner_title"
					id="petitioner_title"
					onChange={(value) => updateFormState('title', value)}
				/>
			</p>

			<hr />
			<h3>{__('Notifications', 'petitioner')}</h3>

			<p>
				<TextControl
					style={{ width: '100%' }}
					required
					type="text"
					label={__('Notification email *', 'petitioner')}
					value={formState.email}
					help={__(
						'Every submission is sent here. Can have multiple, separated by commas.',
						'petitioner'
					)}
					name="petitioner_email"
					id="petitioner_email"
					onChange={(value) => updateFormState('email', value)}
				/>
			</p>

			<p>
				<TextControl
					style={{ width: '100%' }}
					type="text"
					label={__('CC emails', 'petitioner')}
					value={formState.cc_emails}
					help={__('Can have multiple, separated by commas.', 'petitioner')}
					name="petitioner_cc_emails"
					id="petitioner_cc_emails"
					onChange={(value) => updateFormState('cc_emails', value)}
				/>
			</p>

			<p>
				<TextControl
					style={{ width: '100%' }}
					type="text"
					label={__('Notification subject', 'petitioner')}
					value={formState.subject}
					name="petitioner_subject"
					id="petitioner_subject"
					onChange={(value) => updateFormState('subject', value)}
				/>
			</p>
		</>
	);
}
