import type { SettingsFormData } from '@admin/sections/SettingsFields/consts';
import { LOCAL_STORAGE_KEY } from './consts';

type FetchPreviewCSSSettings = {
	formState: SettingsFormData;
	onSuccess?: (css: string) => void;
	onError?: (msg: string) => void;
	abortSignal?: AbortSignal;
}

export const fetchPreviewCSS = async ({
	formState,
	onSuccess = () => { },
	onError = () => { },
	abortSignal,
}: FetchPreviewCSSSettings) => {
	try {
		const finalQuery = new URLSearchParams();
		finalQuery.set('action', 'petitioner_generate_preview_css');

		const finalData = new FormData();
		finalData.append('payload', JSON.stringify(formState));
		finalData.append('petitioner_nonce', String(window.petitionerData.preview_nonce));

		const request = await fetch(`${ajaxurl}?${finalQuery.toString()}`, {
			method: 'POST',
			body: finalData,
			signal: abortSignal,
		});

		if (!request.ok) {
			onError('HTTP error: ' + request.status);
			return;
		}

		const result = await request.json();

		if (result.success && result.data?.css) {
			onSuccess(result.data.css);
		} else {
			onError('Failed to generate preview CSS');
		}
	} catch (error) {
		if (error instanceof DOMException && error.name === 'AbortError') {
			return; // Silently ignore aborted requests
		}
		onError('Error generating preview CSS: ' + error);
	}
};

export const localGetSavedFormId = (): number | null => {
	const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY);
	return saved ? Number(saved) : null;
}

export const localSaveFormID = (id: number) => {
	window.localStorage.setItem(LOCAL_STORAGE_KEY, String(id));
}