import { TextControl } from '@wordpress/components';
import PTRichText from '../shared/PTRichText';
import { useEditFormContext } from '@admin/context/EditFormContext';

export default function FormSettings() {
	const { formState, updateFormState } = useEditFormContext();

	return (
		<>
			<p>
				<TextControl
					style={{ width: '100%' }}
					required
					type="number"
					label="Signature goal *"
					value={formState.goal}
					name="petitioner_goal"
					id="petitioner_goal"
					help="Select your target submission number. You can disable this in the general settings"
					onChange={(value) => updateFormState('goal', value)}
				/>
			</p>

			<p>
				<input
					checked={formState.show_country}
					type="checkbox"
					name="petitioner_show_country"
					id="petitioner_show_country"
					className="widefat"
					onChange={(e) =>
						updateFormState('show_country', e.target.checked)
					}
				/>
				<label htmlFor="petitioner_show_country">
					Show country field?
				</label>
			</p>

			<p>
				<input
					checked={formState.add_consent_checkbox}
					type="checkbox"
					name="petitioner_add_consent_checkbox"
					id="petitioner_add_consent_checkbox"
					className="widefat"
					onChange={(e) =>
						updateFormState(
							'add_consent_checkbox',
							e.target.checked
						)
					}
				/>
				<label htmlFor="petitioner_add_consent_checkbox">
					Add privacy consent checkbox
				</label>
			</p>

			{formState.add_consent_checkbox && (
				<p>
					<TextControl
						style={{ width: '100%' }}
						type="text"
						label="Privacy consent label"
						placeholder="By submitting this form, I agree to the terms of service"
						value={formState.consent_text}
						name="petitioner_consent_text"
						id="petitioner_consent_text"
						help="This text will appear on the privacy consent checkbox"
						onChange={(value) =>
							updateFormState('consent_text', value)
						}
					/>
				</p>
			)}

			<p>
				<input
					checked={formState.add_legal_text}
					type="checkbox"
					name="petitioner_add_legal_text"
					id="petitioner_add_legal_text"
					className="widefat"
					onChange={(e) =>
						updateFormState('add_legal_text', e.target.checked)
					}
				/>
				<label htmlFor="petitioner_add_legal_text">
					Add legal disclaimer
				</label>
			</p>

			{formState.add_legal_text && (
				<PTRichText
					label="Legal disclaimer"
					id="petitioner_legal_text"
					help="This will be displayed at the bottom of the form"
					value={formState.legal_text}
					height={100}
					onChange={(value) => updateFormState('legal_text', value)}
				/>
			)}
		</>
	);
}
