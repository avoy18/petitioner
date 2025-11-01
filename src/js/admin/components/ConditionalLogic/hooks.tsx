import { useState, useCallback } from '@wordpress/element';
import type { Condition, ConditionGroup } from './consts';
import { generateId } from './utilities';

export const useConditionalLogic = (options?: {
	initialValue?: ConditionGroup;
	defaultLogic?: 'AND' | 'OR';
}) => {
	const createEmptyCondition = (): Condition => ({
		id: generateId(),
		field: '',
		operator: 'equals',
		value: '',
	});

	const createEmptyGroup = (logic: 'AND' | 'OR' = 'AND'): ConditionGroup => ({
		id: generateId(),
		logic,
		conditions: [createEmptyCondition()],
	});

	const defaultValue =
		options?.initialValue || createEmptyGroup(options?.defaultLogic);
	const [logic, setLogic] = useState<ConditionGroup>(defaultValue);

	const resetLogic = useCallback(() => {
		setLogic(createEmptyGroup(options?.defaultLogic));
	}, [options?.defaultLogic]);

	const validateCondition = (condition: Condition): boolean => {
		if (
			condition.operator === 'is_empty' ||
			condition.operator === 'is_not_empty'
		) {
			return !!condition.field && !!condition.operator;
		}
		return (
			!!condition.field && !!condition.operator && condition.value !== ''
		);
	};

	const isValid =
		logic.conditions.length > 0 &&
		logic.conditions.every(validateCondition);

	return {
		logic,
		setLogic,
		resetLogic,
		isValid,
	};
};
