export function safelyParseJSON(jsonString: string): Record<string, unknown> {
	try {
		return JSON.parse(jsonString);
	} catch (error) {
		console.error('Error parsing JSON:', error);
		return {};
	}
}
