import {
	describe,
	it,
	expect,
	vi,
	beforeAll,
	afterAll,
	afterEach,
} from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { fetchFreshNonce } from '@js/frontend/utilities';

const NONCE_ENDPOINT =
	'http://localhost:1337/wp-admin/admin-ajax.php?action=petitioner_get_nonce';
const FRESH_NONCE = 'fresh-nonce';
const FALLBACK_NONCE = 'inline-nonce';

const server = setupServer(
	http.get(NONCE_ENDPOINT, () =>
		HttpResponse.json({
			success: true,
			data: { nonce: FRESH_NONCE },
		})
	)
);

describe('fetchFreshNonce', () => {
	beforeAll(() => {
		server.listen({ onUnhandledRequest: 'error' });
	});

	afterAll(() => {
		server.close();
	});

	afterEach(() => {
		server.resetHandlers();
		vi.restoreAllMocks();
	});

	it('returns a fresh nonce from the endpoint', async () => {
		const nonce = await fetchFreshNonce({
			nonceEndpoint: NONCE_ENDPOINT,
		});

		expect(nonce).toBe(FRESH_NONCE);
	});

	it('returns the fallback when the endpoint is missing', async () => {
		const nonce = await fetchFreshNonce({
			nonceEndpoint: '',
			fallbackNonce: FALLBACK_NONCE,
		});

		expect(nonce).toBe(FALLBACK_NONCE);
	});

	it('throws when the endpoint is missing and there is no fallback', async () => {
		await expect(
			fetchFreshNonce({ nonceEndpoint: '' })
		).rejects.toThrow('No nonce endpoint available');
	});

	it('falls back to the inline nonce when the request fails', async () => {
		server.use(
			http.get(NONCE_ENDPOINT, () =>
				HttpResponse.json({ success: false }, { status: 500 })
			)
		);

		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const nonce = await fetchFreshNonce({
			nonceEndpoint: NONCE_ENDPOINT,
			fallbackNonce: FALLBACK_NONCE,
		});

		expect(nonce).toBe(FALLBACK_NONCE);
		expect(warnSpy).toHaveBeenCalled();
	});

	it('falls back when the response is invalid', async () => {
		server.use(
			http.get(NONCE_ENDPOINT, () =>
				HttpResponse.json({ success: false, data: {} })
			)
		);

		const nonce = await fetchFreshNonce({
			nonceEndpoint: NONCE_ENDPOINT,
			fallbackNonce: FALLBACK_NONCE,
		});

		expect(nonce).toBe(FALLBACK_NONCE);
	});

	it('throws when the request fails and there is no fallback', async () => {
		server.use(
			http.get(NONCE_ENDPOINT, () =>
				HttpResponse.json({ success: false }, { status: 500 })
			)
		);

		vi.spyOn(console, 'warn').mockImplementation(() => {});

		await expect(
			fetchFreshNonce({ nonceEndpoint: NONCE_ENDPOINT })
		).rejects.toThrow('No nonce available');
	});

	it('deduplicates in-flight requests for the same endpoint', async () => {
		let fetchCount = 0;

		server.use(
			http.get(NONCE_ENDPOINT, async () => {
				fetchCount += 1;
				await new Promise((resolve) => setTimeout(resolve, 25));

				return HttpResponse.json({
					success: true,
					data: { nonce: FRESH_NONCE },
				});
			})
		);

		const [first, second] = await Promise.all([
			fetchFreshNonce({ nonceEndpoint: NONCE_ENDPOINT }),
			fetchFreshNonce({ nonceEndpoint: NONCE_ENDPOINT }),
		]);

		expect(first).toBe(FRESH_NONCE);
		expect(second).toBe(FRESH_NONCE);
		expect(fetchCount).toBe(1);
	});
});
