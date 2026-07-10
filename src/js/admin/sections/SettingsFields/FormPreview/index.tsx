import { useEffect, useRef, useState, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useSettingsFormContext } from '@admin/context/SettingsContext';
import { getAjaxNonce } from '@admin/utilities';
import { PreviewCard, PreviewHeader, PreviewSelect, PreviewIframe } from './styled';

export default function FormPreview() {
	const { formState } = useSettingsFormContext();
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [iframeLoaded, setIframeLoaded] = useState(false);

	const petitions = useSelect((select) => {
		// @ts-ignore - core-data types might not be fully available
		return select('core').getEntityRecords('postType', 'petitioner-petition', {
			per_page: 10,
		});
	}, []);

	const [selectedFormId, setSelectedFormId] = useState(0);

	useEffect(() => {
		if (petitions && petitions.length > 0 && selectedFormId === 0) {
			setSelectedFormId(petitions[0].id);
		}
	}, [petitions, selectedFormId]);

	const syncPreview = useCallback(async () => {
		if (!iframeRef.current?.contentWindow) return;

		// 1. Send visibility updates instantly
		iframeRef.current.contentWindow.postMessage(
			{ type: 'UPDATE_VISIBILITY', payload: formState },
			'*'
		);

		// 2. Fetch compiled CSS via AJAX
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
			finalData.append('petitioner_nonce', getAjaxNonce());

			const request = await fetch(`${ajaxurl}?${finalQuery.toString()}`, {
				method: 'POST',
				body: finalData,
			});
			
			if (!request.ok) {
				console.error('HTTP error: ', request.status);
				return;
			}
			
			const result = await request.json();

			if (result.success && result.data?.css) {
				iframeRef.current.contentWindow.postMessage(
					{ type: 'UPDATE_CSS', payload: result.data.css },
					'*'
				);
			}
		} catch (e) {
			console.error('Failed to update live preview CSS', e);
		}
	}, [formState]);

	// Sync settings to the iframe via AJAX + postMessage
	useEffect(() => {
		if (!iframeLoaded) return;

		// Debounce the AJAX call
		const timeout = setTimeout(() => {
			syncPreview();
		}, 300);

		return () => clearTimeout(timeout);
	}, [syncPreview, iframeLoaded]);

	const previewUrl = `${window.petitionerData?.home_url || '/'}?petitioner_live_preview=1&form_id=${selectedFormId}`;

	return (
		<PreviewCard>
			<PreviewHeader>
				<span>{__('Live Preview', 'petitioner')}</span>
				{petitions && petitions.length > 0 && (
					<PreviewSelect 
						value={selectedFormId} 
						onChange={(e) => {
							setIframeLoaded(false);
							setSelectedFormId(Number(e.target.value));
						}}
					>
						{petitions.map((p: any) => (
							<option key={p.id} value={p.id}>{p.title?.rendered || __('(No Title)', 'petitioner')}</option>
						))}
					</PreviewSelect>
				)}
			</PreviewHeader>
			<PreviewIframe 
				ref={iframeRef}
				src={previewUrl} 
				onLoad={() => {
					setIframeLoaded(true);
					syncPreview();
				}}
			/>
		</PreviewCard>
	);
}
