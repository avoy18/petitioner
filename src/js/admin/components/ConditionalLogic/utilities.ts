export const generateId = () =>
	`${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
