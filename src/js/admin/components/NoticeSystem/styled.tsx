import { SPACINGS } from '@admin/theme';
import styled from 'styled-components';

export const AlertStatusWrapper = styled.div`
	--notice-system-z-index: 1000;
	--notice-system-top: ${SPACINGS['4xl']};
	position: fixed;
	width: 80%;
	max-width: 768px;
	margin: auto;
	top: var(--notice-system-top);
	left: 0;
	right: 0;
	z-index: var(--notice-system-z-index);
`;
