import { memo } from '@wordpress/element';
import { SelectControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { Condition } from '../consts';
import { LOGIC_OPTIONS, type GroupComponentProps } from '../consts';
import { generateId } from '../utilities';
import { GroupWrapper, GroupHeader, ActionButtons } from '../styled';
import ConditionComponent from '../ConditionComponent';

const GroupComponent = ({
	group,
	availableFields,
	onChange,
}: GroupComponentProps) => {
	const updateCondition = (index: number, condition: Condition) => {
		const newConditions = [...group.conditions];
		newConditions[index] = condition;
		onChange({ ...group, conditions: newConditions });
	};

	const removeCondition = (index: number) => {
		const newConditions = group.conditions.filter((_, i) => i !== index);
		if (newConditions.length === 0) {
			// If removing the last condition, keep at least one empty condition
			onChange({
				...group,
				conditions: [
					{
						id: generateId(),
						field: '',
						operator: 'equals',
						value: '',
					},
				],
			});
		} else {
			onChange({ ...group, conditions: newConditions });
		}
	};

	const addCondition = () => {
		onChange({
			...group,
			conditions: [
				...group.conditions,
				{
					id: generateId(),
					field: '',
					operator: 'equals',
					value: '',
				},
			],
		});
	};

	const showRemoveCondition = group.conditions.length > 1;

	return (
		<GroupWrapper>
			<GroupHeader>
				<span>{__('Relation:', 'petitioner')}</span>
				<SelectControl
					value={group.logic}
					onChange={(logic) =>
						onChange({ ...group, logic: logic as 'AND' | 'OR' })
					}
					options={LOGIC_OPTIONS}
				/>
				<span>
					{group.logic === 'AND'
						? __('(all conditions must be true to match)', 'petitioner')
						: __('(any condition can be true to match)', 'petitioner')}
				</span>
			</GroupHeader>

			{group.conditions.map((condition, index) => (
				<ConditionComponent
					key={condition.id}
					condition={condition}
					availableFields={availableFields}
					onChange={(updatedCondition) =>
						updateCondition(index, updatedCondition)
					}
					onRemove={() => removeCondition(index)}
					showRemove={showRemoveCondition}
				/>
			))}

			<ActionButtons>
				<Button
					icon="plus"
					variant="secondary"
					size="small"
					onClick={addCondition}
				>
					{__('Add Condition', 'petitioner')}
				</Button>
			</ActionButtons>
		</GroupWrapper>
	);
};

export default memo(GroupComponent);
