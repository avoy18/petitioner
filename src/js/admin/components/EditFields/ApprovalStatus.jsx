import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';

export default function ApprovalStatus({
	item,
	onStatusChange = () => {},
	defaultApprovalState,
}) {
	const { id, approval_status, confirmation_token } = item;
	const currentStatus =
		approval_status?.length > 0 ? approval_status : defaultApprovalState;
	const changeAction = currentStatus === 'Confirmed' ? 'Decline' : 'Confirm';

	const [isResent, setIsResent] = useState(false);

	const handleResendEmail = async (id) => {
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
						id: id,
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

	function ResendButton() {
		if (
			window?.petitionerData?.approval_state === 'Declined' ||
			!confirmation_token
		) {
			return null;
		}

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

	return (
		<div>
			<small
				style={{
					color: currentStatus === 'Confirmed' ? 'green' : 'red',
				}}
			>
				{currentStatus}
			</small>
			<div style={{ display: 'flex', gap: '5px' }}>
				<Button
					size="small"
					isDestructive={currentStatus === 'Confirmed'}
					variant="secondary"
					onClick={() => {
						onStatusChange(
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
				{window?.petitionerData?.approval_state === 'Email' && (
					<ResendButton item={item} />
				)}
			</div>
		</div>
	);
}
