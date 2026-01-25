import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SpreadsheetSample from '@admin/components/SpreadsheetSample';

describe('SpreadsheetSample', () => {
    it('renders all column headings', () => {
        const headings = ['Name', 'Email', 'Country'];
        render(<SpreadsheetSample headings={headings} rows={[]} isLoading={false} />);

        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('Country')).toBeInTheDocument();
    });

    it('renders table rows with data', () => {
        const headings = ['Name', 'Email'];
        const rows = [
            ['John Doe', 'john@example.com'],
            ['Jane Doe', 'jane@example.com']
        ];

        render(<SpreadsheetSample headings={headings} rows={rows} isLoading={false} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    });

    it('renders loading state when isLoading is true', () => {
        render(<SpreadsheetSample headings={[]} rows={[]} isLoading={true} />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders no data message when rows are empty', () => {
        render(<SpreadsheetSample headings={['Name', 'Email']} rows={[]} isLoading={false} />);
        expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('does not render data when loading', () => {
        const rows = [['John Doe', 'john@example.com']];
        render(<SpreadsheetSample headings={['Name']} rows={rows} isLoading={true} />);

        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays row numbers starting from 1', () => {
        const rows = [['John'], ['Jane'], ['Jim']];
        render(<SpreadsheetSample headings={['Name']} rows={rows} isLoading={false} />);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });
});