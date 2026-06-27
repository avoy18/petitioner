import '@testing-library/jest-dom';
import { vi } from 'vitest';

globalThis.window ??= {} as typeof window;

window.ajaxurl = 'https://petitions.local/wp-admin/admin-ajax.php';
window.confirm = vi.fn(() => true);

vi.stubGlobal(
	'fetch',
	vi.fn(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve({}),
		})
	)
);
