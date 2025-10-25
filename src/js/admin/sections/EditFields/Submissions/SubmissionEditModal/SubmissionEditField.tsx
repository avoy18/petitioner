import { __ } from '@wordpress/i18n';
import {
	TextControl,
	SelectControl,
	TextareaControl,
	CheckboxControl,
} from '@wordpress/components';
import { normalizeDefaultValues } from '@admin/sections/EditFields/AdvancedSettings';
import type {
	FieldType,
	FieldKey,
} from '@admin/sections/EditFields/FormBuilder/consts';

export default function SubmissionEditField({
	label,
	type,
	value,
	onChange,
}: {
	label: FieldKey;
	type: Omit<FieldType, 'submit' | 'wysiwyg'>;
	value: string;
	onChange: (newVal: string) => void;
}) {
	if (type === 'checkbox') {
		return (
			<CheckboxControl
				checked={value === '1'}
				onChange={(checked) => {
					onChange(checked ? '1' : '0');
				}}
			/>
		);
	}

	if (label === 'country') {
		const defaultValues = normalizeDefaultValues(
			window.petitionerData.default_values
		);
		const allCountries = defaultValues.country_list;

		return (
			<SelectControl value={value} onChange={onChange} options={allCountries.map((item) => ({ label: item, value: item }))} />
		);
	}

	if (type === 'textarea') {
		return <TextareaControl value={value} onChange={onChange} />;
	}

	return (
		<TextControl
			// @ts-ignore: the types should be correct here
			type={type}
			value={value}
			onChange={onChange}
		/>
	);
}
