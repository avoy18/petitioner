export type HeadingProps = {
	label: React.ReactNode;
	width?: string;
};

export type TableProps = {
	headings: HeadingProps[];
	rows: React.ReactNode[][];
	emptyMessage?: string;
	className?: string;
};