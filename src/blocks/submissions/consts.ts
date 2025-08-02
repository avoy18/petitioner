export type PetitionFormBlockAttributes = {
    formId: string;
    newPetitionLink?: string;
};

export type PetitionerSubmissionsProps = {
    attributes: PetitionFormBlockAttributes;
    setAttributes: (attrs: Partial<PetitionFormBlockAttributes>) => void;
};