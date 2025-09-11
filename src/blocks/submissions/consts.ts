import { TokenItem } from '@wordpress/components/build-types/form-token-field/types';

export type FieldType = string | TokenItem;

export type PetitionFormBlockAttributes = {
	formId: string;
	newPetitionLink?: string;
	perPage: number;
	style: 'simple' | 'table';
	fields: FieldType[];
	showPagination: boolean;
	availableFields: string[];
	availableStyles: string[];
};

export type PetitionerSubmissionsProps = {
	attributes: PetitionFormBlockAttributes;
	setAttributes: (attrs: Partial<PetitionFormBlockAttributes>) => void;
};