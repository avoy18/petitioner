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

export const MAPPING_DESCRIPTION = __('Transform column values for your export. Translate exact matches (e.g. "0" -> "No"), provide fallbacks for missing data (leave raw value empty -> "N/A"), or stitch fields together by using the field placeholder as the raw value (e.g. Raw: "{{fname}}" -> Mapped: "{{fname}} {{lname}}").', 'petitioner');