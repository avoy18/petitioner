import type { FieldType } from '@admin/sections/EditFields/FormBuilder/consts';

const fieldTypeToGroup = {
	text: 'input',
	email: 'input',
	tel: 'input',
	select: 'select',
	checkbox: 'checkbox',
	wysiwyg: 'wysiwyg',
	submit: 'submit',
	comments: 'textarea',
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

export const updateSearchParams = (key: string, value?: string) => {
	const currentURL = new URL(window.location.href);

	if (!value) {
		currentURL.searchParams.delete(key);
	} else {
		currentURL.searchParams.set(key, value);
	}

	window.history.replaceState({}, '', currentURL.toString());
};

export const updateActiveTabURL = (newTab: string, tabKeys: string[]) => {
	if (tabKeys.indexOf(newTab) == -1 || tabKeys[0] == newTab) {
		updateSearchParams('ptr_active_tab');
		return;
	}

	updateSearchParams('ptr_active_tab', newTab);
};
