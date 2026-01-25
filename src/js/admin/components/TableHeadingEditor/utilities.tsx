import type { TableHeading } from './consts';

export const getHeadingLabel = (heading: TableHeading) => {
    return heading.overrides?.label || heading.label;
};