import {
	TextControl,
	SelectControl,
	TextareaControl,
	// __experimentalDivider as Divider,
} from '@wordpress/components';

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
	if (type === 'textarea') {
		return (
			<TextareaControl
				value={!isEmpty ? value : ''}
				onChange={onChange}
			/>
		);
	}

	return (
		<TextControl
			// @ts-ignore: the types should be correct here
			type={type}
			value={!isEmpty ? value : ''}
			onChange={onChange}
		/>
	);
}
