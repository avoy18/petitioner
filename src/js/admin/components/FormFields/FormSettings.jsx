import { TextControl, SelectControl } from '@wordpress/components';
import PTRichText from './PTRichText';

export default function FormSettings({ formState, updateFormState }) {
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
					checked={formState.require_approval}
					type="checkbox"
					name="petitioner_require_approval"
					id="petitioner_require_approval"
					className="widefat"
					onChange={(e) => {
						const isChecked = e.target.checked;
						updateFormState('require_approval', isChecked);

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
					require approval before being published.
				</small>
			</p>

			{formState.require_approval && (
				<p>
					<SelectControl
						value={formState.approval_state}
						id="petitioner_approval_state"
						name="petitioner_approval_state"
						label="Default approval state"
						options={[
							{
								value: 'Confirmed',
								label: 'Confirmed by default',
							},
							{
								value: 'Declined',
								label: 'Needs approval by default',
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
					Add legal text
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
