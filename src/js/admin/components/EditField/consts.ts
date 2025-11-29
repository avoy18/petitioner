export type EditFieldProps = {
	type?: string;
	value: string;
	onChange: (value: string) => void;
	options?: Array<{ label: string; value: string }>;
	placeholder?: string;
	id?: string;
	fieldKey?: string; // Optional: for smart field handling (country, approval_status, etc.)
};

