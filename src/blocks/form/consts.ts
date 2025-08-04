export type FormId = string;

export type Petition = {
    title: { raw: string };
    id: string;
};

export type Attributes = {
    formId: FormId;
    newPetitionLink?: string;
}

export type PetitionFormBlockAttributes = {
    formId: FormId;
    newPetitionLink?: string;
};

export type EditProps = {
    attributes: PetitionFormBlockAttributes;
    setAttributes: (attrs: Partial<PetitionFormBlockAttributes>) => void;
};