export type ValueMapping = {
    id: string;
    rawValue: string;
    mappedValue: string;
};

export type MappingsProps = {
    mappings: ValueMapping[];
    onUpdate: (mappings: ValueMapping[]) => void;
};