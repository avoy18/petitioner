import type { StoryMeta, Story } from '@admin/sections/ComponentPreviewArea/consts';
import TableHeadingEditor, { useTableHeadingState } from './index';
import { DEFAULT_STORY_HEADINGS } from './consts';

export default {
    title: 'Components/TableHeadingEditor',
    description: 'Editor component for table headings. Used to edit the headings of a table on the export page.',
} as StoryMeta;

export const Default: Story = () => {
    const headingState = useTableHeadingState(DEFAULT_STORY_HEADINGS);
    return <TableHeadingEditor headingState={headingState} />;
};

Default.meta = {
    title: 'Default',
    description: 'Basic table heading editor component',
};

export const WithHiddenColumns: Story = () => {
    const headings = [
        {
            id: 'id',
            label: 'Id',
            overrides: { hidden: true },
        },
        {
            id: 'fname',
            label: 'First Name',
        },
    ];
    const headingState = useTableHeadingState(headings);
    return <TableHeadingEditor headingState={headingState} />;
};

WithHiddenColumns.meta = {
    title: 'With Hidden Columns',
    description: 'Table heading editor component with hidden columns',
};

export const WithOverrides: Story = () => {
    const headings = [
        { id: 'date_of_birth', label: 'Date of birth', overrides: { label: 'DOB (modified)' } },
    ];
    const headingState = useTableHeadingState(headings);
    return <TableHeadingEditor headingState={headingState} />;
};

WithOverrides.meta = {
    title: 'With Overrides',
    description: 'Table heading editor component with overrides',
};