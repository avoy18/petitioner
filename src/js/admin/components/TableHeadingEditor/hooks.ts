import { useState } from "@wordpress/element";
import type { TableHeading } from "./consts";

export const useTableHeadingState = (headings: TableHeading[]) => {
    const [activeHeading, setActiveHeading] = useState<TableHeading['id'] | null>(null);
    const [deletedHeadings, setDeletedHeadings] = useState<Set<TableHeading['id']>>(new Set());
    const [modifiedHeadings, setModifiedHeadings] = useState<TableHeading[]>(headings);
    const currentHeading = modifiedHeadings.find((heading) => heading.id === activeHeading);

    const handleEditHeading = (id: TableHeading['id'] | null) => {
        setActiveHeading(id);
    };

    const handleDeleteHeading = (id: TableHeading['id']) => {
        setActiveHeading(null);
        setDeletedHeadings(prev => new Set(prev).add(id));
    };

    const handleRestoreHeading = (id: TableHeading['id']) => {
        setDeletedHeadings(prev => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
        });
    };

    const handleSaveHeading = (updatedHeading: TableHeading) => {
        setModifiedHeadings(prev => {
            const newHeadings = [...prev];
            const index = newHeadings.findIndex(heading => heading.id === updatedHeading.id);
            if (index !== -1) {
                newHeadings[index] = updatedHeading;
            }
            return newHeadings;
        });
        setActiveHeading(null);
    };

    const isDeleted = (id: TableHeading['id']) => {
        return deletedHeadings.has(id);
    };

    return {
        activeHeading,
        deletedHeadings,
        modifiedHeadings,
        currentHeading,
        handleEditHeading,
        handleDeleteHeading,
        handleRestoreHeading,
        handleSaveHeading,
        isDeleted
    };
};