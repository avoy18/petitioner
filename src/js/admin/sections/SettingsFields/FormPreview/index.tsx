import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useSettingsFormContext } from '@admin/context/SettingsContext';
import { PreviewCard, PreviewHeader, PreviewSelect, PreviewIframe } from './styled';
import { PREVIEW_UPDATE_EVENT } from './consts';

export default function FormPreview() {
	const { formState } = useSettingsFormContext();
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const petitions = window.petitionerData?.petitions || [];
	const [selectedFormId, setSelectedFormId] = useState(petitions.length > 0 ? petitions[0].id : 0);

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
				{petitions.length > 0 && (
					<PreviewSelect 
						value={selectedFormId} 
						onChange={(e) => setSelectedFormId(Number(e.target.value))}
					>
						{petitions.map((p) => (
							<option key={p.id} value={p.id}>{p.title}</option>
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
