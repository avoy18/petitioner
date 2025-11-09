import type { ConditionGroup } from '@admin/components/ConditionalLogic/consts';
import type { SubmissionItem } from '../consts';

export const EXCLUDED_FIELDS = [
	'id',
	'form_id',
	'confirmation_token',
	'comments',
	'submitted_at',
	'approval_status',
	'legal',
];

export type FiltersProps = {
	validCount: number;
	logic: ConditionGroup;
	onLogicChange: (newValue: ConditionGroup) => void;
	submissionExample: SubmissionItem;
};
