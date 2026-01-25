import type { StoryMeta, Story } from '@admin/sections/ComponentPreviewArea/consts';
import TableHeadingEditor from './index';
import { DEFAULT_STORY_HEADINGS } from './consts';

export default {
    title: 'Components/TableHeadingEditor',
    description: 'Editor component for table headings. Used to edit the headings of a table on the export page.',
} as StoryMeta;

export const Default: Story = () => <TableHeadingEditor headings={DEFAULT_STORY_HEADINGS} />;
Default.meta = {
    title: 'Default',
    description: 'Basic table heading editor component',
};