import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TableHeadingEditor from '@admin/components/TableHeadingEditor';
import type { TableHeading } from '@admin/components/TableHeadingEditor/consts';

const mockHeadings: TableHeading[] = [
    {
        id: 'name',
        label: 'Name',
    },
    {
        id: 'email',
        label: 'Email',
    },
    {
        id: 'status',
        label: 'Status',
        overrides: {
            label: 'Custom Status',
            mappings: [
                { id: '1', rawValue: '0', mappedValue: 'No' },
                { id: '2', rawValue: '1', mappedValue: 'Yes' },
            ],
        },
    },
];

describe('TableHeadingEditor', () => {
    it('renders all headings', () => {
        render(<TableHeadingEditor headings={mockHeadings} />);

        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Custom Status')).toBeInTheDocument();
    });

    it('displays override label when present', () => {
        render(<TableHeadingEditor headings={mockHeadings} />);

        // Should show override label, not original
        expect(screen.getByText('Custom Status')).toBeInTheDocument();
        expect(screen.queryByText('Status')).not.toBeInTheDocument();
    });

    it('shows edit and hide buttons for each heading', () => {
        render(<TableHeadingEditor headings={mockHeadings} />);

        const editButtons = screen.getAllByLabelText('Edit column');
        const hideButtons = screen.getAllByLabelText('Hide column');

        expect(editButtons).toHaveLength(3);
        expect(hideButtons).toHaveLength(3);
    });

    describe('Hide/Show functionality', () => {
        it('hides a column when hide button is clicked', async () => {
            const user = userEvent.setup();
            render(<TableHeadingEditor headings={mockHeadings} />);

            const hideButtons = screen.getAllByLabelText('Hide column');
            await user.click(hideButtons[0]);

            // Should show "Show column" button instead
            expect(screen.getByLabelText('Show column')).toBeInTheDocument();
            expect(screen.getAllByLabelText('Hide column')).toHaveLength(2);
        });

        it('restores a hidden column when show button is clicked', async () => {
            const user = userEvent.setup();
            render(<TableHeadingEditor headings={mockHeadings} />);

            // Hide a column
            const hideButtons = screen.getAllByLabelText('Hide column');
            await user.click(hideButtons[0]);

            // Show it again
            const showButton = screen.getByLabelText('Show column');
            await user.click(showButton);

            expect(screen.getAllByLabelText('Hide column')).toHaveLength(3);
            expect(screen.queryByLabelText('Show column')).not.toBeInTheDocument();
        });

        it('loads with hidden columns when preselected', async () => {
            render(<TableHeadingEditor headings={[
                {
                    id: 'custom_item',
                    label: 'Custom Item',
                    overrides: {
                        hidden: true,
                    },
                },
            ]} />);

            expect(screen.getByLabelText('Show column')).toBeInTheDocument();
        });
    });

    describe('Edit Popover', () => {

        it('opens edit popover when edit button is clicked', async () => {
            const user = userEvent.setup();
            render(<TableHeadingEditor headings={mockHeadings} />);

            const editButtons = screen.getAllByLabelText('Edit column');
            await user.click(editButtons[0]);

            expect(screen.getByText(/Editing:/)).toBeInTheDocument();
            expect(screen.getByLabelText('Override label')).toBeInTheDocument();
        });

        it('closes popover when cancel button is clicked', async () => {
            const user = userEvent.setup();
            render(<TableHeadingEditor headings={mockHeadings} />);

            const editButtons = screen.getAllByLabelText('Edit column');
            await user.click(editButtons[0]);

            const cancelButton = screen.getByRole('button', { name: 'Cancel' });
            await user.click(cancelButton);

            expect(screen.queryByText(/Editing:/)).not.toBeInTheDocument();
        });

        it('updates label when saved', async () => {
            const user = userEvent.setup();
            render(<TableHeadingEditor headings={mockHeadings} />);

            // Open edit popover for first heading
            const editButtons = screen.getAllByLabelText('Edit column');
            await user.click(editButtons[0]);

            // Change the label
            const labelInput = screen.getByLabelText('Override label');
            await user.clear(labelInput);
            await user.type(labelInput, 'New Name');

            // Save
            const saveButton = screen.getByRole('button', { name: 'Save' });
            await user.click(saveButton);

            // Should show updated label in list
            await waitFor(() => {
                expect(screen.getByText('New Name')).toBeInTheDocument();
            });
        });

        it('shows original label and ID in popover', async () => {
            const user = userEvent.setup();
            render(<TableHeadingEditor headings={mockHeadings} />);

            // Edit the heading with override
            const editButtons = screen.getAllByLabelText('Edit column');
            await user.click(editButtons[2]); // Status heading

            expect(screen.getByText(/ID:/)).toBeInTheDocument();
            expect(screen.getByText('status')).toBeInTheDocument();
            expect(screen.getByText(/Original label:/)).toBeInTheDocument();
            expect(screen.getByText('Status')).toBeInTheDocument();
        });

        it('preserves state when reopening same heading (key prop test)', async () => {
            const user = userEvent.setup();
            render(<TableHeadingEditor headings={mockHeadings} />);

            // Open edit, change label
            const editButtons = screen.getAllByLabelText('Edit column');
            await user.click(editButtons[0]);

            const labelInput = screen.getByLabelText('Override label');
            await user.clear(labelInput);
            await user.type(labelInput, 'Changed Label');

            // Save
            const saveButton = screen.getByRole('button', { name: 'Save' });
            await user.click(saveButton);

            // Reopen same heading
            const editButtonsAgain = screen.getAllByLabelText('Edit column');
            await user.click(editButtonsAgain[0]);

            // Should show the saved value, not the old one
            const labelInputAgain = screen.getByLabelText('Override label');
            expect(labelInputAgain).toHaveValue('Changed Label');
        });
    });

    describe('Value Mappings', () => {
        it('displays existing mappings when editing', async () => {
            const user = userEvent.setup();
            render(<TableHeadingEditor headings={mockHeadings} />);

            // Edit heading with mappings
            const editButtons = screen.getAllByLabelText('Edit column');
            await user.click(editButtons[2]); // Status heading

            expect(screen.getByText('Value Mappings')).toBeInTheDocument();

            // Check for existing mappings
            const rawValueInputs = screen.getAllByLabelText('Raw value');
            const mappedValueInputs = screen.getAllByLabelText('Mapped value');

            expect(rawValueInputs).toHaveLength(2);
            expect(rawValueInputs[0]).toHaveValue('0');
            expect(mappedValueInputs[0]).toHaveValue('No');
            expect(rawValueInputs[1]).toHaveValue('1');
            expect(mappedValueInputs[1]).toHaveValue('Yes');
        });

        it('adds new mapping when add button is clicked', async () => {
            const user = userEvent.setup();
            render(<TableHeadingEditor headings={mockHeadings} />);

            const editButtons = screen.getAllByLabelText('Edit column');
            await user.click(editButtons[0]);

            // Initially no mappings
            expect(screen.queryByLabelText('Raw value')).not.toBeInTheDocument();

            // Add mapping
            const addButton = screen.getByRole('button', { name: 'Add mapping' });
            await user.click(addButton);

            expect(screen.getByLabelText('Raw value')).toBeInTheDocument();
            expect(screen.getByLabelText('Mapped value')).toBeInTheDocument();
        });

        it('removes mapping when delete button is clicked', async () => {
            const user = userEvent.setup();
            render(<TableHeadingEditor headings={mockHeadings} />);

            const editButtons = screen.getAllByLabelText('Edit column');
            await user.click(editButtons[2]);

            const deleteButtons = screen.getAllByLabelText('Delete mapping');
            expect(deleteButtons).toHaveLength(2);

            await user.click(deleteButtons[0]);

            // Should have one less mapping
            expect(screen.getAllByLabelText('Delete mapping')).toHaveLength(1);
        });

        it('updates mapping values', async () => {
            const user = userEvent.setup();
            render(<TableHeadingEditor headings={mockHeadings} />);

            const editButtons = screen.getAllByLabelText('Edit column');
            await user.click(editButtons[2]);

            const rawValueInputs = screen.getAllByLabelText('Raw value');
            await user.clear(rawValueInputs[0]);
            await user.type(rawValueInputs[0], '2');

            expect(rawValueInputs[0]).toHaveValue('2');
        });

        it('saves mappings along with label', async () => {
            const user = userEvent.setup();
            render(<TableHeadingEditor headings={mockHeadings} />);

            const editButtons = screen.getAllByLabelText('Edit column');
            await user.click(editButtons[0]);

            // Add a mapping
            const addButton = screen.getByRole('button', { name: 'Add mapping' });
            await user.click(addButton);

            const rawValueInput = screen.getByLabelText('Raw value');
            const mappedValueInput = screen.getByLabelText('Mapped value');

            await user.type(rawValueInput, '0');
            await user.type(mappedValueInput, 'Inactive');

            // Save
            const saveButton = screen.getByRole('button', { name: 'Save' });
            await user.click(saveButton);

            // Reopen and verify mappings were saved
            const editButtonsAgain = screen.getAllByLabelText('Edit column');
            await user.click(editButtonsAgain[0]);

            const rawValueInputAgain = screen.getByLabelText('Raw value');
            const mappedValueInputAgain = screen.getByLabelText('Mapped value');

            expect(rawValueInputAgain).toHaveValue('0');
            expect(mappedValueInputAgain).toHaveValue('Inactive');
        });
    });
});