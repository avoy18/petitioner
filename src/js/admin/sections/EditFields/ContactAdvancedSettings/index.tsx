import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useEditFormContext } from '@admin/context/EditFormContext';
import CheckboxInput from '@admin/components/CheckboxInput';
import { normalizeDefaultValues } from '@admin/sections/EditFields/AdvancedSettings';
import SuccessMessageOverride from '@admin/sections/EditFields/SuccessMessageOverride';

/**
 * Contact Advanced Settings Component
 */
export default function ContactAdvancedSettings() {
	const { formState, updateFormState } = useEditFormContext();

	const defaultValues = normalizeDefaultValues(
		window.petitionerData?.default_values
	);

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
					type="email"
					help={__(
						`This is the email address that will appear in the 'From' field of the email. If empty will default to ${defaultValues.from_field}.`,
						'petitioner'
					)}
					name="petitioner_from_field"
					id="petitioner_from_field"
					onChange={(value) => updateFormState('from_field', value)}
				/>
			</p>

			<p>
				<TextControl
					style={{ width: '100%' }}
					label={__('From name', 'petitioner')}
					value={formState.from_name}
					type="text"
					help={__(
						`This is the name next to the email address that will appear in the 'From' field of the email. If empty will default to '${defaultValues.from_name}'.`,
						'petitioner'
					)}
					name="petitioner_from_name"
					id="petitioner_from_name"
					onChange={(value) => updateFormState('from_name', value)}
				/>
			</p>

			<SuccessMessageOverride defaultValues={defaultValues} />

			<hr />

			<p>
				<TextControl
					type="url"
					label={__('Redirect URL after submission', 'petitioner')}
					value={formState.redirect_url}
					name="petitioner_redirect_url"
					id="petitioner_redirect_url"
					help={__(
						'Optional. If set, the user will be redirected to this URL after a successful submission instead of seeing the success message.',
						'petitioner'
					)}
					onChange={(value) =>
						updateFormState('redirect_url', value)
					}
				/>
			</p>
		</>
	);
}
