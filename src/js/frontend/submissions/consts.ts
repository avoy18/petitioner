export type SubmissionsStyle = 'simple' | 'table';

export type SubmissionSettings = {
	form_id: number;
	per_page: number;
	style: SubmissionsStyle;
	fields: string;
	show_pagination: boolean;
};

export type SubmissionItem = {
	[key: string]: string | number | boolean;
};

export type Submissions = SubmissionItem[];

export type SubmissionRendererOptions = {
	wrapper: HTMLElement;
	submissions: Submissions; // initial submissions
	perPage?: number;
	total?: number;
	currentPage: number; // initial page
	labels: { [key: string]: string } | {};
	fields: string[];
	pagination: boolean;
	onPageChange: (page: number) => Promise<Submissions>;
};
