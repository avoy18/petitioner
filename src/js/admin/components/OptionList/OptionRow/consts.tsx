export type OptionRowProps = {
	value: string;
	isActive?: boolean;
	onToggle?: (value: string, checked: boolean) => void;
};
