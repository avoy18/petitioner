import { OptionItem } from '@admin/sections/EditFields/FormBuilder/consts';

export type OptionRowProps = {
	onRemove?: (value: OptionItem) => void;
	isActive?: boolean;
	value: OptionItem;
};
