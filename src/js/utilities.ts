/**
 * Safely parse a JSON string.
 * @param jsonString - The JSON string to parse.
 * @returns The parsed JSON object.
 */
export function safelyParseJSON(jsonString: string): Record<string, unknown> {
	try {
		return JSON.parse(jsonString);
	} catch (error) {
		console.error('Error parsing JSON:', error);
		return {};
	}
}

/**
 * Execute a function when the DOM is ready.
 * @param fn - The function to execute when the DOM is ready.
 */
export function onReady(fn: () => void) {
	if (document.readyState === 'complete') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn, { once: true });
	}
}