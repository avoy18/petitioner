import { OptionItem } from '@admin/sections/EditFields/FormBuilder/consts';

export type OptionRowProps = OptionItem & {
	onToggle?: (value: OptionItem['value'], checked: boolean) => void;
};
