export type Heading = {
    id: string;
    label: React.ReactNode;
};

export type TableHeadingEditorProps = {
    headings: Heading[];
};

export const DEFAULT_STORY_HEADINGS: Heading[] = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'address', label: 'Address' },
    { id: 'city', label: 'City' },
    { id: 'state', label: 'State' },
    { id: 'zip', label: 'Zip' },
    { id: 'country', label: 'Country' },
]