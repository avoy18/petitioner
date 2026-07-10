import type { SettingsFormData } from '@admin/sections/SettingsFields/consts';

interface FetchPreviewCSSSettings {
	formState: SettingsFormData;
	onSuccess?: (css: string) => void;
	onError?: (msg: string) => void;
}

export const fetchPreviewCSS = async ({
	formState,
	onSuccess = () => {},
	onError = () => {},
}: FetchPreviewCSSSettings) => {
	try {
		const finalQuery = new URLSearchParams();
		finalQuery.set('action', 'petitioner_generate_preview_css');

		const finalData = new FormData();
		// serialize formState as payload
		Object.entries(formState).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				finalData.append(`payload[${key}]`, String(value));
			}
		});
		finalData.append('petitioner_nonce', String(window.petitionerData.preview_nonce));

		const request = await fetch(`${ajaxurl}?${finalQuery.toString()}`, {
			method: 'POST',
			body: finalData,
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
		onError('Error generating preview CSS: ' + error);
	}
};
