export type Heading = {
    id: string;
    label: React.ReactNode;
};

export type TableHeadingEditorProps = {
    headings: Heading[];
};

export const DEFAULT_STORY_HEADINGS: Heading[] = [
    { id: 'fname', label: 'First Name' },
    { id: 'lname', label: 'Last Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'street_address', label: 'Street Address' },
    { id: 'city', label: 'City' },
    { id: 'postal_code', label: 'Postal Code' },
    { id: 'country', label: 'Country' },
    { id: 'date_of_birth', label: 'Date of Birth' },
    { id: 'accept_tos', label: 'Accept TOS' },
    { id: 'legal', label: 'Legal' },
    { id: 'comments', label: 'Comments' },
]