import { FieldType } from '@admin/types/form-builder.types';

const fieldTypeToGroup = {
	text: 'input',
	email: 'input',
	tel: 'input',
	select: 'select',
	checkbox: 'checkbox',
	wysiwyg: 'wysiwyg',
	submit: 'submit',
};

export type FieldGroup = (typeof fieldTypeToGroup)[FieldType];

export const getFieldTypeGroup = (type: FieldType): FieldGroup => {
	return fieldTypeToGroup[type];
};

export const isNonEmptyObject = <T extends object = Record<string, unknown>>(
	value: unknown
): value is T => {
	return (
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value) &&
		Object.keys(value).length > 0
	);
};