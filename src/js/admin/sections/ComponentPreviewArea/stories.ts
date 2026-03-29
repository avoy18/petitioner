import type { ComponentStories } from './consts';

import * as TableHeadingEditorStories from '@admin/components/TableHeadingEditor/TableHeadingEditor.stories';
import * as TabsStories from '@admin/components/Tabs/Tabs.stories';
import * as GoalMilestonesStories from '@admin/components/GoalMilestones/GoalMilestones.stories';

export const storyRegistry: Record<string, ComponentStories> = {
	'table-heading-editor': TableHeadingEditorStories,
	'tabs': TabsStories,
	'goal-milestones': GoalMilestonesStories,
};

export function getComponentList() {
	return Object.keys(storyRegistry).map((id) => {
		const stories = storyRegistry[id];
		return {
			id,
			title: stories.default.title,
			description: stories.default.description,
		};
	});
}

export function getComponentStories(componentId: string) {
	const stories = storyRegistry[componentId];
	if (!stories) return null;

	const storyEntries = Object.entries(stories)
		.filter(([key]) => key !== 'default')
		.map(([key, story]) => ({
			id: key,
			title: (story as any).meta?.title || key,
			description: (story as any).meta?.description,
			component: story as () => JSX.Element,
		}));

	return {
		meta: stories.default,
		stories: storyEntries,
	};
}