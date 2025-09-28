import { useEffect, useState } from '@wordpress/element';
import { Button, ButtonGroup } from '@wordpress/components';
import ApprovalStatus from './ApprovalStatus';
import { ResendAllButton } from './ResendButton';
import ShortcodeElement from '@admin/components/ShortcodeElement';
import { __ } from '@wordpress/i18n';
import type {
	Submissions,
	SubmissionItem,
	SubmissionID,
	SubmissionStatus,
	ChangeAction,
	FetchSettings,
	Order,
	OrderBy,
} from './consts';
import type {
	ApprovalState,
	CheckboxValue,
} from '@admin/sections/EditFields/consts';
import { fetchSubmissions, updateSubmissions } from './utilities';
import { ExportButtonWrapper } from './styled';
import { Table } from '@admin/components/Table';
import type { OnSortArgs } from '@admin/components/Table/consts';

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

	const hasSubmissions = submissions.length > 0;

	const perPage = 100;

	const fetchData = async () => {
		console.log('fetch')
		return fetchSubmissions({
			currentPage,
			formID: form_id as FetchSettings['formID'],
			perPage,
			onSuccess: (data) => {
				console.log(data);
				setTotal(data.total);
				setSubmissions(data.submissions);
			},
			order,
			orderby,
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

	const handleStatusChange = async (
		id: SubmissionID,
		newStatus: SubmissionStatus,
		changeAction: ChangeAction
	) => {
		const question = `Are you sure you want to ${String(changeAction).toLowerCase()} this submission?`;

		if (window.confirm(question)) {
			const finalAjaxURL = `${ajaxurl}?action=petitioner_change_status`;
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

	// Handle pagination click
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
				{/* @ts-ignore */}
				<Button variant="primary" href={export_url}>
					{__('Export entries as CSV', 'petitioner')}
				</Button>
			</ExportButtonWrapper>
		);
	};

	const headingData = [
		{ id: 'email', label: __('Email', 'petitioner'), width: '20%' },
		{ id: 'name', label: __('First/Last name', 'petitioner') },
		{ id: 'country', label: __('Country', 'petitioner'), width: '100px' },
		// { id: 'bcc', label: __('BCC', 'petitioner'), width: '30px' }, // optional
		{ id: 'consent', label: __('Consent', 'petitioner'), width: '60px' },
		{ id: 'submitted_at', label: __('Submitted at', 'petitioner') },
	];

	if (showApproval) {
		headingData.push({
			id: 'status',
			label: __('Status', 'petitioner'),
			width: '200px',
		});
	}

	const headingRows = submissions.map((item) => {
		const itemRow: React.ReactNode[] = [
			item.email,
			`${item.fname} ${item.lname}`,
			item.country,
			item.accept_tos === '1' ? '✅' : '❌',
			item.submitted_at,
		];

		if (showApproval) {
			itemRow.push(
				<ApprovalStatus
					item={item as SubmissionItem}
					defaultApprovalState={defaultApprovalState}
					onStatusChange={handleStatusChange}
				/>
			);
		}

		return itemRow;
	});

	const handleSortChange = ({ order, orderby }: OnSortArgs) => {
		setOrder(order);
		setOrderBy(orderby as OrderBy);
	};

	return (
		<div id="AV_Petitioner_Submissions">
			<div>
				<h3>Submissions</h3>
				{hasSubmissions && <ExportComponent />}
			</div>

			<div className="petitioner-admin__entries">
				<p>Total: {total}</p>
				<Table
					headings={headingData}
					rows={headingRows}
					onSort={handleSortChange}
				/>
			</div>
			<br />
			{hasSubmissions && <ResendAllButton />}
			<br />
			{buttons?.length > 1 && <ButtonGroup>{buttons}</ButtonGroup>}
		</div>
	);
}
