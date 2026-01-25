export type TableHeading = {
    id: string;
    label: React.ReactNode;
};

export type TableHeadingEditorProps = {
    headings: TableHeading[];
};

export const DEFAULT_STORY_HEADINGS: TableHeading[] = [
    { id: 'id', label: 'Id' },
    { id: 'form_id', label: 'Form ID' },
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
    { id: 'accept_tos', label: (
        <> 
            <a href="#">By</a> submitting this form, I agree to the terms of service
        </>
    ) },
    { id: 'approval_status', label: 'Approval status' },
    { id: 'submission_date', label: 'Submission date' },
    { id: 'confirmation_token', label: 'Confirmation token' },
]