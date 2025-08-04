import { __ } from '@wordpress/i18n';
import {
	__experimentalText as Text,
	__experimentalHeading as Heading,
} from '@wordpress/components';

import { StyledHeading, StyledText } from './styled';

import TextInput from '@admin/components/TextInput';
import { safelyParseJSON } from '@js/utilities';
import { useSettingsFormContext } from '@admin/context/SettingsContext';
import { useState } from '@wordpress/element';

function TextLabel({ label, initialValue, onChange }) {
	const [value, setValue] = useState(initialValue || '');

	return (
		<TextInput
			id={label}
			label={label}
			value={value}
			onChange={setValue}
			onBlur={() => onChange(label, value)}
		/>
	);
}

export default function Labels() {
	const { windowPetitionerData, formState, updateFormState } = useSettingsFormContext();
	const { label_overrides } = formState;
	const defaultLabels = windowPetitionerData.default_values?.labels;
	const labelKeys = Object.keys(defaultLabels);

	const [overrides, setOverrides] = useState(label_overrides || {});
	const updateOverrides = (key, value) => {
		const newOverrides = { ...overrides, [key]: value };
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
				const overrideValue = overrides[key] || defaultLabels[key];

				return (
					<TextLabel
						label={key}
						initialValue={overrideValue}
						onChange={(key: string, val: string) => updateOverrides(key, val)}
					/>
				);
			})}

			<input
				type="hidden"
				name="petitioner_label_overrides"
				value={JSON.stringify(overrides)}
			/>
		</section>
	);
}
