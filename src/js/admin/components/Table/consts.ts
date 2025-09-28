export type HeadingProps = {
	id: string;
	label: React.ReactNode;
	width?: string;
};

export type SortDirection = 'asc' | 'desc' | null;

export type OnSortArgs = {
	order?: SortDirection | null;
	orderby?: HeadingProps['id'] | null;
};

export type TableProps = {
	headings: HeadingProps[];
	rows: React.ReactNode[][];
	emptyMessage?: string;
	className?: string;
	onSort?: (args: OnSortArgs) => void;
};
