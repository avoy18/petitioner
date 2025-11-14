import { Notice } from '@wordpress/components';
import type { NoticeStatus } from '@admin/sections/EditFields/Submissions/consts';
import { AlertStatusWrapper } from './styled';

export * from './hooks';

export default function NoticeSystem({
	noticeStatus,
	noticeText,
	hideNotice,
	className,
}: {
	noticeStatus: NoticeStatus | undefined;
	noticeText: string | undefined;
	hideNotice: () => void;
	className?: string;
}) {
	if (!noticeStatus || !noticeText) return null;

	return (
		<AlertStatusWrapper className={className}>
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
