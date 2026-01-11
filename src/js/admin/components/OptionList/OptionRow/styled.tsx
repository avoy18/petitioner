import styled from 'styled-components';
import { COLORS, SPACINGS, TRANSITIONS } from '@admin/theme';

export const RowWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: ${SPACINGS.xs};
	border-bottom: 1px solid ${COLORS.grey};
	border-radius: ${SPACINGS.xs};
	transition: ${TRANSITIONS.sm};

	&:hover {
		background-color: ${COLORS.grey};
		cursor: grab;
	}
`;
