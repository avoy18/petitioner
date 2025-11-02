import { Condition, ConditionGroup, OPERATORS } from "./consts";
import { __ } from '@wordpress/i18n';

export const generateId = () =>
	`${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

export const formatLogicToString = (
	logic: ConditionGroup,
	fieldLabels: Record<string, string> = {},
	emptyMessage: string = __('No filters applied', 'petitioner')
): string => {
	const formatCondition = (condition: Condition): string => {
		const fieldLabel = fieldLabels[condition.field] || condition.field;
		const operatorLabel =
			OPERATORS.find((op) => op.value === condition.operator)?.label ||
			condition.operator;

		if (
			condition.operator === 'is_empty' ||
			condition.operator === 'is_not_empty'
		) {
			return `${fieldLabel} ${operatorLabel}`;
		}

		return `${fieldLabel} ${operatorLabel} "${condition.value}"`;
	};

	const parts = logic.conditions
		.filter((c) => c.field) // Only include filled conditions
		.map(formatCondition);

	if (parts.length === 0) {
		return emptyMessage;
	}

	return parts.join(` ${logic.logic} `);
};
