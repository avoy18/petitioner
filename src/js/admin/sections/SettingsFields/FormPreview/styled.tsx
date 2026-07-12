import { SPACINGS, COLORS } from '@admin/theme';
import styled from 'styled-components';

export const PreviewCard = styled.div`
	border: 1px solid ${COLORS.grey};
	border-radius: var(--ptr-admin-wrapper-radius);
	background: #fff;
	overflow: hidden;
`;

export const PreviewHeader = styled.div`
	padding: ${SPACINGS.md} ${SPACINGS.lg};
	background: ${COLORS.light};
	border-bottom: 1px solid ${COLORS.grey};
	font-weight: 600;
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
`;

export const PreviewSelect = styled.select`
	max-width: 150px;
	font-size: 13px;
`;

export const PreviewIframe = styled.iframe`
	width: 100%;
	min-height: 800px;
	border: none;
	display: block;
`;

export const PreviewTitleWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 0;
	color: ${COLORS.dark};
`;
