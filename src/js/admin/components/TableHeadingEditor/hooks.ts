import { useState } from "@wordpress/element";
import type { TableHeading } from "./consts";

/**
 * Custom hook for managing the table heading editor state.
 * @example
 * const headingState = useTableHeadingState([
 *     { id: 'id', label: 'ID' },
 *     { id: 'name', label: 'Name' },
 *     { id: 'email', label: 'Email' },
 * ]);
 * 
 * return (
 *     <TableHeadingEditor headingState={headingState} />
 * );
 * 
 * @param headings - The INITIAL headings to manage, does not get synced if you modify it.
 * @returns {Object} TableHeadingEditorState
 * @returns {TableHeading['id'] | null} activeHeading - The active heading
 * @returns {TableHeading[]} modifiedHeadings - The modified headings
 * @returns {boolean} showHiddenHeadings - Whether to show hidden headings
 * @returns {Function} handleEditHeading - Handle the edit heading
 * @returns {Function} handleDeleteHeading - Handle the delete heading
 * @returns {Function} handleRestoreHeading - Handle the restore heading
 * @returns {Function} handleSaveHeading - Handle the save heading
 * @returns {Function} handleShowHiddenHeadings - Handle the show hidden headings
 */
export const useTableHeadingState = (headings: TableHeading[]) => {
    const [activeHeading, setActiveHeading] = useState<TableHeading['id'] | null>(null);
    const [modifiedHeadings, setModifiedHeadings] = useState<TableHeading[]>(headings);
    const [showHiddenHeadings, setShowHiddenHeadings] = useState(true);

    const currentHeading = modifiedHeadings.find((heading) => heading.id === activeHeading);

    const handleEditHeading = (id: TableHeading['id'] | null) => {
        setActiveHeading(id);
    };

    const handleDeleteHeading = (id: TableHeading['id']) => {
        if (!showHiddenHeadings && activeHeading === id) {
            setActiveHeading(null);
        }

        setModifiedHeadings(prev => {
            const newHeadings = [...prev];
            const index = newHeadings.findIndex(heading => heading.id === id);
            if (index !== -1) {
                newHeadings[index] = {
                    ...newHeadings[index], overrides: {
                        ...(newHeadings[index].overrides || {}),
                        hidden: true
                    }
                };
            }
            return newHeadings;
        });
    };

    const handleRestoreHeading = (id: TableHeading['id']) => {
        setModifiedHeadings(prev => {
            const newHeadings = [...prev];
            const index = newHeadings.findIndex(heading => heading.id === id);
            if (index !== -1) {
                newHeadings[index] = {
                    ...newHeadings[index],
                    overrides: {
                        ...(newHeadings[index].overrides || {}),
                        hidden: false
                    }
                };
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

    const handleShowHiddenHeadings = () => {
        if (activeHeading && currentHeading?.overrides?.hidden) {
            setActiveHeading(null);
        }
        setShowHiddenHeadings((prev) => !prev);
    };

    return {
        activeHeading,
        modifiedHeadings,
        currentHeading,
        handleEditHeading,
        handleDeleteHeading,
        handleRestoreHeading,
        handleSaveHeading,
        showHiddenHeadings,
        handleShowHiddenHeadings,
    };
};