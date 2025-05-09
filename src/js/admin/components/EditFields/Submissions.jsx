import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, SelectControl } from '@wordpress/components';

export default function Submissions() {
	const { form_id = null, export_url = '' } = window?.petitionerData;
	const [submissions, setSubmissions] = useState([]);
	const [total, setTotal] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [showApproval, setShowApproval] = useState(
		window.petitionerData.require_approval
	);
	const [defaultApprovalState, setDefaultApprovalState] = useState(
		() => {
			if(window.petitionerData.approval_state === 'Email'){
				return 'Declined'
			}

			return window.petitionerData.approval_state;
		}
	);

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
				finalData.append('ids', id);
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

	const handleResendEmail = async (id) => {
		if (window.confirm("Resend confirmation email to this signee?")) {
			const response = await fetch(`${ajaxurl}?action=petitioner_resend_confirmation_email`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				},
				body: new URLSearchParams({
					id: id,
				}),
			});
	
			const data = await response.json();
			if (data.success) {
				alert('Confirmation email resent successfully.');
			} else {
				alert(data.message || 'Failed to resend email.');
			}
		}
	};

	const handleResendAll = async () => {
		// Check how many unconfirmed
		const checkResponse = await fetch(`${ajaxurl}?action=petitioner_check_unconfirmed_count`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({ form_id }),
		});

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
		const resendResponse = await fetch(`${ajaxurl}?action=petitioner_resend_all_confirmation_emails`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({ form_id }),
		});

		const resendData = await resendResponse.json();
		if (resendData.success) {
			alert(`Resent confirmation emails to ${count} users.`);
		} else {
			alert(resendData.message || 'Failed to resend emails.');
		}
	};

	const ApprovalStatus = ({ id, currentStatus = '' }) => {
		currentStatus =
			currentStatus?.length > 0 ? currentStatus : defaultApprovalState;
		const changeAction =
			currentStatus === 'Confirmed' ? 'Decline' : 'Confirm';

		return (
			<div>
				<small
					style={{
						color: currentStatus === 'Confirmed' ? 'green' : 'red',
					}}
				>
					{currentStatus}
				</small>{' '}
				<Button
					size="small"
					isDestructive={currentStatus === 'Confirmed'}
					variant="secondary"
					onClick={() => {
						handleStatusChange(
							id,
							currentStatus === 'Confirmed'
								? 'Declined'
								: 'Confirmed',
							changeAction.toLowerCase()
						);
					}}
				>
					{changeAction}
				</Button>
			</div>
		);
	};

	const SubmissionList = () => {
		return (
			<tbody>
				{submissions.map((item) => (
					<tr key={item.id}>
						<td>{item.email}</td>
						<td>{item.fname}</td>
						<td>{item.lname}</td>
						<td>{item.country}</td>
						{/* <td>
							<small>
								{item.bcc_yourself === '1' ? '✅' : '❌'}
							</small>
						</td> */}
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
									id={item.id}
									currentStatus={item.approval_status}
								/>
								{item.approval_status === 'Declined' && item.confirmation_token && (
									<Button
										size="small"
										variant="secondary"
										onClick={() => handleResendEmail(item.id)}
										style={{ marginTop: '5px' }}
									>
										Resend Email
									</Button>
								)}
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

	const ResendAllButton = () => {
		return (
			<Button variant="secondary" onClick={handleResendAll} style={{ marginLeft: '8px' }}>
				Resend All Unconfirmed Emails
			</Button>
		);
	};		

	return (
		<div id="AV_Petitioner_Submissions">
			<div>
				<h3>Submissions</h3>

				<ExportComponent />
				<ResendAllButton />
			</div>

			<div className="petitioner-admin__entries">
				<p>Total: {total}</p>
				<table className="wp-list-table widefat fixed striped table-view-list posts">
					<thead>
						{submissions.length !== 0 ? (
							<tr>
								<th width="20%">Email</th>
								<th>First Name</th>
								<th>Last Name</th>
								<th>Country</th>
								{/* <th style={{ width: '30px' }}>BCC</th> */}
								<th style={{ width: '100px' }}>Consent</th>
								<th>Submitted At</th>
								{showApproval && (
									<th style={{ width: '150px' }}>Status</th>
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
			{buttons?.length > 1 && <ButtonGroup>{buttons}</ButtonGroup>}
		</div>
	);
}
