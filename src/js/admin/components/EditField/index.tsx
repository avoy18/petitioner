import {
	SelectControl,
	TextControl,
	TextareaControl,
	CheckboxControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import PTRichText from '@admin/components/PTRichText';
import { normalizeDefaultValues } from '@admin/sections/EditFields/AdvancedSettings';
import type { EditFieldProps } from './consts';

export default function EditField({
	type,
	value,
	onChange,
	options: providedOptions,
	placeholder,
	id,
	fieldKey,
}: EditFieldProps) {
	let finalType = type;
	let finalOptions = providedOptions;

	if (fieldKey === 'country') {
		const defaultValues = normalizeDefaultValues(
			window.petitionerData.default_values
		);
		const countries = defaultValues.country_list || [];
		finalType = 'select';
		finalOptions = countries.map((country) => ({
			label: country,
			value: country,
		}));
	}

	if (fieldKey === 'approval_status') {
		finalType = 'select';
		finalOptions = [
			{ label: __('Confirmed', 'petitioner'), value: 'Confirmed' },
			{ label: __('Declined', 'petitioner'), value: 'Declined' },
		];
	}

	if (finalType === 'select' && finalOptions) {
		return (
			<SelectControl
				value={value}
				onChange={onChange}
				options={finalOptions}
			/>
		);
	}

	if (finalType === 'checkbox') {
		return (
			<CheckboxControl
				checked={value === '1'}
				onChange={(checked) => onChange(checked ? '1' : '0')}
			/>
		);
	}

	if (finalType === 'textarea') {
		return (
			<TextareaControl
				value={value}
				onChange={onChange}
				placeholder={placeholder}
			/>
		);
	}

	if (finalType === 'wysiwyg' && id) {
		return (
			<PTRichText
				id={id}
				label=""
				value={value}
				onChange={onChange}
				height={200}
			/>
		);
	}

	// Default: TextControl handles text, email, tel, number, date, etc.
	return (
		<TextControl
			// @ts-ignore: finalType can be any valid HTML input type
			type={finalType}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
		/>
	);
}
