import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import FormPreview from '@admin/sections/SettingsFields/FormPreview';
import { useFormPreview } from '@admin/sections/SettingsFields/FormPreview/hooks';

// Mock the hook so we can control its state
vi.mock('@admin/sections/SettingsFields/FormPreview/hooks', () => ({
    useFormPreview: vi.fn(),
}));

// Mock wp i18n
vi.mock('@wordpress/i18n', () => ({
    __: (text: string) => text,
}));

// Mock wp html-entities
vi.mock('@wordpress/html-entities', () => ({
    decodeEntities: (text: string) => text,
}));

describe('FormPreview', () => {
    const mockOnFormSelect = vi.fn();
    const mockSetIframeLoaded = vi.fn();
    const mockSyncPreview = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Provide default successful return values for our hook
        vi.mocked(useFormPreview).mockReturnValue({
            iframeRef: { current: null },
            previewUrl: 'https://getpetitioner.com/?petitioner_live_preview=1&form_id=1',
            selectedFormId: 1,
            petitions: [
                { id: 1, title: { rendered: 'Protect Wildlife' } },
                { id: 2, title: { rendered: 'Save the Parks' } }
            ],
            setIframeLoaded: mockSetIframeLoaded,
            onFormSelect: mockOnFormSelect,
            syncPreview: mockSyncPreview,
        });
    });

    it('renders the header and the iframe correctly', () => {
        const { container } = render(<FormPreview />);
        
        expect(screen.getByText('Live Preview')).toBeInTheDocument();
        
        const iframe = container.querySelector('iframe');
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute('src', 'https://getpetitioner.com/?petitioner_live_preview=1&form_id=1');
    });

    it('renders the petition dropdown and options when petitions exist', () => {
        render(<FormPreview />);
        
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
        expect(select).toHaveValue('1');

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(2);
        expect(options[0]).toHaveTextContent('Protect Wildlife');
        expect(options[1]).toHaveTextContent('Save the Parks');
    });

    it('calls onFormSelect when a different petition is chosen', () => {
        render(<FormPreview />);
        
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '2' } });
        
        expect(mockOnFormSelect).toHaveBeenCalledTimes(1);
        expect(mockOnFormSelect).toHaveBeenCalledWith(2);
    });

    it('does not render the dropdown if the petitions array is empty', () => {
        // Override mock to return empty array
        vi.mocked(useFormPreview).mockReturnValue({
            iframeRef: { current: null },
            previewUrl: 'https://getpetitioner.com/?petitioner_live_preview=1&form_id=0',
            selectedFormId: 0,
            petitions: [],
            setIframeLoaded: mockSetIframeLoaded,
            onFormSelect: mockOnFormSelect,
            syncPreview: mockSyncPreview,
        });

        render(<FormPreview />);
        
        // Select shouldn't be there
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });
});