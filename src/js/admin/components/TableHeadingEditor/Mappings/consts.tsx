import { __ } from "@wordpress/i18n";

export type ValueMapping = {
    id: string;
    rawValue: string;
    mappedValue: string;
};

export type MappingsProps = {
    mappings: ValueMapping[];
    onUpdate: (mappings: ValueMapping[]) => void;
};

export const MAPPING_DESCRIPTION = __('Replace raw values with readable text. For example, convert "0" -> "No" or "1" -> "Yes". Pro tip: You can reference other fields in the form using {{field_id}}.', 'petitioner');