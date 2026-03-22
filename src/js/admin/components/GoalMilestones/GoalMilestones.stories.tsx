import type { StoryMeta, Story } from '@admin/sections/ComponentPreviewArea/consts';
import GoalMilestones from './index';
import { useState } from '@wordpress/element';
import type { GoalMilestone } from '@admin/sections/EditFields/consts';

export default {
	title: 'Components/GoalMilestones',
	description:
		'Goal milestones editor that allows defining multiple goals activated at different signature counts',
} as StoryMeta;

function GoalMilestonesWrapper({
	initialMilestones,
}: {
	initialMilestones: GoalMilestone[];
}) {
	const [milestones, setMilestones] = useState(initialMilestones);
	return <GoalMilestones milestones={milestones} onChange={setMilestones} />;
}

export const SingleGoal: Story = () => (
	<GoalMilestonesWrapper
		initialMilestones={[{ value: 100, count_start: 0 }]}
	/>
);
SingleGoal.meta = {
	title: 'Single Goal',
	description: 'Default state with a single goal milestone, identical to legacy behavior',
};

export const MultipleMilestones: Story = () => (
	<GoalMilestonesWrapper
		initialMilestones={[
			{ value: 100, count_start: 0 },
			{ value: 500, count_start: 100 },
			{ value: 1000, count_start: 500 },
		]}
	/>
);
MultipleMilestones.meta = {
	title: 'Multiple Milestones',
	description: 'Three milestones that activate at increasing signature counts',
};

export const EmptyGoal: Story = () => (
	<GoalMilestonesWrapper
		initialMilestones={[{ value: 0, count_start: 0 }]}
	/>
);
EmptyGoal.meta = {
	title: 'Empty Goal',
	description: 'Default empty state for a new petition with no goal set',
};
