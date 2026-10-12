export type SubmissionSettings = {
	form_id: number;
	per_page: number;
	style: string;
	fields: string;
	show_pagination: boolean;
	hide_page_numbers: boolean;
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
	labels?: Record<string, string>;
	fields: string[];
	pagination: boolean;
	hidePageNumbers: boolean;
	onPageChange: (page: number) => Promise<Submissions>;
};

export interface SubmissionRendererInstance {
	render(): void;
	destroy?(): void;
}

export type SubmissionRendererConstructor = new (
	options: SubmissionRendererOptions
) => SubmissionRendererInstance;