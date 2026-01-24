import { __ } from '@wordpress/i18n';
import { Card, CardDivider, Modal } from '@wordpress/components';
import {
	StyledExportButton,
	SummaryWrapper,
	SummaryItem,
	NoticeSystemWrapper,
	StyledCardBody,
	SampleOfSubmissionsWrapper,
	ExportWrapper,
	DetailsWrapper,
	PreviewWrapper,
} from './styled';
import {
	FormattedLogic,
} from '@admin/components/ConditionalLogic';
import { getAjaxNonce } from '@admin/utilities';
import SpreadsheetSample from '@admin/components/SpreadsheetSample';
import Filters from '../Filters';
import { Heading, Text } from '@admin/components/Experimental';

import { type SubmissionItem } from '../consts';
import { useExportModal } from './hooks';


export default function ExportModal({
	onClose = () => { },
	total = 0,
	submissionExample,
}: {
	onClose: () => void;
	total: number;
	submissionExample: SubmissionItem;
}) {
	const {
		totalCount,
		csvExample,
		isLoading,
		exportURL,
		logic,
		validCount,
		handleLogicChange,
		noticeStatus,
		noticeText,
		hideNotice,
	} = useExportModal({
		submissionExample,
		total,
	});

	return (
		<Modal
			size="large"
			title={__('Export submissions', 'petitioner-theme')}
			onRequestClose={onClose}
		>
			<ExportWrapper>
				<DetailsWrapper>
					<Card>
						<NoticeSystemWrapper
							noticeStatus={noticeStatus}
							noticeText={noticeText}
							hideNotice={hideNotice}
						/>
						<StyledCardBody>
							<SummaryWrapper>
								<SummaryItem>
									{__('Total:', 'petitioner')}{' '}
									<strong>{totalCount}</strong>
								</SummaryItem>
								<SummaryItem>
									{__('Filters:', 'petitioner')}{' '}
									<strong><FormattedLogic logic={logic} /></strong>
								</SummaryItem>
								<CardDivider />
							</SummaryWrapper>

							<Filters
								validCount={validCount}
								logic={logic}
								onLogicChange={handleLogicChange}
								submissionExample={submissionExample}
							/>

						</StyledCardBody>
					</Card>
					<form action={exportURL} method="POST" target="_blank">
						<input
							type="hidden"
							name="conditional_logic"
							value={JSON.stringify(logic)}
						/>
						<input
							type="hidden"
							name="petitioner_nonce"
							value={getAjaxNonce()}
						/>
						<StyledExportButton
							icon="download"
							type="submit"
							variant="primary"
						>
							{__('Export as CSV', 'petitioner')} ({totalCount})
						</StyledExportButton>
					</form>
				</DetailsWrapper>
				<PreviewWrapper>
					<SampleOfSubmissionsWrapper>
						<Heading as="h3" level={3}>{__('Preview', 'petitioner')}</Heading>
						<Text>{__('This is a preview of the submissions that will be exported.', 'petitioner')}</Text>
						<SpreadsheetSample isLoading={isLoading} headings={csvExample?.headings ?? []} rows={csvExample?.rows ?? []} />
					</SampleOfSubmissionsWrapper>
				</PreviewWrapper>
			</ExportWrapper>
		</Modal>
	);
}
