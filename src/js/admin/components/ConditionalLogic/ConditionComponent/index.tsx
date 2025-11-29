import { memo } from '@wordpress/element';
import { SelectControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { ConditionComponentProps } from '../consts';
import { OPERATORS } from '../consts';
import { ConditionRow } from '../styled';
import EditField from '@admin/components/EditField';

const ConditionComponent = memo(
	({
		condition,
		availableFields,
		onChange,
		onRemove,
	}: ConditionComponentProps) => {
		const showValueInput =
			condition.operator !== 'is_empty' &&
			condition.operator !== 'is_not_empty';

		const currentFieldData = availableFields?.find(
			(field) => field.value === condition.field
		);

		// Prepare options for select fields
		const fieldOptions = currentFieldData?.options
			? [
					{ label: __('Select value...', 'petitioner'), value: '' },
					...currentFieldData.options,
				]
			: [];

		return (
			<ConditionRow>
				<SelectControl
					value={condition.field}
					onChange={(field) => {
						onChange({ ...condition, field, value: '' });
					}}
					options={[
						{
							value: '',
							label: __('Select field...', 'petitioner'),
						},
						...(availableFields || []),
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
				<EditField
					type={currentFieldData?.inputType}
					value={condition.value}
					onChange={(value) => onChange({ ...condition, value })}
					options={fieldOptions}
					placeholder={__('Enter value...', 'petitioner')}
					fieldKey={condition.field}
				/>
			)}
				<Button
					icon="trash"
					isDestructive
					variant="secondary"
					size="small"
					onClick={onRemove}
					label={__('Remove condition', 'petitioner')}
				/>
			</ConditionRow>
		);
	}
);

export default ConditionComponent;
