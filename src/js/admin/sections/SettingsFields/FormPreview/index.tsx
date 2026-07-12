import { __ } from '@wordpress/i18n';
import { PreviewCard, PreviewHeader, PreviewSelect, PreviewIframe, PreviewTitleWrapper } from './styled';
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
		onFormSelect,
		syncPreview,
	} = useFormPreview();

	return (
		<PreviewCard>
			<PreviewHeader>
				<PreviewTitleWrapper>
					<p>{__('Live Preview', 'petitioner')}</p>
					<small>{__('Note: this is not a perfect representation of your frontend, but its close', 'petitioner')}</small>
				</PreviewTitleWrapper>
				{Array.isArray(petitions) && petitions.length > 0 && (
					<PreviewSelect
						value={selectedFormId}
						onChange={(e) => {
							onFormSelect(Number(e.target.value));
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
