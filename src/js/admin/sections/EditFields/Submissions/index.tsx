import { useCallback, useEffect, useState } from '@wordpress/element';
import { Button, ButtonGroup } from '@wordpress/components';
import ApprovalStatus from './ApprovalStatus/index';
import { ResendAllButton } from './ApprovalStatus/ResendButton';
import ShortcodeElement from '@admin/components/ShortcodeElement';
import { __ } from '@wordpress/i18n';
import {
	type Submissions,
	type SubmissionItem,
	type SubmissionID,
	type SubmissionStatus,
	type ChangeAction,
	type FetchSettings,
	type Order,
	type OrderBy,
	PER_PAGE,
} from './consts';
import type {
	ApprovalState,
	CheckboxValue,
} from '@admin/sections/EditFields/consts';
import {
	fetchSubmissions,
	updateSubmissions,
	deleteSubmissions,
	getFieldLabels,
	getHumanValue,
} from './utilities';
import {
	ExportButtonWrapper,
	SubmissionTabWrapper,
	EntriesWrapper,
} from './styled';
import Table, {
	usePagination,
	useTableHeadings,
} from '@admin/components/Table';
import type { OnSortArgs } from '@admin/components/Table/consts';
import SubmissionEditModal from './SubmissionEditModal';
import ExportModal from './ExportModal';
import NoticeSystem, { useNoticeSystem } from '@admin/components/NoticeSystem';

const SUBMISSION_LABELS = getFieldLabels();

export default function Submissions() {
	const { form_id = null, export_url = '' } = window?.petitionerData;
	const requireApproval = window?.petitionerData
		?.require_approval as CheckboxValue;
	const approvalState = window.petitionerData.approval_state as ApprovalState;

	const [submissions, setSubmissions] = useState<Submissions>([]);
	const [total, setTotal] = useState(0);

	const [tableState, setTableState] = useState({
		currentPage: 1,
		order: null as Order | null | undefined,
		orderby: null as OrderBy | null | undefined,
	});

	const updateTableState = useCallback(
		(newState: Partial<typeof tableState>) => {
			setTableState((prevState) => ({
				...prevState,
				...newState,
			}));
		},
		[]
	);

	const [showApproval, setShowApproval] = useState(requireApproval);
	const [defaultApprovalState, setDefaultApprovalState] =
		useState<ApprovalState>(() => {
			return approvalState === 'Email' ? 'Declined' : approvalState;
		});
	const [activeModal, setActiveModal] = useState<SubmissionID>();
	const [showExportModal, setShowExportModal] = useState<boolean>(false);

	const { showNotice, noticeStatus, noticeText, hideNotice } =
		useNoticeSystem();

	const hasSubmissions = submissions.length > 0;

	const fetchData = async () => {
		return fetchSubmissions({
			currentPage: tableState.currentPage,
			formID: form_id as FetchSettings['formID'],
			perPage: PER_PAGE,
			order: tableState.order,
			orderby: tableState.orderby,
			onSuccess: (data) => {
				setTotal(data.total);
				setSubmissions(data.submissions);
			},
		});
	};

	useEffect(() => {
		if (!form_id) return;

		fetchData();
	}, [tableState.currentPage, form_id, tableState.order, tableState.orderby]);

	useEffect(() => {
		const handleApprovalChange = () => {
			setShowApproval(requireApproval);

			if (approvalState) {
				setDefaultApprovalState(approvalState);
			}
		};

		window.addEventListener('onPtrApprovalChange', handleApprovalChange);

		return () => {
			window.removeEventListener(
				'onPtrApprovalChange',
				handleApprovalChange
			);
		};
	}, []);

	const handleStatusChange = async (
		id: SubmissionID,
		newStatus: SubmissionStatus,
		changeAction: ChangeAction
	) => {
		const question = `Are you sure you want to ${String(changeAction).toLowerCase()} this submission?`;

		if (window.confirm(question)) {
			updateSubmissions({
				data: {
					id: id,
					approval_status: newStatus,
				},
				onSuccess: () => {
					fetchData();
					showNotice(
						'success',
						__('Submission status updated!', 'petitioner')
					);
				},
				onError: (msg) => {
					console.error(msg);
					showNotice(
						'error',
						__('Failed to update submission status!', 'petitioner')
					);
				},
			});
		}
	};

	const paginationButtons = usePagination(
		total,
		PER_PAGE,
		tableState.currentPage,
		(page: number) => updateTableState({ currentPage: page })
	);

	const headingData = useTableHeadings(
		[
			{ id: 'email', label: SUBMISSION_LABELS.email, width: '20%' },
			{ id: 'name', label: SUBMISSION_LABELS.name },
			{ id: 'consent', label: SUBMISSION_LABELS.consent, width: '80px' },
			{ id: 'submitted_at', label: SUBMISSION_LABELS.submitted_at },
		],
		[
			{
				condition: showApproval,
				heading: {
					id: 'status',
					label: __('Status', 'petitioner'),
				},
			},
		]
	);

	const ExportComponent = () => {
		return (
			<ExportButtonWrapper>
				<ShortcodeElement
					clipboardValue={`[petitioner-submissions form_id="${form_id}" style="table" show_pagination="true"]`}
					label={__('Shortcode', 'petitioner')}
					help={__(
						'Use this shortcode to display submissions on any page or post.',
						'petitioner'
					)}
					fieldName="petitioner_shortcode"
					width="250px"
				/>
				{/* @ts-ignore */}
				<Button variant="primary" onClick={() => setShowExportModal(true)}>
					{__('Export entries as CSV', 'petitioner')}
				</Button>
			</ExportButtonWrapper>
		);
	};

	const tableRows = submissions.map((item) => {
		const cells: React.ReactNode[] = [
			item.email,
			`${item.fname} ${item.lname}`,
			getHumanValue(String(item.accept_tos), 'checkbox'),
			getHumanValue(item.submitted_at, 'date'),
		];

		if (showApproval) {
			cells.push(
				<ApprovalStatus
					item={item as SubmissionItem}
					defaultApprovalState={defaultApprovalState}
					onStatusChange={handleStatusChange}
				/>
			);
		}

		return {
			id: item.id,
			cells,
		};
	});

	const handleSortChange = ({ order, orderby }: OnSortArgs) => {
		updateTableState({
			order,
			orderby: orderby as OrderBy,
			currentPage: 1,
		});
	};

	const selectedSubmission = submissions.find(
		(item) => item.id === activeModal
	);

	const onModalClose = useCallback(() => setActiveModal(undefined), []);

	const onModalSave = useCallback(
		async (newData: SubmissionItem) => {
			await updateSubmissions({
				data: newData,
				onSuccess: () => {
					showNotice(
						'success',
						__('Submission updated!', 'petitioner')
					);
					onModalClose();
				},
				onError: (msg) => {
					console.error(msg);
					showNotice(
						'error',
						__('Failed to update submission!', 'petitioner')
					);
					onModalClose();
				},
			});

			fetchData();
		},
		[activeModal]
	);

	const onModalDelete = useCallback((id: SubmissionID) => {
		deleteSubmissions({
			id,
			onSuccess: () => {
				showNotice('success', __('Submission deleted!', 'petitioner'));
				onModalClose();
				fetchData();
			},
			onError: (msg: string) => {
				console.error(msg);
				showNotice(
					'error',
					__('Failed to delete submission!', 'petitioner')
				);
				onModalClose();
			},
		});
	}, []);

	const handleExportClose = useCallback(() => {
		setShowExportModal(false);
	}, []);

	return (
		<SubmissionTabWrapper id="AV_Petitioner_Submissions">
			<div>
				<h3>{__('Submissions', 'petitioner-theme')}</h3>
				{hasSubmissions && <ExportComponent />}
			</div>

			<EntriesWrapper>
				<NoticeSystem
					noticeStatus={noticeStatus}
					noticeText={noticeText}
					hideNotice={hideNotice}
				/>
				<p>
					{__('Total:', 'petitioner-theme')} {total}
				</p>
				<Table
					headings={headingData}
					rows={tableRows}
					onSort={handleSortChange}
					clickable={true}
					onItemSelect={(id) => setActiveModal(id)}
				/>
			</EntriesWrapper>
			<br />
			{hasSubmissions && <ResendAllButton />}
			<br />
			{paginationButtons?.length > 1 && (
				<ButtonGroup>{paginationButtons}</ButtonGroup>
			)}

			{selectedSubmission ? (
				<SubmissionEditModal
					submission={selectedSubmission}
					onClose={onModalClose}
					onSave={onModalSave}
					onDelete={onModalDelete}
				/>
			) : null}

			{showExportModal && <ExportModal total={total} onClose={handleExportClose} submissionExample={submissions[0]} />}
		</SubmissionTabWrapper>
	);
}
