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
    });
});