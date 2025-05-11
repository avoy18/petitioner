import { useEffect, useState } from '@wordpress/element';
import { Button, ButtonGroup } from '@wordpress/components';
import ApprovalStatus from './ApprovalStatus';

function ResendAllButton() {
	const { form_id = null } = window?.petitionerData;
	const [isResentAll, setIsResentAll] = useState(false);

	const handleResendAll = async () => {
		// Check how many unconfirmed
		const checkResponse = await fetch(
			`${ajaxurl}?action=petitioner_check_unconfirmed_count`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({ form_id }),
			}
		);

		const checkData = await checkResponse.json();
		if (!checkData.success || !checkData.data.count) {
			alert('No unconfirmed users found for this petition.');
			return;
		}

		const count = checkData.data.count;

		// Confirm with user
		const confirmSend = window.confirm(
			`This will resend confirmation emails to ${count} unconfirmed signees. Proceed?`
		);

		if (!confirmSend) return;

		// Proceed with resend
		const resendResponse = await fetch(
			`${ajaxurl}?action=petitioner_resend_all_confirmation_emails`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({ form_id }),
			}
		);

		const resendData = await resendResponse.json();
		if (resendData.success) {
			setIsResentAll(true);
			setTimeout(() => setIsResentAll(false), 3000);
		} else {
			console.log(resendData.message || 'Failed to resend emails.');
		}
	};

	return (
		<>
			<Button
				disabled={isResentAll}
				variant="primary"
				onClick={handleResendAll}
			>
				{!isResentAll
					? 'Resend all unconfirmed emails'
					: 'Emails resent successfully'}
			</Button>
			<p>
				<strong style={{ color: 'salmon' }}>Warning</strong>: This
				action will resend confirmation emails to all unconfirmed
				signees. Proceed with caution: sending a large number of emails
				at once may negatively impact your domain’s reputation.
			</p>
		</>
	);
}

export default function Submissions() {
	const { form_id = null, export_url = '' } = window?.petitionerData;
	const [submissions, setSubmissions] = useState([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [showApproval, setShowApproval] = useState(
		window.petitionerData.require_approval
	);
	const [defaultApprovalState, setDefaultApprovalState] = useState(() => {
		if (window?.petitionerData?.approval_state === 'Email') {
			return 'Declined';
		}

		return window.petitionerData.approval_state;
	});

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
			setShowApproval(window.petitionerData.require_approval);
			setDefaultApprovalState(window.petitionerData.approval_state);
		});
	}, []);

	// Handle pagination click
	const handlePaginationClick = (page) => {
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

	const handleStatusChange = async (id, newStatus, changeAction) => {
		const question = `Are you sure you want to ${changeAction} this submission?`;

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
									item={item}
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
			<>
				<Button variant="primary" href={export_url}>
					Export entries as CSV
				</Button>
			</>
		);
	};

	return (
		<div id="AV_Petitioner_Submissions">
			<div>
				<h3>Submissions</h3>
				<ExportComponent />
			</div>

			<div className="petitioner-admin__entries">
				<p>Total: {total}</p>
				<table className="wp-list-table widefat fixed striped table-view-list posts">
					<thead>
						{submissions.length !== 0 ? (
							<tr>
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

					{submissions.length === 0 && (
						<td style={{ width: '100%', textAlign: 'center' }}>
							Your submissions will show up here
						</td>
					)}
					{submissions.length !== 0 && <SubmissionList />}
				</table>
			</div>

			<br />

			<ResendAllButton />

			<br />
			{buttons?.length > 1 && <ButtonGroup>{buttons}</ButtonGroup>}
		</div>
	);
}
