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
} from './consts';
import type {
	ApprovalState,
	CheckboxValue,
} from '@admin/sections/EditFields/consts';
import { ExportButtonWrapper } from './styled';

export default function Submissions() {
	const { form_id = null, export_url = '' } = window?.petitionerData;

	const requireApproval = window?.petitionerData
		?.require_approval as CheckboxValue;
	const approvalState = window.petitionerData.approval_state as ApprovalState;

	const [submissions, setSubmissions] = useState<Submissions>([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [showApproval, setShowApproval] = useState(requireApproval);
	const [defaultApprovalState, setDefaultApprovalState] =
		useState<ApprovalState>(() => {
			return approvalState === 'Email' ? 'Declined' : approvalState;
		});

	const hasSubmissions = submissions.length > 0;

	const perPage = 100;

	const fetchData = async () => {
		const finalAjaxURL = `${ajaxurl}?action=petitioner_fetch_submissions&page=${currentPage}&form_id=${form_id}&per_page=${perPage}`;

		try {
			const response = await fetch(finalAjaxURL);
			const data = await response.json();

			if (data.success) {
				setTotal(data.data.total);
				setSubmissions(data.data.submissions);
			} else {
				console.error('Failed to fetch data');
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		if (!form_id) return;

		fetchData();
	}, [currentPage, form_id]);

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
				finalData.append('id', id);
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

	const SubmissionList = () => {
		return (
			<tbody>
				{submissions.map((item) => (
					<tr key={item.id}>
						<td>{item.email}</td>
						<td>
							{item.fname} {item.lname}
						</td>
						<td>{item.country}</td>
						<td>
							<small>
								{item.accept_tos === '1' ? '✅' : '❌'}
							</small>
						</td>
						<td>
							<small>{item.submitted_at}</small>
						</td>
						{showApproval && (
							<td>
								<ApprovalStatus
									item={item as SubmissionItem}
									defaultApprovalState={defaultApprovalState}
									onStatusChange={handleStatusChange}
								/>
							</td>
						)}
					</tr>
				))}
			</tbody>
		);
	};

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

	return (
		<div id="AV_Petitioner_Submissions">
			<div>
				<h3>Submissions</h3>
				{hasSubmissions && <ExportComponent />}
			</div>

			<div className="petitioner-admin__entries">
				<p>Total: {total}</p>
				<table className="wp-list-table widefat fixed striped table-view-list posts">
					<thead>
						{hasSubmissions ? (
							<tr>
								{/* @ts-ignore */}
								<th width="20%">Email</th>
								<th>First/Last name</th>
								<th style={{ width: '100px' }}>Country</th>
								{/* <th style={{ width: '30px' }}>BCC</th> */}
								<th style={{ width: '60px' }}>Consent</th>
								<th>Submitted at</th>
								{showApproval && (
									<th style={{ width: '200px' }}>Status</th>
								)}
							</tr>
						) : (
							<tr></tr>
						)}
					</thead>

					{hasSubmissions ? (
						<SubmissionList />
					) : (
						<td style={{ width: '100%', textAlign: 'center' }}>
							Your submissions will show up here
						</td>
					)}
				</table>
			</div>
			<br />
			{hasSubmissions && <ResendAllButton />}
			<br />
			{buttons?.length > 1 && <ButtonGroup>{buttons}</ButtonGroup>}
		</div>
	);
}
