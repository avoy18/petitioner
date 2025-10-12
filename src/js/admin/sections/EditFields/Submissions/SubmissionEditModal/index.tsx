import { useCallback, useState } from '@wordpress/element';
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
import { FieldItem, InputGroup } from './styled';
import SubmissionEditField from './SubmissionEditField';
import type { FieldKey } from '@admin/sections/EditFields/FormBuilder/consts';

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
	const [isEdit, setIsEdit] = useState<FieldKey | null>(null);
	const [valuesChanged, setValuesChanged] = useState(false);
	const [submissionDetails, setSubmissionDetails] =
		useState<SubmissionItem>(submission);

	const updateSubmissionDetails = useCallback(
		(key: FieldKey, value: string) => {
			const oldState = submission?.[key as keyof SubmissionItem] || '';

			/**
			 * If the value actually changed, update the state
			 */
			if (oldState != value) {
				setValuesChanged(true);
			}

			setSubmissionDetails((prevState) => ({
				...prevState,
				[key]: value,
			}));
		},
		[]
	);

	const submissionEntries = Object.entries(submissionDetails);
	const lastRowIndex = submissionEntries.length - 1;

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
				<SubmissionEditField
					label={label}
					isEmpty={isEmpty}
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
					__('Are you sure you want to close without saving?')
				)
			) {
				onClose();
			}
		} else {
			onClose();
		}
	}, [valuesChanged]);

	return (
		<Modal
			shouldCloseOnClickOutside={!valuesChanged}
			shouldCloseOnEsc={!valuesChanged}
			size="large"
			title={__('Submission details', 'petitioner-theme')}
			onRequestClose={onRequestClose}
			headerActions={
				<>
					<Button
						variant="primary"
						onClick={() => onSave(submissionDetails)}
						disabled={!valuesChanged}
					>
						{__('Save', 'petitioner')}
					</Button>
				</>
			}
		>
			<Card>{SubmissionDetails}</Card>
		</Modal>
	);
}
