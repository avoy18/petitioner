import type { StoryMeta, Story } from '@admin/sections/ComponentPreviewArea/consts';
import Tabs from './index';

export default {
    title: 'Components/Tabs',
    description: 'Tabbed navigation component with URL updating support',
} as StoryMeta;

export const BasicTabs: Story = () => (
    <Tabs
        tabs={[
            {
                name: 'general',
                title: 'General',
                renderingEl: <div>General content here</div>,
            },
            {
                name: 'advanced',
                title: 'Advanced',
                renderingEl: <div>Advanced content here</div>,
            },
        ]}
    />
);
BasicTabs.meta = {
    title: 'Basic Tabs',
    description: 'Two simple tabs with basic content',
};

export const WithDefaultTab: Story = () => (
    <Tabs
        tabs={[
            {
                name: 'general',
                title: 'General',
                renderingEl: <div>General content</div>,
            },
            {
                name: 'advanced',
                title: 'Advanced',
                renderingEl: <div>Advanced content (default)</div>,
            },
        ]}
        defaultTab="advanced"
    />
);
WithDefaultTab.meta = {
    title: 'With Default Tab',
    description: 'Tabs with the second tab active by default',
};

export const ManyTabs: Story = () => (
    <Tabs
        tabs={[
            { name: 'tab1', title: 'Tab 1', renderingEl: <div>Content 1</div> },
            { name: 'tab2', title: 'Tab 2', renderingEl: <div>Content 2</div> },
            { name: 'tab3', title: 'Tab 3', renderingEl: <div>Content 3</div> },
            { name: 'tab4', title: 'Tab 4', renderingEl: <div>Content 4</div> },
            { name: 'tab5', title: 'Tab 5', renderingEl: <div>Content 5</div> },
        ]}
    />
);
ManyTabs.meta = {
    title: 'Many Tabs',
    description: 'Component with multiple tabs to test overflow behavior',
};