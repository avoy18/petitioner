export type PetitionFormBlockAttributes = {
    formId: string;
    newPetitionLink?: string;
    perPage: number;
    style: 'simple' | 'table';
    fields: string[];
    showPagination: boolean;
};

export type PetitionerSubmissionsProps = {
    attributes: PetitionFormBlockAttributes;
    setAttributes: (attrs: Partial<PetitionFormBlockAttributes>) => void;
};