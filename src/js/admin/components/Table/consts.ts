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

export type TableRow = {
	cells: React.ReactNode[];
	id: string | number;
	isFeatured?: boolean;
};

export type TableProps = {
	headings: HeadingProps[];
	rows: TableRow[];
	emptyMessage?: string;
	className?: string;
	clickable?: boolean;
	sortable?: boolean;
	onSort?: (args: OnSortArgs) => void;
	onItemSelect?: (id: TableRow['id']) => void;
};
