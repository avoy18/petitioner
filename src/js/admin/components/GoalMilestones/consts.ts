import type { GoalMilestone } from '@admin/sections/EditFields/consts';

export interface GoalMilestonesProps {
	milestones: GoalMilestone[];
	onChange: (milestones: GoalMilestone[]) => void;
}
