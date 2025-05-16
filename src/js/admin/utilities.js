export function safelyParseJSON(jsonString) {
	try {
		return JSON.parse(jsonString);
	} catch (error) {
		console.error('Error parsing JSON:', error);
		return {};
	}
}

export const getFieldTypeGroup = (type) => {
	if (['text', 'number', 'email', 'first_name', 'last_name'].includes(type))
		return 'input';
	if (['select', 'country'].includes(type)) return 'select';
	if (['checkbox', 'terms'].includes(type)) return 'checkbox';

	return type;
};
