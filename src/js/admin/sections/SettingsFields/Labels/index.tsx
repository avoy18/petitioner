import { __ } from '@wordpress/i18n';
import { StyledHeading, StyledText } from './styled';
import TextInput from '@admin/components/TextInput';
import { useSettingsFormContext } from '@admin/context/SettingsContext';
import { useState } from '@wordpress/element';
import type { TextLabelProps } from './consts';

function TextLabel({
	label,
	initialValue,
	defaultValue,
	onChange,
}: TextLabelProps) {
	const [value, setValue] = useState(initialValue || '');

	return (
		<TextInput
			id={label}
			label={label}
			value={value}
			placeholder={defaultValue}
			onChange={setValue}
			onBlur={() => onChange(label, value)}
		/>
	);
}

export default function Labels() {
	const { windowPetitionerData, formState } = useSettingsFormContext();
	const { label_overrides } = formState;
	const defaultLabels = windowPetitionerData.default_values?.labels || {};
	const labelKeys = Object.keys(defaultLabels);

	const [overrides, setOverrides] = useState(label_overrides || {});

	const updateOverrides = (key: string, value: string) => {

		const newOverrides = { ...overrides, [key]: value };

		// dont save if its empty of same as default
		if (!value || value == defaultLabels?.[key]) {
			delete newOverrides[key];
		}

		setOverrides(newOverrides);
	};

	return (
		<section>
			<StyledHeading level={3}>
				{__('Editable labels', 'petitioner')}
			</StyledHeading>
			<StyledText as="p" size="small">
				{__(
					'This section allows you to override all of the labels available in the plugin.',
					'petitioner'
				)}
			</StyledText>

			{labelKeys.map((key) => {
				const overrideValue = overrides[key] ?? '';

				return (
					<TextLabel
						label={key}
						initialValue={overrideValue}
						defaultValue={defaultLabels?.[key]}
						onChange={(key, val) => updateOverrides(key, val)}
					/>
				);
			})}

			<input
				data-testid="petitioner_label_overrides"
				type="hidden"
				name="petitioner_label_overrides"
				value={JSON.stringify(overrides)}
			/>
		</section>
	);
}
