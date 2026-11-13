import {
	describe,
	it,
	expect,
	vi,
	beforeAll,
	beforeEach,
	afterAll,
	afterEach,
} from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import PetitionerGoal from '@js/frontend/goal';

const NONCE = 'fresh-nonce';
const AJAX_ORIGIN = 'http://localhost:1337/wp-admin/admin-ajax.php';

function createWrapper(attrs: {
	formId: string;
	count: string;
	goal: string;
	progress: string;
}): HTMLElement {
	const wrapper = document.createElement('div');
	wrapper.className = 'petitioner';
	wrapper.dataset.formId = attrs.formId;
	wrapper.innerHTML = `
		<div
			class="petitioner__goal"
			data-form-id="${attrs.formId}"
			data-count="${attrs.count}"
			data-goal="${attrs.goal}"
			data-progress="${attrs.progress}"
		>
			<div class="petitioner__progress">
				<div class="petitioner__progress-bar" style="width: ${attrs.progress}% !important"></div>
			</div>
			<div class="petitioner__col">
				<span class="petitioner__num">${attrs.count}</span>
				<span class="petitioner__numlabel">
					Signatures
					<small>(${attrs.progress}%)</small>
				</span>
			</div>
			<div class="petitioner__col petitioner__col--end">
				<span class="petitioner__num">${attrs.goal}</span>
				<span class="petitioner__numlabel">Goal</span>
			</div>
		</div>
	`;
	document.body.appendChild(wrapper);
	return wrapper;
}

const restHandlers = [
	http.get(AJAX_ORIGIN, ({ request }) => {
		const url = new URL(request.url);
		const action = url.searchParams.get('action');

		if (action === 'petitioner_get_nonce') {
			return HttpResponse.json({
				success: true,
				data: { nonce: NONCE },
			});
		}

		if (action === 'petitioner_get_goal_progress') {
			if (url.searchParams.get('petitioner_nonce') !== NONCE) {
				return HttpResponse.json({
					success: false,
					data: { message: 'Invalid nonce.' },
				});
			}

			return HttpResponse.json({
				success: true,
				data: {
					form_id: Number(url.searchParams.get('form_id')),
					count: 200,
					goal: 400,
					progress: 50,
				},
			});
		}

		return HttpResponse.json({ success: false });
	}),
];

const server = setupServer(...restHandlers);

describe('PetitionerGoal', () => {
	beforeAll(() => {
		server.listen({ onUnhandledRequest: 'error' });
	});

	afterAll(() => {
		server.close();
	});

	beforeEach(() => {
		window.petitionerFormSettings = {
			goalProgressPath: `${AJAX_ORIGIN}?action=petitioner_get_goal_progress`,
			nonceEndpoint: `${AJAX_ORIGIN}?action=petitioner_get_nonce`,
			nonce: 'stale-nonce',
		};
	});

	afterEach(() => {
		server.resetHandlers();
		document.body.innerHTML = '';
	});

	it('hydrates live count and goal from the API', async () => {
		const wrapper = createWrapper({
			formId: '7',
			count: '152',
			goal: '300',
			progress: '51',
		});

		new PetitionerGoal(wrapper);

		await vi.waitFor(() => {
			expect(
				wrapper.querySelector('.petitioner__goal')?.getAttribute('data-count')
			).toBe('200');
		});

		const goalEl = wrapper.querySelector('.petitioner__goal') as HTMLElement;
		expect(goalEl.dataset.goal).toBe('400');
		expect(goalEl.dataset.progress).toBe('50');
		expect(
			goalEl.querySelector(
				'.petitioner__col:not(.petitioner__col--end) .petitioner__num'
			)?.textContent
		).toBe('200');
		expect(
			goalEl.querySelector('.petitioner__col--end .petitioner__num')
				?.textContent
		).toBe('400');
		expect(
			goalEl.querySelector('.petitioner__numlabel small')?.textContent
		).toBe('(50%)');
	});

	it('keeps SSR numbers when the request fails', async () => {
		server.use(
			http.get(AJAX_ORIGIN, ({ request }) => {
				const url = new URL(request.url);
				if (url.searchParams.get('action') === 'petitioner_get_nonce') {
					return HttpResponse.json({
						success: true,
						data: { nonce: NONCE },
					});
				}

				return HttpResponse.json({ success: false }, { status: 500 });
			})
		);

		const wrapper = createWrapper({
			formId: '7',
			count: '152',
			goal: '300',
			progress: '51',
		});

		new PetitionerGoal(wrapper);

		await new Promise((resolve) => setTimeout(resolve, 50));

		const goalEl = wrapper.querySelector('.petitioner__goal') as HTMLElement;
		expect(goalEl.dataset.count).toBe('152');
		expect(
			goalEl.querySelector(
				'.petitioner__col:not(.petitioner__col--end) .petitioner__num'
			)?.textContent
		).toBe('152');
	});

	it('does nothing when the wrapper has no goal UI', () => {
		const wrapper = document.createElement('div');
		wrapper.className = 'petitioner';
		wrapper.dataset.formId = '7';
		document.body.appendChild(wrapper);

		expect(() => new PetitionerGoal(wrapper)).not.toThrow();
	});
});
