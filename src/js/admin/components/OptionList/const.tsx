export type OptionListProps = {
	options: string[];
	onOptionsChange: (options: string[]) => void;
    maxHeight?: number;
    label?: string;
};
