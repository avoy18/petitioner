export type SubmissionSettings = {
	form_id: number;
	per_page: number;
};

export type SubmissionItem = {
	id: number;
	fname?: string;
	lname?: string;
	country?: string;
	hide_name?: '0' | '1';
	submitted_at: string;
};

export type Submissions = SubmissionItem[];
