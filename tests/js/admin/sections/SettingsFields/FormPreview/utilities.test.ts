import { describe, it, expect, beforeEach, vi } from 'vitest';
import { localGetSavedFormId, localSaveFormID } from '@admin/sections/SettingsFields/FormPreview/utilities';
import { LOCAL_STORAGE_KEY } from '@admin/sections/SettingsFields/FormPreview/consts';


describe('FormPreview utilities', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.restoreAllMocks();
    });

    describe('localGetSavedFormId', () => {
        it('returns null if local storage has "NaN"', () => {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, 'NaN');
            expect(localGetSavedFormId()).toBeNull();
        });

        it('returns null if local storage has "undefined"', () => {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, 'undefined');
            expect(localGetSavedFormId()).toBeNull();
        });

        it('returns the number correctly', () => {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, '42');
            expect(localGetSavedFormId()).toBe(42);
        });
    });

    describe('localSaveFormID', () => {
        it('does not save NaN', () => {
            localSaveFormID(NaN);
            expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
        });

        it('does not save zero or negative numbers', () => {
            localSaveFormID(0);
            localSaveFormID(-5);
            expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toBeNull();
        });

        it('saves positive numbers', () => {
            localSaveFormID(42);
            expect(window.localStorage.getItem(LOCAL_STORAGE_KEY)).toBe('42');
        });
    });
});
