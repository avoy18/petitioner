import { useEffect, useMemo, useState, useCallback, useRef } from "@wordpress/element";
import { getCSVExample, getExportURL } from "../utilities";
import { useNoticeSystem } from "@admin/components/NoticeSystem";
import { __ } from "@wordpress/i18n";
import { DEFAULT_EXPORT_LOGIC } from "../consts";
import { useConditionalLogic } from "@admin/components/ConditionalLogic";
import type { ConditionGroup } from "@admin/components/ConditionalLogic/consts";
import type { SubmissionItem } from "../consts";
import { useTableHeadingState } from "@admin/components/TableHeadingEditor";
import type { TableHeading } from "@admin/components/TableHeadingEditor/consts";

export const useExportModal = ({ submissionExample, total }: { submissionExample: SubmissionItem, total: number }) => {
    const [totalCount, setTotalCount] = useState(total);
    const [csvExample, setCSVExample] = useState<{ headings: string[]; rows: string[][]; } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { logic, setLogic, validCount } = useConditionalLogic({
        initialValue: DEFAULT_EXPORT_LOGIC,
    });
    const formID = submissionExample.form_id;

    const [initialHeadings, setInitialHeadings] = useState<TableHeading[]>([]);
    const headingState = useTableHeadingState(initialHeadings);
    const hasLoadedInitialHeadings = useRef(false);

    useEffect(() => {
        hasLoadedInitialHeadings.current = false;
        setInitialHeadings([]);
        headingState.handleEditHeading(null);
    }, [formID]);

    const csvColumnConfigString = useMemo(() => {
        // Avoid sending stale config while we are (re)loading defaults for a new form.
        if (initialHeadings.length === 0) {
            return undefined;
        }

        return headingState.modifiedHeadings.length > 0
            ? JSON.stringify(
                headingState.modifiedHeadings.map((h) => ({
                    id: h.id,
                    label: h.label,
                    overrides: h.overrides,
                }))
            )
            : undefined;
    }, [headingState.modifiedHeadings, initialHeadings.length]);

    const { showNotice, noticeStatus, noticeText, hideNotice } =
        useNoticeSystem({ timeoutDuration: 1500 });

    const handleLogicChange = useCallback((newValue: ConditionGroup) => {
        setLogic(newValue);
        showNotice('success', __('Filters applied successfully', 'petitioner'));
    }, []);

    useEffect(() => {
        setIsLoading(true);

        getCSVExample({
            formID,
            filters: logic,
            csv_column_config: csvColumnConfigString,
            onSuccess: (data) => {
                setCSVExample({
                    headings: data.headings,
                    rows: data.rows,
                });

                if (!hasLoadedInitialHeadings.current && data.columns) {
                    hasLoadedInitialHeadings.current = true;
                    setInitialHeadings(data.columns);
                }

                setTotalCount(data.total_count);
                setIsLoading(false);
            },
            onError: () => {
                showNotice('error', __('Error getting CSV example', 'petitioner'));
                setIsLoading(false);
            },
        });
    }, [logic, formID, showNotice, csvColumnConfigString]);

    const exportURL = useMemo(() => getExportURL(), []);

    return {
        totalCount,
        csvExample,
        isLoading,
        exportURL,
        logic,
        validCount,
        handleLogicChange,
        showNotice,
        noticeStatus,
        noticeText,
        hideNotice,
        headingState,
        csvColumnConfigString,
    };
};