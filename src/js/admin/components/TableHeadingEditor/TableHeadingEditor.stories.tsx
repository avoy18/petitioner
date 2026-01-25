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

export const WithHiddenColumns: Story = () => <TableHeadingEditor headings={[
    {
        id: 'id',
        label: 'Id',
        overrides: { hidden: true },
    },
    {
        id: 'fname',
        label: 'First Name',
    },
]} />;

WithHiddenColumns.meta = {
    title: 'With Hidden Columns',
    description: 'Table heading editor component with hidden columns',
};

export const WithOverrides: Story = () => <TableHeadingEditor headings={[
    { id: 'date_of_birth', label: 'Date of birth', overrides: { label: 'DOB (modified)' } },
]} />;

WithOverrides.meta = {
    title: 'With Overrides',
    description: 'Table heading editor component with overrides',
};