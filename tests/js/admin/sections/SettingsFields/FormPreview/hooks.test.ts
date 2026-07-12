import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormPreview } from '@admin/sections/SettingsFields/FormPreview/hooks';
import { useSettingsFormContext } from '@admin/context/SettingsContext';
import { fetchPreviewCSS, localSaveFormID, localGetSavedFormId } from '@admin/sections/SettingsFields/FormPreview/utilities';
import { useSelect } from '@wordpress/data';

// Map @wordpress/element to react for testing environments
vi.mock('@wordpress/element', async () => {
    return await vi.importActual('react');
});

vi.mock('@wordpress/data', () => ({
    useSelect: vi.fn(),
}));

vi.mock('@admin/context/SettingsContext', () => ({
    useSettingsFormContext: vi.fn(),
}));

vi.mock('@admin/sections/SettingsFields/FormPreview/utilities', () => ({
    fetchPreviewCSS: vi.fn(),
    localSaveFormID: vi.fn(),
    localGetSavedFormId: vi.fn(),
}));

describe('useFormPreview hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default context
        vi.mocked(useSettingsFormContext).mockReturnValue({
            // @ts-ignore: its ok for mock
            formState: { custom_css: 'body { color: blue; }' },
            // @ts-ignore: its ok for mock
            windowPetitionerData: {
                home_url: 'https://frontend.com',
                preview_nonce: 'abc123nonce',
            },
        });

        // Default petitions
        vi.mocked(useSelect).mockReturnValue([
            { id: 99, title: { rendered: 'Save the Ocean' } }
        ]);

        // Default local storage mock
        vi.mocked(localGetSavedFormId).mockReturnValue(0);

        // Mock window location
        Object.defineProperty(window, 'location', {
            value: { href: 'https://backend.com/wp-admin/admin.php' },
            writable: true
        });
    });

    it('initializes and auto-selects the first petition if none saved', () => {
        const { result } = renderHook(() => useFormPreview());

        // It should auto-select ID 99 since localGetSavedFormId returned 0
        expect(result.current.selectedFormId).toBe(99);
        expect(result.current.previewUrl).toBe('https://frontend.com?petitioner_live_preview=1&form_id=99');
    });

    it('initializes with the saved form ID if it exists', () => {
        vi.mocked(localGetSavedFormId).mockReturnValue(42);

        const { result } = renderHook(() => useFormPreview());

        expect(result.current.selectedFormId).toBe(42);
        expect(result.current.previewUrl).toBe('https://frontend.com?petitioner_live_preview=1&form_id=42');
    });

    it('syncPreview posts visibility data securely to the correct origin', async () => {
        const { result } = renderHook(() => useFormPreview());

        // Mock the iframe contentWindow
        const postMessageMock = vi.fn();
        // @ts-ignore: Intentionally assigning to readonly 'current' property to mock the iframe ref for testing
        result.current.iframeRef.current = {
            contentWindow: { postMessage: postMessageMock }
        };

        act(() => {
            result.current.syncPreview();
        });

        // Verifies the target origin is strictly extracted from home_url (not window.location)
        expect(postMessageMock).toHaveBeenCalledWith(
            { type: 'UPDATE_VISIBILITY', payload: { custom_css: 'body { color: blue; }' } },
            'https://frontend.com'
        );

        // Verifies CSS compilation is triggered
        expect(fetchPreviewCSS).toHaveBeenCalledTimes(1);
    });

    it('onFormSelect updates state and triggers localSaveFormID', () => {
        const { result } = renderHook(() => useFormPreview());

        act(() => {
            result.current.onFormSelect(123);
        });

        expect(result.current.selectedFormId).toBe(123);
        expect(localSaveFormID).toHaveBeenCalledWith(123);
    });
});
