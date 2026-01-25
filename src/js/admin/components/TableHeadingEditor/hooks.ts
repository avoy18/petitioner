import { useState } from "@wordpress/element";
import type { TableHeading } from "./consts";

export const useTableHeadingState = (headings: TableHeading[]) => {
    const [activeHeading, setActiveHeading] = useState<TableHeading['id'] | null>(null);
    const [modifiedHeadings, setModifiedHeadings] = useState<TableHeading[]>(headings);
    const currentHeading = modifiedHeadings.find((heading) => heading.id === activeHeading);

    const handleEditHeading = (id: TableHeading['id'] | null) => {
        setActiveHeading(id);
    };

    const handleDeleteHeading = (id: TableHeading['id']) => {
        setActiveHeading(null);
        setModifiedHeadings(prev => {
            const newHeadings = [...prev];
            const index = newHeadings.findIndex(heading => heading.id === id);
            if (index !== -1) {
                newHeadings[index] = { ...newHeadings[index], overrides: { ...newHeadings[index].overrides, hidden: true } };
            }
            return newHeadings;
        });
    };

    const handleRestoreHeading = (id: TableHeading['id']) => {
        setModifiedHeadings(prev => {
            const newHeadings = [...prev];
            const index = newHeadings.findIndex(heading => heading.id === id);
            if (index !== -1) {
                newHeadings[index] = { ...newHeadings[index], overrides: { ...newHeadings[index].overrides, hidden: false } };
            }
            return newHeadings;
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

    return {
        activeHeading,
        modifiedHeadings,
        currentHeading,
        handleEditHeading,
        handleDeleteHeading,
        handleRestoreHeading,
        handleSaveHeading,
    };
};