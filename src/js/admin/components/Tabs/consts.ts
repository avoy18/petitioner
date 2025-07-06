export type Tab = {
	name: string;
	title: React.ReactNode;
	className?: string;
	renderingEl: React.ReactNode;
};

export type TabPanelProps = {
	tabs: Tab[];
	onTabSelect?: (name: string) => void;
};
