import { Notice } from '@wordpress/components';
import type { NoticeStatus } from '@admin/sections/EditFields/Submissions/consts';
import { AlertStatusWrapper } from './styled';

export * from './hooks';

export default function NoticeSystem({
	noticeStatus,
	noticeText,
	hideNotice,
}: {
	noticeStatus: NoticeStatus | undefined;
	noticeText: string | undefined;
	hideNotice: () => void;
}) {
	if (!noticeStatus || !noticeText) return null;

	return (
		<AlertStatusWrapper>
			<Notice
				isDismissible={true}
				onDismiss={hideNotice}
				status={noticeStatus}
			>
				{noticeText}
			</Notice>
		</AlertStatusWrapper>
	);
}
