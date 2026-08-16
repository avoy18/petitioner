import type { GoalProgressData } from './consts';

/**
 * @class PetitionerGoal
 *
 * Hydrates the petition goal UI with a live submission count after page load.
 */
export default class PetitionerGoal {
	private wrapper: HTMLElement;
	private goalEl: HTMLElement | null;
	private formId: string;
	private goalProgressPath: string;
	private nonceEndpoint: string;
	private nonce: string;

	constructor(wrapper: HTMLElement) {
		this.wrapper = wrapper;
		this.goalEl = this.wrapper.querySelector('.petitioner__goal');
		this.formId = this.wrapper.dataset.formId || '';

		const settings = window?.petitionerFormSettings || {};
		this.goalProgressPath = settings.goalProgressPath || '';
		this.nonceEndpoint = settings.nonceEndpoint || '';
		this.nonce = settings.nonce || '';

		if (!this.goalEl || !this.formId || !this.goalProgressPath) {
			return;
		}

		this.init();
		document.addEventListener('petitionerFormSubmit', (e) =>
			this.onFormSubmit(e)
		);
	}

	private async init(): Promise<void> {
		if (!this.goalEl) {
			return;
		}

		try {
			const nonce = await this.getFreshNonce();
			const data = await this.fetchProgress(nonce);

			if (!data) {
				return;
			}

			this.apply(data);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	private async getFreshNonce(): Promise<string> {
		try {
			const response = await fetch(this.nonceEndpoint, {
				method: 'GET',
				credentials: 'same-origin',
			});

			if (!response.ok) {
				throw new Error('Failed to fetch nonce');
			}

			const data = await response.json();

			if (data.success && data.data?.nonce) {
				this.nonce = data.data.nonce;
				return data.data.nonce;
			}

			throw new Error('Invalid nonce response');
		} catch (error) {
			console.warn('Could not fetch fresh nonce:', error);

			if (this.nonce) {
				return this.nonce;
			}

			throw new Error('No nonce available');
		}
	}

	private async fetchProgress(nonce: string): Promise<GoalProgressData | null> {
		const url = new URL(this.goalProgressPath, window.location.origin);
		url.searchParams.set('form_id', this.formId);
		url.searchParams.set('petitioner_nonce', nonce);

		const response = await fetch(url.toString(), {
			method: 'GET',
			credentials: 'same-origin',
			headers: { 'X-Requested-With': 'XMLHttpRequest' },
		});

		if (!response.ok) {
			throw new Error('Failed to fetch goal progress');
		}

		const payload = await response.json();

		if (!payload.success || !payload.data) {
			return null;
		}

		return {
			form_id: Number(payload.data.form_id),
			count: Number(payload.data.count),
			goal: Number(payload.data.goal),
			progress: Number(payload.data.progress),
		};
	}

	private apply(data: GoalProgressData): void {
		if (!this.goalEl) {
			return;
		}

		const count = String(data.count);
		const goal = String(data.goal);
		const progress = String(data.progress);

		if (
			this.goalEl.dataset.count === count &&
			this.goalEl.dataset.goal === goal &&
			this.goalEl.dataset.progress === progress
		) {
			return;
		}

		this.goalEl.dataset.count = count;
		this.goalEl.dataset.goal = goal;
		this.goalEl.dataset.progress = progress;

		const countEl = this.goalEl.querySelector<HTMLElement>(
			'.petitioner__col:not(.petitioner__col--end) .petitioner__num'
		);
		const goalNum = this.goalEl.querySelector<HTMLElement>(
			'.petitioner__col--end .petitioner__num'
		);
		const bar = this.goalEl.querySelector<HTMLElement>(
			'.petitioner__progress-bar'
		);
		const percentEl = this.goalEl.querySelector<HTMLElement>(
			'.petitioner__numlabel small'
		);

		if (countEl) {
			countEl.textContent = count;
		}

		if (goalNum) {
			goalNum.textContent = goal;
		}

		if (bar) {
			bar.style.setProperty('width', `${progress}%`, 'important');
		}

		if (percentEl) {
			percentEl.textContent = `(${progress}%)`;
		}
	}

	private onFormSubmit(event: Event): void {
		const detail = (event as CustomEvent).detail;

		if (!detail?.success || detail.wrapperEl !== this.wrapper) {
			return;
		}

		this.init();
	}
}
