import { memo } from '@wordpress/element';
import type { ConditionalLogicProps } from './consts';
import { ConditionalLogicWrapper } from './styled';
import GroupComponent from './GroupComponent';

export { useConditionalLogic } from './hooks';
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
	return (
		<ConditionalLogicWrapper>
			<GroupComponent
				group={value}
				availableFields={availableFields}
				onChange={onChange}
			/>
		</ConditionalLogicWrapper>
	);
};

export default memo(ConditionalLogic);
