import {
	TextControl,
	SelectControl,
	TextareaControl,
	CheckboxControl,
	// __experimentalDivider as Divider,
} from '@wordpress/components';
import { getHumanValue, getSubmissionValType } from '../utilities';
import type { FieldType } from '@admin/sections/EditFields/FormBuilder/consts';

export default function SubmissionEditField({
	type,
	value,
	onChange,
	isEmpty = false,
}: {
	type: Omit<FieldType, 'submit' | 'wysiwyg'>;
	value: string;
	isEmpty: boolean;
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

	if (type === 'textarea') {
		return (
			<TextareaControl
				value={value}
				onChange={onChange}
			/>
		);
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
