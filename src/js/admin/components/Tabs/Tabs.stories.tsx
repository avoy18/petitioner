import Tabs from './index';
import { DEFAULT_STORY_TABS } from './consts';
import '../../../../../src/css/admin/index.css';
export default {
    title: 'Admin/Components/Tabs',
    component: Tabs,
};

export const Default = () => <Tabs tabs={DEFAULT_STORY_TABS} />;