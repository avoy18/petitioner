import { useEffect, useRef, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useSettingsFormContext } from '@admin/context/SettingsContext';
import { PreviewCard, PreviewHeader, PreviewSelect, PreviewIframe } from './styled';
import { PREVIEW_UPDATE_EVENT } from './consts';

export default function FormPreview() {
	const { formState } = useSettingsFormContext();
	const iframeRef = useRef<HTMLIFrameElement>(null);

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

	// Sync settings to the iframe via postMessage
	useEffect(() => {
		if (iframeRef.current && iframeRef.current.contentWindow) {
			iframeRef.current.contentWindow.postMessage(
				{ type: PREVIEW_UPDATE_EVENT, payload: formState },
				'*'
			);
		}
	}, [formState]);

	const previewUrl = `${ajaxurl}?action=petitioner_live_preview&form_id=${selectedFormId}`;

	return (
		<PreviewCard>
			<PreviewHeader>
				<span>{__('Live Preview', 'petitioner')}</span>
				{petitions && petitions.length > 0 && (
					<PreviewSelect 
						value={selectedFormId} 
						onChange={(e) => setSelectedFormId(Number(e.target.value))}
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
					// Trigger initial sync once iframe loads
					if (iframeRef.current?.contentWindow) {
						iframeRef.current.contentWindow.postMessage(
							{ type: PREVIEW_UPDATE_EVENT, payload: formState },
							'*'
						);
					}
				}}
			/>
		</PreviewCard>
	);
}
