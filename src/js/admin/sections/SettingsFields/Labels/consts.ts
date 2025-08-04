export type TextLabelProps = {
	label: string;
	initialValue?: string;
	defaultValue: string;
	onChange: (key: string, value: string) => void;
};
