import type { ApprovalState, FormID } from '@admin/sections/EditFields/consts';

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
