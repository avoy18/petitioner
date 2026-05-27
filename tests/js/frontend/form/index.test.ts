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
import userEvent from '@testing-library/user-event';
import PetitionerForm from '@js/frontend/form';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const NONCE = '123nonce345';

let capturedFormData: FormData | null = null;

const SUCCESS_TITLE = 'Thanks!';
const SUCCESS_MSG = 'Your signature has been recorded.';
const EMAIL_THAT_THROWS_ERROR = 'error@email.com';
const ERROR_TITLE = 'Could not submit the form';
const ERROR_MSG = 'Something is wrong';

export const restHandlers = [
	// Handler for the nonce endpoint (GET) - matches nonceEndpoint in settings
	http.get('http://localhost:1337/wp-admin/admin-ajax.php', ({ request }) => {
		const url = new URL(request.url);
		const action = url.searchParams.get('action');

		if (action === 'petitioner_get_nonce') {
			return HttpResponse.json({
				success: true,
				data: {
					nonce: NONCE,
				},
			});
		}

		// Default fallback for other GET actions
		return HttpResponse.json({ success: false });
	}),
	// Handler for form submission (POST)
	http.post(
		'http://localhost:1337/wp-admin/admin-ajax.php',
		async ({ request }) => {
			const formData = await request.formData();
			capturedFormData = formData;
			for (const item in formData.entries()) {
				console.log(item);
			}
			// simulate an error with a specific email
			if (formData.get('petitioner_email') === EMAIL_THAT_THROWS_ERROR) {
				return HttpResponse.json({
					success: false,
					data: {
						title: ERROR_TITLE,
						message: ERROR_MSG,
					},
				});
			}

			return HttpResponse.json({
				success: true,
				data: {
					title: SUCCESS_TITLE,
					message: SUCCESS_MSG,
				},
			});
		}
	),
];

const server = setupServer(...restHandlers);

const PETITIONER_FORM_SETTINGS = {
	actionPath:
		'http://localhost:1337/wp-admin/admin-ajax.php?action=petitioner_form_submit',
	nonceEndpoint:
		'http://localhost:1337/wp-admin/admin-ajax.php?action=petitioner_get_nonce',
	labels: {
		emailConfirmedSuccess: 'Thank you for confirming your email!',
		emailConfirmedError:
			"We couldn't confirm your email address. It may have already been confirmed, or the link has expired.",
	},
};

const WRAPPER_HTML = `
	<div class="petitioner">
		<h2 class="petitioner__title">USA Tariffs</h2>
		<button class="petitioner__btn petitioner__btn--letter">View the letter</button>

		<div class="petitioner-modal">
			<span class="petitioner-modal__backdrop"></span>
			<div class="petitioner-modal__letter">
				<button class="petitioner-modal__close">× <span>Close modal</span></button>
				<h3>To: Government of USA</h3>
				<div class="petitioner-modal__inner">
					<p>Some text here</p>
				</div>
			</div>
		</div>
		<form id="petitioner-form-348" method="get" action="http://localhost:8337/wp-admin/admin-ajax.php?action=petitioner_form_submit">

			<div class="petitioner__input">
				<label for="petitioner_fname">First name</label>
				<input type="text" id="petitioner_fname" required="" name="petitioner_fname">
			</div>

			<div class="petitioner__input">
				<label for="petitioner_email">Your email</label>
				<input type="email" id="petitioner_email" required="" name="petitioner_email">
			</div>
			<input type="hidden" name="form_id" value="348">
			<input type="text" name="ptr_info" style="display:none">
		</form>
		<div class="petitioner__response">
			<h3></h3>
			<p></p>
		</div>
	</div>
`;

describe('PetitionerForm', () => {
	let wrapper: HTMLDivElement;

	beforeAll(() => {
		server.listen({ onUnhandledRequest: 'error' });

		window.petitionerFormSettings = structuredClone(
			PETITIONER_FORM_SETTINGS
		);
	});

	afterAll(() => {
		server.close();
	});

	// Reset handlers after each test for test isolation
	afterEach(() => {
		server.resetHandlers();
		wrapper?.remove();
	});

	beforeEach(() => {
		// Fresh DOM each test — prevents stacking event listeners
		wrapper = document.createElement('div');
		wrapper.className = 'petitioner';
		wrapper.innerHTML = WRAPPER_HTML;
		// Must be in the document for FormData to read input values
		document.body.appendChild(wrapper);
		new PetitionerForm(wrapper);
	});

	describe('Modals', () => {
		const modalOpenedClass = 'petitioner-modal--visible';

		it('View letter button triggers a modal', async () => {
			const modalBTN = wrapper.querySelector('.petitioner__btn--letter') as HTMLButtonElement;
			const modal = wrapper.querySelector('.petitioner-modal');
			await userEvent.click(modalBTN);

			expect(modal?.classList).toContain(modalOpenedClass);
		});

		it('User can open the modal via the button', async () => {
			const modalBTN = wrapper.querySelector('.petitioner__btn--letter') as HTMLButtonElement;
			const modal = wrapper.querySelector('.petitioner-modal');
			await userEvent.click(modalBTN);
			expect(modal?.classList).toContain(modalOpenedClass);
		});

		it('User can close the modal via the close button after opening', async () => {
			const modalBTN = wrapper.querySelector('.petitioner__btn--letter') as HTMLButtonElement;
			const modal = wrapper.querySelector('.petitioner-modal') as HTMLDivElement;
			const modalCloseBTN = wrapper.querySelector('.petitioner-modal__close') as HTMLButtonElement;

			await userEvent.click(modalBTN);
			expect(modal?.classList).toContain(modalOpenedClass);

			await userEvent.click(modalCloseBTN);
			expect(modal?.classList).not.toContain(modalOpenedClass);
		});

		it('Escape button closes the modal too', async () => {
			const modalBTN = wrapper.querySelector('.petitioner__btn--letter') as HTMLButtonElement;
			const modal = wrapper.querySelector('.petitioner-modal') as HTMLDivElement;

			await userEvent.click(modalBTN);
			expect(modal?.classList).toContain(modalOpenedClass);

			await userEvent.keyboard('[Escape]');
			expect(modal?.classList).not.toContain(modalOpenedClass);
		});
	});

	describe('Form submission', () => {
		beforeEach(() => {
			capturedFormData = null;
		});

		it('Nonce is fetched and sent with form submission', async () => {
			const form = wrapper.querySelector('form') as HTMLFormElement;
			const fnameInput = wrapper.querySelector('#petitioner_fname') as HTMLInputElement;
			const emailInput = wrapper.querySelector('#petitioner_email') as HTMLInputElement;

			await userEvent.type(fnameInput, 'John');
			await userEvent.type(emailInput, 'john@example.com');

			form.dispatchEvent(
				new Event('submit', { bubbles: true, cancelable: true })
			);

			await vi.waitFor(() => {
				expect(capturedFormData).not.toBeNull();
			});

			expect(capturedFormData?.get('petitioner_nonce')).toBe(NONCE);
		});

		it('Success messages are shown correctly on submit', async () => {
			const form = wrapper.querySelector('form') as HTMLFormElement;
			const fnameInput = wrapper.querySelector('#petitioner_fname') as HTMLInputElement;
			const emailInput = wrapper.querySelector('#petitioner_email') as HTMLInputElement;

			await userEvent.type(fnameInput, 'John');
			await userEvent.type(emailInput, 'john@example.com');

			form.dispatchEvent(
				new Event('submit', { bubbles: true, cancelable: true })
			);

			await vi.waitFor(() => {
				expect(capturedFormData).not.toBeNull();
			});

			const title = wrapper.querySelector('.petitioner__response > h3');
			const msg = wrapper.querySelector('.petitioner__response > p');

			expect(title?.textContent).toEqual(SUCCESS_TITLE);
			expect(msg?.textContent).toEqual(SUCCESS_MSG);
		});

		it('Error messages are shown correctly on submit', async () => {
			const form = wrapper.querySelector('form') as HTMLFormElement;
			const fnameInput = wrapper.querySelector('#petitioner_fname') as HTMLInputElement;
			const emailInput = wrapper.querySelector('#petitioner_email') as HTMLInputElement;

			await userEvent.type(fnameInput, 'John');
			await userEvent.type(emailInput, EMAIL_THAT_THROWS_ERROR);

			form.dispatchEvent(
				new Event('submit', { bubbles: true, cancelable: true })
			);

			await vi.waitFor(() => {
				expect(capturedFormData).not.toBeNull();
			});

			const title = wrapper.querySelector('.petitioner__response > h3');
			const msg = wrapper.querySelector('.petitioner__response > p');

			expect(title?.textContent).toEqual(ERROR_TITLE);
			expect(msg?.textContent).toEqual(ERROR_MSG);
		});
	});
});
