import { memo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { LogicWrapper, ConditionBadge, FieldName, Operator, Value, LogicConnector, EmptyState } from './styled';
import type { ConditionGroup } from '../consts';
import { OPERATORS } from '../consts';

interface FormattedLogicProps {
	logic: ConditionGroup;
	fieldLabels?: Record<string, string>;
	emptyMessage?: string;
}

const FormattedLogic = ({
	logic,
	fieldLabels = {},
	emptyMessage = __('No filters applied', 'petitioner'),
}: FormattedLogicProps) => {
	const validConditions = logic.conditions.filter((c) => c.field);

	if (validConditions.length === 0) {
		return <EmptyState>{emptyMessage}</EmptyState>;
	}

	return (
		<LogicWrapper>
			{validConditions.map((condition, index) => {
				const fieldLabel =
					fieldLabels[condition.field] || condition.field;
				const operatorLabel =
					OPERATORS.find((op) => op.value === condition.operator)
						?.label || condition.operator;

				const needsValue =
					condition.operator !== 'is_empty' &&
					condition.operator !== 'is_not_empty';

				return (
					<span key={condition.id}>
						<ConditionBadge>
							<FieldName>{fieldLabel}</FieldName>
							<Operator>{operatorLabel}</Operator>
							{needsValue && <Value>{condition.value}</Value>}
						</ConditionBadge>
						{index < validConditions.length - 1 && (
							<LogicConnector>{logic.logic}</LogicConnector>
						)}
					</span>
				);
			})}
		</LogicWrapper>
	);
};

export default memo(FormattedLogic);
