import { OptionItem } from '@admin/sections/EditFields/FormBuilder/consts';

export type OptionRowProps = {
	onToggle?: (value: OptionItem, checked: boolean) => void;
	isActive?: boolean;
	value: OptionItem;
};
