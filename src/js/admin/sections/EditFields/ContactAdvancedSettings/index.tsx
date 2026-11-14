import { __ } from '@wordpress/i18n';
import { useEditFormContext } from '@admin/context/EditFormContext';
import CheckboxInput from '@admin/components/CheckboxInput';

/**
 * Contact Advanced Settings Component
 */
export default function ContactAdvancedSettings() {
	const { formState, updateFormState } = useEditFormContext();

	return (
		<CheckboxInput
			checked={!!formState.add_honeypot}
			name="petitioner_add_honeypot"
			label={__(
				'Add a honeypot field to the form for better spam protection?',
				'petitioner'
			)}
			onChange={(e) => updateFormState('add_honeypot', e.target.checked)}
		/>
	);
}
