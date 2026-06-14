import Table from '@admin/components/Table';
import NoticeSystem, { useNoticeSystem } from '@admin/components/NoticeSystem';
import CheckboxInput from '@admin/components/CheckboxInput';
import TextInput from '@admin/components/TextInput';
import Tabs from '@admin/components/Tabs';
import OptionList from '@admin/components/OptionList';

const petitionerComponents = {
	Table,
	NoticeSystem,
	useNoticeSystem,
	CheckboxInput,
	TextInput,
	Tabs,
	OptionList,
}

export type PetitionerComponents = typeof petitionerComponents;
export function registerComponents() {
	window.petitionerComponents = petitionerComponents;
}
