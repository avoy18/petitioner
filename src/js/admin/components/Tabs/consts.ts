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
