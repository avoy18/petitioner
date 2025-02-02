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
		window.petitionerData.approval_state
	);

	const perPage = 100;

	const fetchData = async () => {
		const finalAjaxURL = `${ajaxurl}?action=petitioner_fetch_submissions&page=${currentPage}&form_id=${form_id}&per_page=${perPage}`;

		try {
			const response = await fetch(finalAjaxURL);
			const data = await response.json();

			if (data.success) {
				// console.log(data);
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
							</td>
						)}
					</tr>
				))}
			</tbody>
		);
	};

	return (
		<div id="AV_Petitioner_Submissions">
			<h3>Submissions</h3>

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
