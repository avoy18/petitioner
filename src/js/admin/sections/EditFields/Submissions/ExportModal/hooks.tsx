import { useEffect, useMemo, useState, useCallback } from "@wordpress/element";
import { getCSVExample, getExportURL } from "../utilities";
import { useNoticeSystem } from "@admin/components/NoticeSystem";
import { __ } from "@wordpress/i18n";
import { DEFAULT_EXPORT_LOGIC } from "../consts";
import { useConditionalLogic } from "@admin/components/ConditionalLogic";
import type { ConditionGroup } from "@admin/components/ConditionalLogic/consts";
import type { SubmissionItem } from "../consts";

export const useExportModal = ({ submissionExample, total }: { submissionExample: SubmissionItem, total: number }) => {
    const [totalCount, setTotalCount] = useState(total);
    const [csvExample, setCSVExample] = useState<{ headings: string[]; rows: string[][]; } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { logic, setLogic, validCount } = useConditionalLogic({
        initialValue: DEFAULT_EXPORT_LOGIC,
    });
    const formID = submissionExample.form_id;

    const handleLogicChange = useCallback((newValue: ConditionGroup) => {
        setLogic(newValue);
        showNotice('success', __('Filters applied successfully', 'petitioner'));
    }, []);

    useEffect(() => {
        getCSVExample({
            formID,
            filters: logic,
            onSuccess: (data) => {
                setCSVExample({
                    headings: data.headings,
                    rows: data.rows,
                });

                setTotalCount(data.total_count);
                setIsLoading(false);
            },
            onError: () => {
                showNotice('error', __('Error getting CSV example', 'petitioner'));
                setIsLoading(false);
            },
        });
    }, [logic]);

    const exportURL = useMemo(() => getExportURL(), []);

    const { showNotice, noticeStatus, noticeText, hideNotice } =
        useNoticeSystem({ timeoutDuration: 1500 });

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
    };
};