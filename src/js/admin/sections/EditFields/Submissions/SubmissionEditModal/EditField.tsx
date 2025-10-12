import {
	TextControl,
	SelectControl,
	// __experimentalDivider as Divider,
} from '@wordpress/components';
import type { FieldType } from '@admin/sections/EditFields/FormBuilder/consts';

export default function EditField({
	type,
	value,
    onChange,
}: {
	type: FieldType;
	value: string;
    onChange: (newVal: string) => void
}) {
	return <TextControl type={type} value={value} onChange={onChange} />;
}
