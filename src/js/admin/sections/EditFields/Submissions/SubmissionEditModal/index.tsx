import { useCallback, useState } from '@wordpress/element';
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
	TextControl,
	// __experimentalDivider as Divider,
} from '@wordpress/components';

import { getHumanValue, getSubmissionValType } from '../utilities';
import { getFieldLabels } from './../utilities';
import { ActionButtons } from './styled';
import EditField from './EditField';

const SUBMISSION_LABELS = getFieldLabels();

export const isValidFieldKey = (
	key: string
): key is keyof typeof SUBMISSION_LABELS => {
	return key in SUBMISSION_LABELS;
};

export default function SubmissionEditModal({
	submission,
	onClose = () => {},
	onSave = (upatedItem) => {},
}: {
	submission: SubmissionItem;
	onClose: () => void;
	onSave?: (upatedItem: SubmissionItem) => void;
}) {
	const [isEdit, setIsEdit] = useState();
	const [submissionDetails, setSubmissionDetails] = useState(submission);

	/**
	 * 
	 * const updateFormState = useCallback(
		<K extends keyof PetitionerData>(key: K, value: PetitionerData[K]) => {
			setFormState((prevState) => ({ ...prevState, [key]: value }));
		},
		[]
	);
	 */
	const updateSubmissionDetails = useCallback((key, value) => {
		setSubmissionDetails((prevState) => ({ ...prevState, [key]: value }));
	}, []);

	const submissionEntries = Object.entries(submissionDetails);
	const lastRowIndex = submissionEntries.length - 1;

	const SubmissionDetails = submissionEntries.map(([label, value], index) => {
		if (!isValidFieldKey(label)) {
			return;
		}

		const finalLabel = SUBMISSION_LABELS[label] ?? label;
		const type = getSubmissionValType(label);
		const finalValue = getHumanValue(String(value), type);

		const isEmpty = finalValue == __('(empty)', 'petitioner');

		const ValueField =
			isEdit !== label ? (
				<Text
					color={!isEmpty ? '' : 'grey'}
					size={!isEmpty ? '' : '12'}
				>
					{finalValue}
				</Text>
			) : (
				<EditField
					type={type}
					value={finalValue}
					onChange={(val) => {
						updateSubmissionDetails(label, val);
					}}
				/>
			);

		return (
			<div key={label}>
				<CardBody>
					<strong>{finalLabel}:</strong> {ValueField}
					<Button
						size="small"
						variant="teritery"
						icon="edit"
						onClick={() => setIsEdit(label)}
					>
						{/* {__('Edit', 'petitioner')} */}
					</Button>
					<Button
						size="small"
						variant="teritery"
						icon="editor-spellcheck"
						onClick={() => setIsEdit(null)}
					>
						{/* {__('Done', 'petitioner')} */}
					</Button>
				</CardBody>
				{index < lastRowIndex && <CardDivider />}
			</div>
		);
	});

	return (
		<Modal
			size="large"
			title={__('Submission details', 'petitioner-theme')}
			onRequestClose={onClose}
		>
			<Card>{SubmissionDetails}</Card>
			{/* <Text>{description}</Text> */}
			{/* <Divider margin={5} />
			{integrationFields} */}
		</Modal>
	);
}
