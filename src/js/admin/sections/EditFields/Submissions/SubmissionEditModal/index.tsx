import { useCallback, useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { SubmissionItem } from '../consts';
import {
	Card,
	CardDivider,
	__experimentalText as Text,
	Button,
	Modal,
} from '@wordpress/components';

import { getHumanValue, getSubmissionValType } from '../utilities';
import { getFieldLabels } from './../utilities';
import { FieldItem, InputGroup, ActionButtonWrapper } from './styled';
import type { FieldKey } from '@admin/sections/EditFields/FormBuilder/consts';
import ResendButton from '../ApprovalStatus/ResendButton';
import EditField from '@admin/components/EditField';

const SUBMISSION_LABELS = Object.fromEntries(
	Object.entries(getFieldLabels()).filter(([key]) => key !== 'submitted_at')
) as Partial<Record<FieldKey, string>>;

export const isValidFieldKey = (
	key: string
): key is keyof typeof SUBMISSION_LABELS => {
	return key in SUBMISSION_LABELS;
};

export default function SubmissionEditModal({
	submission,
	onClose = () => {},
	onSave = (upatedItem) => {},
	onDelete = (id) => {},
}: {
	submission: SubmissionItem;
	onClose: () => void;
	onDelete?: (upatedItemID: SubmissionItem['id']) => void;
	onSave?: (upatedItem: SubmissionItem) => void;
}) {
	const [isEdit, setIsEdit] = useState<FieldKey | null>(null);
	const [valuesChanged, setValuesChanged] = useState(false);
	const [submissionDetails, setSubmissionDetails] =
		useState<SubmissionItem>(submission);

	const updateSubmissionDetails = useCallback(
		(key: FieldKey, value: string) => {
			setSubmissionDetails((prevState) => ({
				...prevState,
				[key]: value,
			}));
		},
		[]
	);

	const submissionEntries = Object.entries(submissionDetails);
	const lastRowIndex = submissionEntries.length - 1;

	// Track if any values have changed from the original submission
	useEffect(() => {
		const hasChanged = (
			Object.keys(submissionDetails) as Array<keyof SubmissionItem>
		).some((key) => {
			return submissionDetails[key] !== submission[key];
		});
		setValuesChanged(hasChanged);
	}, [submissionDetails, submission]);

	const SubmissionDetails = submissionEntries.map(([label, value], index) => {
		if (!isValidFieldKey(label)) {
			return;
		}
		const valueString = String(value);
		const finalLabel = SUBMISSION_LABELS[label] ?? label;
		const type = getSubmissionValType(label);
		const finalValue = getHumanValue(valueString, type);

		const isEmpty = finalValue == __('(empty)', 'petitioner');
		const currentlyEditing = isEdit === label;

		let ValueField = (
			<Text color={!isEmpty ? '' : 'grey'} size={!isEmpty ? '' : '12'}>
				{finalValue}
			</Text>
		);

		const actionButtonProps = {
			icon: 'edit',
			onClick: () => setIsEdit(label),
			children: (
				<span className="screen-reader-text">
					{__('Edit', 'petitioner')}
				</span>
			),
		};

		if (currentlyEditing) {
			ValueField = (
				<EditField
					type={type}
					value={valueString}
					onChange={(val) => {
						updateSubmissionDetails(label, val);
					}}
				/>
			);

			actionButtonProps.icon = 'saved';
			actionButtonProps.onClick = () => setIsEdit(null);
			actionButtonProps.children = (
				<span className="screen-reader-text">
					{__('Done', 'petitioner')}
				</span>
			);
		}

		return (
			<div key={label}>
				<FieldItem>
					<strong>{finalLabel}:</strong>

					<InputGroup>
						{ValueField}
						<Button
							size="small"
							variant="tertiary"
							{...actionButtonProps}
						/>
					</InputGroup>
				</FieldItem>
				{index < lastRowIndex && <CardDivider />}
			</div>
		);
	});

	const onRequestClose = useCallback(() => {
		if (valuesChanged) {
			if (
				window.confirm(
					__(
						'Are you sure you want to close without saving?',
						'petitioner'
					)
				)
			) {
				onClose();
			}
		} else {
			onClose();
		}
	}, [valuesChanged]);

	const handleOnDelete = useCallback(() => {
		if (
			window.confirm(
				__(
					'Are you sure you want to delete this submission?',
					'petitioner'
				)
			)
		) {
			onDelete(submissionDetails.id);
		}
	}, []);

	return (
		<Modal
			shouldCloseOnClickOutside={!valuesChanged}
			shouldCloseOnEsc={!valuesChanged}
			size="large"
			title={__('Submission details', 'petitioner')}
			onRequestClose={onRequestClose}
			headerActions={
				<ActionButtonWrapper>
					{window?.petitionerData?.approval_state === 'Email' && (
						<ResendButton item={submissionDetails} />
					)}
					<Button
						variant="secondary"
						isDestructive={true}
						onClick={handleOnDelete}
					>
						{__('Delete', 'petitioner')}
					</Button>
					<Button
						variant="primary"
						onClick={() => onSave(submissionDetails)}
						disabled={!valuesChanged}
					>
						{__('Save', 'petitioner')}
					</Button>
				</ActionButtonWrapper>
			}
		>
			<Card>{SubmissionDetails}</Card>
		</Modal>
	);
}
