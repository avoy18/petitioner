import { useEffect, useRef, useState, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useSettingsFormContext } from '@admin/context/SettingsContext';
import { PreviewCard, PreviewHeader, PreviewSelect, PreviewIframe } from './styled';

export default function FormPreview() {
	const { formState } = useSettingsFormContext();
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [iframeLoaded, setIframeLoaded] = useState(false);
	const [isSyncing, setIsSyncing] = useState(false);

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

		setIsSyncing(true);

		// 2. Fetch compiled CSS via AJAX
		try {
			const formData = new URLSearchParams();
			formData.append('action', 'petitioner_generate_preview_css');
			// serialize formState as payload
			Object.entries(formState).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					formData.append(`payload[${key}]`, String(value));
				}
			});

			const response = await fetch(ajaxurl, {
				method: 'POST',
				body: formData,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});
			const result = await response.json();

			if (result.success && result.data?.css) {
				iframeRef.current.contentWindow.postMessage(
					{ type: 'UPDATE_CSS', payload: result.data.css },
					'*'
				);
			}
		} catch (e) {
			console.error('Failed to update live preview CSS', e);
		} finally {
			setIsSyncing(false);
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
				<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					{__('Live Preview', 'petitioner')}
					{(isSyncing || !iframeLoaded) && <Spinner />}
				</span>
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
