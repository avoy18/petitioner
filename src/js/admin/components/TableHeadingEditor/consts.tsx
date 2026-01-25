import { __ } from '@wordpress/i18n';
import type { ValueMapping } from './Mappings/consts';

export type OverrideOptions = {
    label?: string;
    mappings?: ValueMapping[]; 
    hidden?: boolean;
}

export type TableHeading = {
    id: string;
    label: string;
    overrides?: OverrideOptions;
};

export type TableHeadingEditorState = {
    activeHeading: TableHeading['id'] | null;
    modifiedHeadings: TableHeading[];
    currentHeading: TableHeading | undefined;
    handleEditHeading: (id: TableHeading['id'] | null) => void;
    handleDeleteHeading: (id: TableHeading['id']) => void;
    handleRestoreHeading: (id: TableHeading['id']) => void;
    handleSaveHeading: (updatedHeading: TableHeading) => void;
    showHiddenHeadings: boolean;
    handleShowHiddenHeadings: () => void;
};

export type TableHeadingEditorProps = {
    headingState: TableHeadingEditorState;
};

export const DEFAULT_STORY_HEADINGS: TableHeading[] = [
    { id: 'id', label: 'Id', overrides: { hidden: true } },
    { id: 'form_id', label: 'Form ID', overrides: { hidden: true } },
    { id: 'fname', label: 'First name' },
    { id: 'lname', label: 'Last name' },
    { id: 'email', label: 'Your email' },
    { id: 'date_of_birth', label: 'Date of birth' },
    { id: 'country', label: 'Country' },
    { id: 'salutation', label: 'Salutation' },
    { id: 'phone', label: 'Phone' },
    { id: 'street_address', label: 'Street address' },
    { id: 'city', label: 'City' },
    { id: 'postal_code', label: 'Postal code' },
    { id: 'comments', label: 'Comments!!' },
    { id: 'bcc', label: 'BCC yourself' },
    { id: 'subscribe_newsletter', label: 'Subscribe to newsletter' },
    { id: 'keep_name_anonymous', label: 'Keep my name anonymous' },
    { id: 'accept_tos', label: "<a href=\"#\">By</a> submitting this form, I agree to the terms of service"},
    { id: 'approval_status', label: 'Approval status' },
    { id: 'submission_date', label: 'Submission date' },
    { id: 'confirmation_token', label: 'Confirmation token' },
]

export const HIDE_HIDDEN_COLUMNS_LABEL = __('Hide hidden columns', 'petitioner');
export const SHOW_HIDDEN_COLUMNS_LABEL = __('Show hidden columns', 'petitioner');