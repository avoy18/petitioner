import { useEffect, useCallback, useState } from '@wordpress/element';
import type { NoticeStatus } from '@admin/sections/EditFields/Submissions/consts';

/**
 * Custom hook for managing notice/alert notifications with auto-dismiss functionality.
 *
 * @returns {Object} Notice system controls
 * @returns {Function} returns.showNotice - Display a notice with specified status and text
 * @returns {Function} returns.hideNotice - Manually dismiss the current notice
 * @returns {Function} returns.NoticeElement - React component to render the notice UI
 *
 * @example
 * const { showNotice, NoticeElement } = useNoticeSystem();
 *
 * // Show success notification
 * showNotice('success', 'Data saved successfully!');
 *
 * // Show error notification
 * showNotice('error', 'Failed to save data');
 *
 * // Render in component
 * return (
 *   <div>
 *     <NoticeElement />
 *   </div>
 * );
 */
export const useNoticeSystem = ({ timeoutDuration = 3000 }: { timeoutDuration?: number } = {}) => {
	const [noticeStatus, setNoticeStatus] = useState<NoticeStatus>(undefined);
	const [noticeText, setNoticeText] = useState<string | undefined>(undefined);

	const showNotice = useCallback((status: NoticeStatus, text: string) => {
		setNoticeStatus(status);
		setNoticeText(text);
	}, []);

	const hideNotice = useCallback(() => {
		setNoticeStatus(undefined);
		setNoticeText(undefined);
	}, []);

	useEffect(() => {
		if (noticeText) {
			const timeout = setTimeout(hideNotice, timeoutDuration);
			return () => clearTimeout(timeout);
		}
	}, [noticeText, hideNotice]);

	return {
		showNotice,
		hideNotice,
		noticeStatus,
		noticeText,
	};
};
