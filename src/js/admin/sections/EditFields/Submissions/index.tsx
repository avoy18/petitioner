import { useCallback, useEffect, useState } from '@wordpress/element';
import { Button, ButtonGroup } from '@wordpress/components';
import ApprovalStatus from './ApprovalStatus';
import { ResendAllButton } from './ResendButton';
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
	UPDATE_ACTION,
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
	useNoticeSystem,
} from './utilities';
import {
	ExportButtonWrapper,
	SubmissionTabWrapper,
	EntriesWrapper,
} from './styled';
import { Table } from '@admin/components/Table';
import type { OnSortArgs } from '@admin/components/Table/consts';
import SubmissionEditModal from './SubmissionEditModal';

const SUBMISSION_LABELS = getFieldLabels();

export default function Submissions() {
	const { form_id = null, export_url = '' } = window?.petitionerData;

	const requireApproval = window?.petitionerData
		?.require_approval as CheckboxValue;
	const approvalState = window.petitionerData.approval_state as ApprovalState;

	const [submissions, setSubmissions] = useState<Submissions>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [order, setOrder] = useState<Order | null>();
	const [orderby, setOrderBy] = useState<OrderBy | null>();
	const [showApproval, setShowApproval] = useState(requireApproval);
	const [defaultApprovalState, setDefaultApprovalState] =
		useState<ApprovalState>(() => {
			return approvalState === 'Email' ? 'Declined' : approvalState;
		});
	const [activeModal, setActiveModal] = useState<SubmissionID>();

	const hasSubmissions = submissions.length > 0;

	const perPage = 100;

	const fetchData = async () => {
		return fetchSubmissions({
			currentPage,
			formID: form_id as FetchSettings['formID'],
			perPage,
			order,
			orderby,
			onSuccess: (data) => {
				setTotal(data.total);
				setSubmissions(data.submissions);
			},
		});
	};

	useEffect(() => {
		if (!form_id) return;

		fetchData();
	}, [currentPage, form_id, order, orderby]);

	useEffect(() => {
		window.addEventListener('onPtrApprovalChange', () => {
			setShowApproval(requireApproval);

			if (approvalState) {
				setDefaultApprovalState(approvalState);
			}
		});
	}, []);

	const { showNotice, hideNotice, NoticeElement } = useNoticeSystem();

	const handleStatusChange = async (
		id: SubmissionID,
		newStatus: SubmissionStatus,
		changeAction: ChangeAction
	) => {
		const question = `Are you sure you want to ${String(changeAction).toLowerCase()} this submission?`;

		if (window.confirm(question)) {
			const finalAjaxURL = `${ajaxurl}?action=${UPDATE_ACTION}`;
			try {
				const finalData = new FormData();
				finalData.append('id', String(id));
				finalData.append('status', newStatus);

				const response = await fetch(finalAjaxURL, {
					method: 'POST',
					body: finalData,
				});

				const data = await response.json();

				if (data.success) {
					fetchData();
				} else {
					console.error('Failed to update submission status');
				}
			} catch (error) {
				console.error('Error updating submission status:', error);
			}
		}
	};

	const handlePaginationClick = (page: number) => {
		setCurrentPage(page);
	};

	const totalPages = Math.ceil(total / perPage);
	const buttons = [];

	for (let i = 1; i <= totalPages; i++) {
		buttons.push(
			<Button
				variant={currentPage !== i ? 'secondary' : 'primary'}
				key={i}
				onClick={() => handlePaginationClick(i)}
				data-page={i}
			>
				{i}
			</Button>
		);
	}

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

				<Button variant="primary" href={String(export_url)}>
					{__('Export entries as CSV', 'petitioner')}
				</Button>
			</ExportButtonWrapper>
		);
	};

	const headingData = [
		{ id: 'email', label: SUBMISSION_LABELS.email, width: '20%' },
		{ id: 'name', label: SUBMISSION_LABELS.name },
		{ id: 'consent', label: SUBMISSION_LABELS.consent, width: '60px' },
		{ id: 'submitted_at', label: SUBMISSION_LABELS.submitted_at },
	];

	if (showApproval) {
		headingData.push({
			id: 'status',
			label: __('Status', 'petitioner'),
			width: '220px',
		});
	}

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
		setOrder(order);
		setOrderBy(orderby as OrderBy);
		setCurrentPage(1);
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
					showNotice('success', __('Submission updated!', 'petitioner'));
					onModalClose();
				},
				onError: (msg) => {
					console.error(msg);
					showNotice('error', __('Failed to update submission!', 'petitioner'));
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
				showNotice('error', __('Failed to delete submission!', 'petitioner'));
				onModalClose();
			},
		});
	}, []);

	return (
		<SubmissionTabWrapper id="AV_Petitioner_Submissions">
			<div>
				<h3>{__('Submissions', 'petitioner-theme')}</h3>
				{hasSubmissions && <ExportComponent />}
			</div>

			<EntriesWrapper>
				<NoticeElement />
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
			{buttons?.length > 1 && <ButtonGroup>{buttons}</ButtonGroup>}

			{selectedSubmission ? (
				<SubmissionEditModal
					submission={selectedSubmission}
					onClose={onModalClose}
					onSave={onModalSave}
					onDelete={onModalDelete}
				/>
			) : null}
		</SubmissionTabWrapper>
	);
}
