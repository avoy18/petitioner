import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import PTRichText from '@admin/components/PTRichText';
import CheckboxInput from '@admin/components/CheckboxInput';
import { useEditFormContext } from '@admin/context/EditFormContext';
import type { DefaultValues } from '@admin/sections/EditFields/consts';

/**
 * Per-form override for the message shown after a successful submission
 */
export default function SuccessMessageOverride({
	defaultValues,
}: {
	defaultValues: DefaultValues;
}) {
	const { formState, updateFormState } = useEditFormContext();

	return (
		<>
			<CheckboxInput
				name="petitioner_override_success_message"
				label={__('Override success message?', 'petitioner')}
				help={__(
					'Use this to customize the success message shown after submitting the form.',
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
									: defaultValues.success_message_title
							}
							name="petitioner_success_message_title"
							id="petitioner_success_message_title"
							onChange={(value) =>
								updateFormState('success_message_title', value)
							}
						/>
					</p>
					<PTRichText
						plugins="lists link image"
						toolbar="formatselect | bold italic | bullist numlist | link | image"
						label={__('Success message content', 'petitioner')}
						id="petitioner_success_message"
						help={__(
							'This will be the content of the success message shown after submitting the form.',
							'petitioner'
						)}
						value={
							String(formState?.success_message).length > 0
								? formState.success_message
								: defaultValues.success_message
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
