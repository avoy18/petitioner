import { TokenItem } from '@wordpress/components/build-types/form-token-field/types';

export type FieldType = string | TokenItem;

export type StyleChoice = {
	label: string;
	value: string;
};

export type PetitionFormBlockAttributes = {
	formId: string;
	newPetitionLink?: string;
	perPage: number;
	/** Free ships `simple` and `table`; add-ons register more. */
	style: string;
	fields: FieldType[];
	showPagination: boolean;
	hidePageNumbers: boolean;
	availableFields: string[];
	availableStyles: StyleChoice[];
};

export type PetitionerSubmissionsProps = {
	attributes: PetitionFormBlockAttributes;
	setAttributes: (attrs: Partial<PetitionFormBlockAttributes>) => void;
	clientId: string;
};