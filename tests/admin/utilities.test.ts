import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
	getFieldTypeGroup,
	isNonEmptyObject,
	updateSearchParams,
	updateActiveTabURL,
	sanitizeField,
	getAjaxNonce,
	generateId,
} from '@admin/utilities';

describe('getFieldTypeGroup', () => {
	it('returns the correct group for each field type', () => {
		expect(getFieldTypeGroup('text')).toBe('input');
		expect(getFieldTypeGroup('email')).toBe('input');
		expect(getFieldTypeGroup('select')).toBe('select');
		expect(getFieldTypeGroup('checkbox')).toBe('checkbox');
		expect(getFieldTypeGroup('submit')).toBe('submit');
		expect(getFieldTypeGroup('textarea')).toBe('textarea');
		expect(getFieldTypeGroup('date')).toBe('date');
	});
});

describe('isNonEmptyObject', () => {
	it('returns true for a non-empty plain object', () => {
		expect(isNonEmptyObject({ a: 1 })).toBe(true);
	});

	it('returns false for an empty object', () => {
		expect(isNonEmptyObject({})).toBe(false);
	});

	it('returns false for arrays (the non-obvious case)', () => {
		expect(isNonEmptyObject([1, 2, 3])).toBe(false);
	});
});

describe('updateSearchParams', () => {
	let replaceStateSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		replaceStateSpy = vi
			.spyOn(window.history, 'replaceState')
			.mockImplementation(() => {});
	});

	afterEach(() => {
		replaceStateSpy.mockRestore();
	});

	it('adds a search param to the URL', () => {
		updateSearchParams('foo', 'bar');

		expect(replaceStateSpy).toHaveBeenCalledTimes(1);
		const calledUrl = replaceStateSpy.mock.calls[0][2] as string;
		expect(calledUrl).toContain('foo=bar');
	});

	it('removes a search param when value is undefined', () => {
		updateSearchParams('foo');

		expect(replaceStateSpy).toHaveBeenCalledTimes(1);
		const calledUrl = replaceStateSpy.mock.calls[0][2] as string;
		expect(calledUrl).not.toContain('foo=');
	});
});

describe('updateActiveTabURL', () => {
	let replaceStateSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		replaceStateSpy = vi
			.spyOn(window.history, 'replaceState')
			.mockImplementation(() => {});
	});

	afterEach(() => {
		replaceStateSpy.mockRestore();
	});

	it('sets ptr_active_tab when tab is not the first', () => {
		updateActiveTabURL('second', ['first', 'second', 'third']);

		const calledUrl = replaceStateSpy.mock.calls[0][2] as string;
		expect(calledUrl).toContain('ptr_active_tab=second');
	});

	it('removes ptr_active_tab when tab is the first tab (default)', () => {
		updateActiveTabURL('first', ['first', 'second', 'third']);

		const calledUrl = replaceStateSpy.mock.calls[0][2] as string;
		expect(calledUrl).not.toContain('ptr_active_tab');
	});
});

describe('sanitizeField', () => {
	it('strips script tags and event handlers', () => {
		expect(sanitizeField('<b>hello</b>')).toBe('<b>hello</b>');
		expect(sanitizeField('<script>alert("xss")</script>safe')).not.toContain('<script>');
		expect(sanitizeField('<img onerror="alert(1)" src="x" />')).not.toContain('onerror');
	});
});

describe('getAjaxNonce', () => {
	it('returns the nonce from petitionerData', () => {
		window.petitionerData = { ajax_nonce: 'abc123' } as any;
		expect(getAjaxNonce()).toBe('abc123');
	});

	it('warns when nonce is empty', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		window.petitionerData = { ajax_nonce: '' } as any;
		getAjaxNonce();
		expect(warnSpy).toHaveBeenCalledWith(
			'Petitioner error: ajax nonce not showing up'
		);
		warnSpy.mockRestore();
	});
});

describe('generateId', () => {
	it('generates unique string IDs', () => {
		const ids = new Set(Array.from({ length: 20 }, () => generateId()));
		expect(ids.size).toBe(20);
	});
});
