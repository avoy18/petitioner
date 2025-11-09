import { useState, useMemo, useCallback, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Card, CardDivider, Modal } from '@wordpress/components';
import { useNoticeSystem } from '@admin/components/NoticeSystem';
import {
	StyledExportButton,
	SummaryWrapper,
	SummaryItem,
	NoticeSystemWrapper,
	StyledCardBody,
} from './styled';
import { getExportURL, getSubmissionCount } from '../utilities';
import {
	useConditionalLogic,
	formatLogicToString,
} from '@admin/components/ConditionalLogic';
import { getAjaxNonce } from '@admin/utilities';
import type { ConditionGroup } from '@admin/components/ConditionalLogic/consts';
import type { SubmissionItem } from '../consts';
import Filters from '../Filters';

export default function ExportModal({
	onClose = () => {},
	total = 0,
	submissionExample,
}: {
	onClose: () => void;
	total: number;
	submissionExample: SubmissionItem;
}) {
	const [totalCount, setTotalCount] = useState(total);
	const { logic, setLogic, validCount } = useConditionalLogic();
	const formID = submissionExample.form_id;

	const handleLogicChange = useCallback((newValue: ConditionGroup) => {
		setLogic(newValue);
		showNotice('success', __('Filters applied successfully', 'petitioner'));
	}, []);

	useEffect(() => {
		getSubmissionCount({
			formID,
			filters: logic,
			onSuccess: (count: number) => {
				setTotalCount(count);
			},
			onError: () => {
				showNotice(
					'error',
					__('Error getting submission count', 'petitioner')
				);
			},
		});
	}, [logic]);

	const exportURL = useMemo(() => getExportURL(), []);

	const { showNotice, noticeStatus, noticeText, hideNotice } =
		useNoticeSystem({ timeoutDuration: 1500 });

	return (
		<Modal
			size="large"
			title={__('Export submissions', 'petitioner-theme')}
			onRequestClose={onClose}
		>
			<Card>
				<StyledCardBody>
					<NoticeSystemWrapper
						noticeStatus={noticeStatus}
						noticeText={noticeText}
						hideNotice={hideNotice}
					/>
					<SummaryWrapper>
						<SummaryItem>
							{__('Total:', 'petitioner')}{' '}
							<strong>{totalCount}</strong>
						</SummaryItem>
						<SummaryItem>
							{__('Filters:', 'petitioner')}{' '}
							<strong>{formatLogicToString(logic)}</strong>
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
		</Modal>
	);
}
