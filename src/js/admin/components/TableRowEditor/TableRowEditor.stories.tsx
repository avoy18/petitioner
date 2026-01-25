import type { StoryMeta, Story } from '@admin/sections/ComponentPreviewArea/consts';
import TableRowEditor from './index';

export default {
    title: 'Components/TableRowEditor',
    description: 'Editor component for table rows',
} as StoryMeta;

export const Default: Story = () => <TableRowEditor />;
Default.meta = {
    title: 'Default',
    description: 'Basic TableRowEditor component',
};