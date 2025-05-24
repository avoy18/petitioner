export function safelyParseJSON(jsonString: string): Record<string, unknown> {
	try {
		return JSON.parse(jsonString);
	} catch (error) {
		console.error('Error parsing JSON:', error);
		return {};
	}
}

type FieldType =
	| 'text'
	| 'number'
	| 'email'
	| 'fname'
	| 'lname'
	| 'select'
	| 'country'
	| 'checkbox'
	| 'accept_tos'
	| string;

type FieldGroup = 'input' | 'select' | 'checkbox' | string;

const fieldTypeToGroup: Record<string, FieldGroup> = {
	text: 'input',
	number: 'input',
	email: 'input',
	fname: 'input',
	lname: 'input',
	select: 'select',
	country: 'select',
	checkbox: 'checkbox',
	accept_tos: 'checkbox',
};

export const getFieldTypeGroup = (type: FieldType): FieldGroup => {
	return fieldTypeToGroup[type] ?? type;
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
