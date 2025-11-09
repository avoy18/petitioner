import { useState, useMemo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Card,
	CardDivider,
	CardBody,
	Button,
	Modal,
} from '@wordpress/components';
import { useNoticeSystem } from '@admin/components/NoticeSystem';
import {
	StyledExportButton,
	SummaryWrapper,
	SummaryItem,
	FiltersWrapper,
	NoticeSystemWrapper,
	StyledCardBody,
} from './styled';
import { getExportURL, getFieldLabels } from '../utilities';
import ConditionalLogic, {
	useConditionalLogic,
	formatLogicToString,
} from '@admin/components/ConditionalLogic';
import { getAjaxNonce } from '@admin/utilities';
import type { ConditionGroup } from '@admin/components/ConditionalLogic/consts';
import type { SubmissionItem } from '../consts';

const EXCLUDED_FIELDS = [
	'id',
	'form_id',
	'confirmation_token',
	'comments',
	'submitted_at',
	'approval_status',
	'legal',
];

export default function ExportModal({
	onClose = () => {},
	total = 0,
	submissionExample,
}: {
	onClose: () => void;
	total: number;
	submissionExample: SubmissionItem;
}) {
	const [showFilters, setShowFilters] = useState(false);
	const { logic, setLogic, validCount } = useConditionalLogic();
	const potentialLabels = getFieldLabels();
	const handleLogicChange = useCallback((newValue: ConditionGroup) => {
		setLogic(newValue);
		setShowFilters(false);
		showNotice('success', __('Filters applied successfully', 'petitioner'));
	}, []);

	const exportURL = useMemo(() => getExportURL(), []);
	const availableFields = useMemo(() => {
		return Object.keys(submissionExample)
			.map((key) => {
				if (EXCLUDED_FIELDS.includes(key)) {
					return null;
				}

				const label =
					potentialLabels?.[key as keyof typeof potentialLabels];

				if (!label) {
					return null;
				}

				return {
					value: key,
					label,
				};
			})
			.filter(Boolean) as Array<{ value: string; label: string }>;
	}, [submissionExample, potentialLabels]);

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
							<strong>{total}</strong>
						</SummaryItem>
						<SummaryItem>
							{__('Filters:', 'petitioner')}{' '}
							<strong>{formatLogicToString(logic)}</strong>
						</SummaryItem>
						<CardDivider />
					</SummaryWrapper>

					<FiltersWrapper>
						<Button
							icon="filter"
							variant="secondary"
							onClick={() => setShowFilters(!showFilters)}
						>
							{showFilters
								? __('Hide filters', 'petitioner')
								: __('Show filters', 'petitioner')}

							<span>({validCount})</span>
						</Button>
						{showFilters && (
							<ConditionalLogic
								value={logic}
								onChange={handleLogicChange}
								availableFields={availableFields}
							/>
						)}
					</FiltersWrapper>
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
				<StyledExportButton icon="download" type="submit" variant="primary">
					{__('Export as CSV', 'petitioner')} ({total})
				</StyledExportButton>
			</form>
		</Modal>
	);
}
