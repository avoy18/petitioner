import { SPACINGS } from '@admin/theme';
import styled from 'styled-components';

export const ExportButtonWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: space-between;
`;

export const SubmissionTabWrapper = styled.div``;

export const AlertStatusWrapper = styled.div`
	position: fixed;
	width: 80%;
	max-width: 768px;
	margin: auto;
	top: ${SPACINGS['4xl']};
	left: 0;
	right: 0;
`;

export const EntriesWrapper = styled.div`
	position: relative;
`;
