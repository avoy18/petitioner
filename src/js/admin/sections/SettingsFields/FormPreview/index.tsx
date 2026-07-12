import { __ } from '@wordpress/i18n';
import { PreviewCard, PreviewHeader, PreviewSelect, PreviewIframe } from './styled';
import { useFormPreview } from './hooks'

interface PetitionRecord {
	id: number;
	title?: {
		rendered: string;
	};
}

export default function FormPreview() {
	const {
		iframeRef,
		previewUrl,
		selectedFormId,
		petitions,
		setIframeLoaded,
		setSelectedFormId,
		syncPreview,
	} = useFormPreview();

	return (
		<PreviewCard>
			<PreviewHeader>
				<span>{__('Live Preview', 'petitioner')}</span>
				{Array.isArray(petitions) && petitions.length > 0 && (
					<PreviewSelect
						value={selectedFormId}
						onChange={(e) => {
							setIframeLoaded(false);
							setSelectedFormId(Number(e.target.value));
						}}
					>
						{petitions.map((p: PetitionRecord) => (
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
