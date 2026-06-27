import '@testing-library/jest-dom';
import { vi } from 'vitest';

declare global {
	interface Window {
		ajaxurl: string;
	}
}

globalThis.window ??= {} as typeof window;

window.ajaxurl = 'https://petitions.local/wp-admin/admin-ajax.php';
window.confirm = vi.fn(() => {
	throw new Error('window.confirm is not explicitly mocked for this test. Please mock it locally using vi.spyOn(window, "confirm").mockReturnValue(...)');
});

vi.stubGlobal(
	'fetch',
	vi.fn(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve({}),
		})
	)
);
