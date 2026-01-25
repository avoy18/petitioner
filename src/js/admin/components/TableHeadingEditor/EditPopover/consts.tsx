import type { TableHeading } from '../consts';

export interface EditPopoverProps {
    heading: TableHeading;
    onClose: () => void;
    onSave: (updatedHeading: TableHeading) => void;
}