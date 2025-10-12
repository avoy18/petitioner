import type { ApprovalState, FormID } from '@admin/sections/EditFields/consts';
import { __ } from '@wordpress/i18n';
import { getFieldLabels } from './utilities';

export type SubmissionID = string | number;
export type SubmissionStatus = 'Confirmed' | 'Declined';

export type SubmissionItem = {
	id: SubmissionID;
	form_id: FormID;
	fname?: string;
	lname?: string;
	email: string;
	country?: string;
	salutation?: string | null;
	bcc_yourself?: '0' | '1';
	newsletter?: '0' | '1';
	hide_name?: '0' | '1';
	accept_tos?: '0' | '1';
	submitted_at: string;
	approval_status: SubmissionStatus;
	confirmation_token?: string;
};

export type ChangeAction = 'Confirm' | 'Decline';

export type ApprovalStatusProps = {
	item: SubmissionItem;
	onStatusChange?: (
		id: string | number,
		newStatus: SubmissionStatus,
		action: ChangeAction
	) => void;
	defaultApprovalState?: ApprovalState;
};

export type Submissions = SubmissionItem[];

export type Order = 'desc' | 'asc';
export type OrderBy = keyof SubmissionItem;

export type FetchSettings = {
	currentPage?: number;
	formID: FormID;
	perPage?: number;
	order?: Order | null;
	orderby?: OrderBy | null;
	onSuccess: (fetchData: { total: number; submissions: Submissions }) => void;
};

export type UpdateSettings = {
	data: Partial<SubmissionItem>;
	onSuccess: (fetchData: { total: number }) => void;
	onError: (msg: string) => void;
};

export const UPDATE_ACTION = 'petitioner_update_submission';
export const FETCH_ACTION = 'petitioner_fetch_submissions';