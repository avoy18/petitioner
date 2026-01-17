import type { OptionItem } from '@admin/sections/EditFields/FormBuilder/consts';

export type OptionListProps = {
	options: OptionItem[];
	onOptionsChange: (options: OptionItem[]) => void;
	label?: string;
};
