import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import type { FormID } from '@admin/sections/EditFields/consts';
import type { SubmissionItem } from './consts';

export default function ResendButton(props: { item: SubmissionItem }) {
	const { id, confirmation_token } = props.item;
	const [isResent, setIsResent] = useState(false);
	if (
		window?.petitionerData?.approval_state === 'Declined' ||
		!confirmation_token
	) {
		return null;
	}

	const handleResendEmail = async (id: string | number) => {
		if (window.confirm('Resend confirmation email to this signee?')) {
			const response = await fetch(
				`${ajaxurl}?action=petitioner_resend_confirmation_email`,
				{
					method: 'POST',
					headers: {
						'Content-Type':
							'application/x-www-form-urlencoded; charset=UTF-8',
					},
					body: new URLSearchParams({
						id: id.toString(),
					}),
				}
			);

			const data = await response.json();

			if (data.success) {
				setIsResent(true);
				setTimeout(() => setIsResent(false), 3000);
			} else {
				console.log(data.message || 'Failed to resend email.');
			}
		}
	};

	return (
		<Button
			disabled={isResent}
			size="small"
			variant="link"
			onClick={() => handleResendEmail(id)}
		>
			{!isResent ? 'Resend verification' : 'Resent successfully'}
		</Button>
	);
}

export function ResendAllButton() {
	const form_id = window?.petitionerData?.form_id as FormID;

	if (!form_id) return null;

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
				body: new URLSearchParams({ form_id: String(form_id) }),
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
				body: new URLSearchParams({ form_id: String(form_id) }),
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
