import { __ } from '@wordpress/i18n';
import type { SubmissionItem } from '../consts';
import {
	Card,
	// CardHeader,
	CardBody,
	CardDivider,
	// CardFooter,
	// __experimentalHeading as Heading,
	__experimentalText as Text,
	Button,
	Modal,
	// __experimentalDivider as Divider,
} from '@wordpress/components';

import { SUBMISSION_LABELS } from '../consts';
import { getHumanValue } from '../utilities';

export default function SubmissionEditModal({
	submission,
	onClose = () => {},
	onSave = (upatedItem) => {},
}: {
	submission: SubmissionItem;
	onClose: () => void;
	onSave?: (upatedItem: SubmissionItem) => void;
}) {
	// console.log('selected submission', submission);
	const submissionEntries = Object.entries(submission);
	const lastRowIndex = submissionEntries.length - 1;

	const submissionDetails = submissionEntries.map(
		([label, value], index) => {
			if (!SUBMISSION_LABELS?.[label]) {
				return;
			}

			const finalLabel = SUBMISSION_LABELS?.[label] ?? label;
			const finalValue = getHumanValue(value);

			const isEmpty = finalValue == __('(empty)', 'petitioner');

			return (
				<div key={label}>
					<CardBody>
						<strong>{finalLabel}:</strong>{' '}
						<Text
							color={!isEmpty ? '' : 'grey'}
							size={!isEmpty ? '' : '12'}
						>
							{finalValue}
						</Text>
					</CardBody>
					{index < lastRowIndex && <CardDivider />}
				</div>
			);
		}
	);

	return (
		<Modal
			size="large"
			title={__('Submission details', 'petitioner-theme')}
			onRequestClose={onClose}
		>
			<Card>{submissionDetails}</Card>
			{/* <Text>{description}</Text> */}
			{/* <Divider margin={5} />
			{integrationFields} */}
		</Modal>
	);
}
