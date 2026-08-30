import { describe, it, expect, beforeEach, vi } from 'vitest';
import type {
	SubmissionRendererInstance,
	SubmissionRendererOptions,
} from '@js/frontend/submissions/consts';

type Registry =
	typeof import('@js/frontend/submissions/registry').submissionRegistry;

class FakeRenderer implements SubmissionRendererInstance {
	constructor(public options: SubmissionRendererOptions) { }
	render(): void { }
}

class OtherFakeRenderer implements SubmissionRendererInstance {
	constructor(public options: SubmissionRendererOptions) { }
	render(): void { }
}

describe('submissionRegistry', () => {
	let submissionRegistry: Registry;

	// The registry is a module singleton, so each test gets a fresh module
	// graph rather than inheriting whatever the previous test registered.
	beforeEach(async () => {
		vi.resetModules();
		({ submissionRegistry } = await import(
			'@js/frontend/submissions/registry'
		));
	});

	it('starts empty', () => {
		expect(submissionRegistry.getAll()).toEqual([]);
	});

	it('returns undefined for a style that was never registered', () => {
		expect(submissionRegistry.get('pro-ticker')).toBeUndefined();
	});

	it('returns the constructor that was registered for a style', () => {
		submissionRegistry.add('pro-ticker', FakeRenderer);

		expect(submissionRegistry.get('pro-ticker')).toBe(FakeRenderer);
	});

	it('lets a later registration replace an earlier one', () => {
		submissionRegistry.add('pro-ticker', FakeRenderer);
		submissionRegistry.add('pro-ticker', OtherFakeRenderer);

		expect(submissionRegistry.get('pro-ticker')).toBe(OtherFakeRenderer);
		expect(submissionRegistry.getAll()).toEqual(['pro-ticker']);
	});

	it('lists every registered style name', () => {
		submissionRegistry.add('simple', FakeRenderer);
		submissionRegistry.add('pro-ticker', OtherFakeRenderer);

		expect(submissionRegistry.getAll()).toEqual(['simple', 'pro-ticker']);
	});

	it('keeps styles independent of one another', () => {
		submissionRegistry.add('simple', FakeRenderer);
		submissionRegistry.add('pro-ticker', OtherFakeRenderer);

		expect(submissionRegistry.get('simple')).toBe(FakeRenderer);
		expect(submissionRegistry.get('pro-ticker')).toBe(OtherFakeRenderer);
	});

	// Add-ons ship in their own bundle and reach the registry through the
	// global, so this is the actual extension contract.
	it('exposes the same instance on window', () => {
		expect(window.petitionerSubmissionRegistry).toBe(submissionRegistry);
	});

	it('registers styles added through the global', () => {
		window.petitionerSubmissionRegistry.add('pro-ticker', FakeRenderer);

		expect(submissionRegistry.get('pro-ticker')).toBe(FakeRenderer);
	});
});
