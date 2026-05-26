import type { StoryMeta, Story } from '@admin/sections/ComponentPreviewArea/consts';
import Table from './index';

export default {
    title: 'Components/Table',
    description: 'A data table component with sorting and selection features',
} as StoryMeta;

export const BasicTable: Story = () => (
    <Table
        headings={[
            { id: 'id', label: 'ID', width: '50px' },
            { id: 'name', label: 'Name' },
            { id: 'role', label: 'Role' },
        ]}
        rows={[
            { id: 1, cells: ['1', 'Alice', 'Admin'] },
            { id: 2, cells: ['2', 'Bob', 'Editor'] },
            { id: 3, cells: ['3', 'Charlie', 'Subscriber'] },
        ]}
    />
);
BasicTable.meta = {
    title: 'Basic Table',
    description: 'A simple table with data',
};

export const EmptyTable: Story = () => (
    <Table
        headings={[
            { id: 'name', label: 'Name' },
            { id: 'status', label: 'Status' },
        ]}
        rows={[]}
        emptyMessage="No items found."
    />
);
EmptyTable.meta = {
    title: 'Empty Table',
    description: 'A table with no rows and a custom empty message',
};

export const SortableTable: Story = () => (
    <Table
        headings={[
            { id: 'name', label: 'Name' },
            { id: 'date', label: 'Date' },
        ]}
        rows={[
            { id: 1, cells: ['Item A', '2023-01-01'] },
            { id: 2, cells: ['Item B', '2023-01-02'] },
        ]}
        onSort={(args) => console.log('Sort triggered', args)}
    />
);
SortableTable.meta = {
    title: 'Sortable Table',
    description: 'A table with sorting handlers attached',
};

export const StyledRowsTable: Story = () => (
    <Table
        headings={[
            { id: 'task', label: 'Task' },
            { id: 'status', label: 'Status' },
        ]}
        rows={[
            { id: 1, cells: ['Regular Task', 'Pending'] },
            { id: 2, cells: ['Important Task', 'Urgent'], isFeatured: true },
        ]}
    />
);
StyledRowsTable.meta = {
    title: 'Featured Rows Table',
    description: 'A table where specific rows are featured natively',
};
