import { __ } from '@wordpress/i18n';

// Types
export type Condition = {
	id: string;
	field: string;
	operator: string;
	value: any;
};

export type ConditionGroup = {
	id: string;
	logic: 'AND' | 'OR';
	conditions: Array<Condition>;
};

export type ConditionalLogicProps = {
	value: ConditionGroup;
	onChange: (value: ConditionGroup) => void;
	availableFields: Array<{ value: string; label: string }>;
};

// Operators
export const OPERATORS = [
	{ value: 'equals', label: __('Equals', 'petitioner') },
	{ value: 'not_equals', label: __('Not Equals', 'petitioner') },
	{ value: 'contains', label: __('Contains', 'petitioner') },
	{ value: 'not_contains', label: __('Does Not Contain', 'petitioner') },
	{ value: 'starts_with', label: __('Starts With', 'petitioner') },
	{
		value: 'not_starts_with',
		label: __('Does Not Start With', 'petitioner'),
	},
	{ value: 'ends_with', label: __('Ends With', 'petitioner') },
	{ value: 'not_ends_with', label: __('Does Not End With', 'petitioner') },
	{ value: 'is_empty', label: __('Is Empty', 'petitioner') },
	{ value: 'is_not_empty', label: __('Is Not Empty', 'petitioner') },
];

export const LOGIC_OPTIONS = [
	{ value: 'AND', label: __('AND', 'petitioner') },
	{ value: 'OR', label: __('OR', 'petitioner') },
];
