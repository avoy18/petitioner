export type Tab = {
    name: string;
    title: React.ReactNode;
    className?: string;
    renderingEl: React.ReactNode;
};

export type TabPanelProps = {
    tabs: Tab[];
    onTabSelect?: (name: Tab['name'], tabKeys: Tab['name'][]) => void;
    defaultTab?: Tab['name'];
    updateURL?: boolean;
};

export const DEFAULT_STORY_TABS = [
    {
        name: 'tab1',
        title: 'Tab 1',
        renderingEl: <>Tab 1</>,
    },
    {
        name: 'tab2',
        title: 'Tab 2',
        renderingEl: <>Tab 2</>,
    },
];