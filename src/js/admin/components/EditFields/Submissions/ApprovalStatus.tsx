import { Button } from '@wordpress/components';
import { ApprovalStatusProps } from '../../../../types/submissions.types';
import ResendButton from './ResendButton';

export default function ApprovalStatus(props: ApprovalStatusProps) {
	const { item, onStatusChange = () => {}, defaultApprovalState } = props;
	const { id, approval_status } = item;
	const currentStatus = approval_status ?? defaultApprovalState;
	const changeAction = currentStatus === 'Confirmed' ? 'Decline' : 'Confirm';

	return (
		<div>
			<p
				style={{
					color: currentStatus === 'Confirmed' ? 'green' : 'red',
				}}
			>
				{currentStatus}
			</p>
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
