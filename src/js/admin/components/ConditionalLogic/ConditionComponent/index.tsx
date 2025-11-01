import { memo } from '@wordpress/element';
import { SelectControl, TextControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { ConditionComponentProps } from '../consts';
import { OPERATORS } from '../consts';
import { ConditionRow } from '../styled';

const ConditionComponent = memo(
	({
		condition,
		availableFields,
		onChange,
		onRemove,
		showRemove,
	}: ConditionComponentProps) => {
		const showValueInput =
			condition.operator !== 'is_empty' &&
			condition.operator !== 'is_not_empty';

		return (
			<ConditionRow>
				<SelectControl
					value={condition.field}
					onChange={(field) => onChange({ ...condition, field })}
					options={[
						{
							value: '',
							label: __('Select field...', 'petitioner'),
						},
						...availableFields,
					]}
				/>
				<SelectControl
					value={condition.operator}
					onChange={(operator) =>
						onChange({ ...condition, operator })
					}
					options={OPERATORS}
				/>
				{showValueInput && (
					<TextControl
						value={condition.value}
						onChange={(value) => onChange({ ...condition, value })}
						placeholder={__('Enter value...', 'petitioner')}
					/>
				)}
				{showRemove && (
					<Button
						icon="trash"
						isDestructive
						variant="secondary"
						size="small"
						onClick={onRemove}
						label={__('Remove condition', 'petitioner')}
					/>
				)}
			</ConditionRow>
		);
	}
);

export default ConditionComponent;
