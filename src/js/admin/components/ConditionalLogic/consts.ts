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

export type GroupComponentProps = {
	group: ConditionGroup;
	availableFields: Array<{ value: string; label: string }>;
	onChange: (group: ConditionGroup) => void;
};

export type ConditionComponentProps = {
	condition: Condition;
	availableFields: Array<{ value: string; label: string }>;
	onChange: (condition: Condition) => void;
	onRemove: () => void;
};

// Operators
export const OPERATORS = [
	{ value: 'equals', label: __('equals', 'petitioner') },
	{ value: 'not_equals', label: __('not equals', 'petitioner') },
	{ value: 'is_empty', label: __('is empty', 'petitioner') },
	{ value: 'is_not_empty', label: __('is not empty', 'petitioner') },
];

export const LOGIC_OPTIONS = [
	{ value: 'AND', label: __('AND', 'petitioner') },
	{ value: 'OR', label: __('OR', 'petitioner') },
];
