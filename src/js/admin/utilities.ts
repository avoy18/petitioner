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

export const getFieldTypeGroup = (type: FieldType): FieldGroup => {
	if (['text', 'number', 'email', 'fname', 'lname'].includes(type))
		return 'input';
	if (['select', 'country'].includes(type)) return 'select';
	if (['checkbox', 'accept_tos'].includes(type)) return 'checkbox';

	return type;
};
