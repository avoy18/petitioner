import { memo, useState, useEffect } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { ConditionalLogicProps, ConditionGroup } from './consts';
import GroupComponent from './GroupComponent';
import { ConditionalLogicWrapper } from './styled';

export { useConditionalLogic } from './hooks';
export { default as FormattedLogic } from './FormattedLogic';

export type {
	Condition,
	ConditionGroup,
	ConditionalLogicProps,
} from './consts';

const ConditionalLogic = ({
	value,
	onChange,
	availableFields,
}: ConditionalLogicProps) => {
	const [localValue, setLocalValue] = useState<ConditionGroup>(value);
	const [hasChanges, setHasChanges] = useState(false);

	// Update local value when parent value changes
	useEffect(() => {
		setLocalValue(value);
		setHasChanges(false);
	}, [value]);

	const handleLocalChange = (newValue: ConditionGroup) => {
		setLocalValue(newValue);
		setHasChanges(true);
	};

	const handleApply = () => {
		onChange(localValue);
		setHasChanges(false);
	};

	return (
		<ConditionalLogicWrapper>
			<GroupComponent
				group={localValue}
				availableFields={availableFields}
				onChange={handleLocalChange}
			/>
			{hasChanges && (
				<Button variant="primary" onClick={handleApply}>
					{__('Apply filters', 'petitioner')}
				</Button>
			)}
		</ConditionalLogicWrapper>
	);
};

export default memo(ConditionalLogic);
