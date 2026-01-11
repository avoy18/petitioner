import styled from 'styled-components';
import { COLORS, SPACINGS, TRANSITIONS } from '@admin/theme';

export const RowWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: ${SPACINGS.xs};
	border-bottom: 1px solid ${COLORS.grey};
	border-radius: ${SPACINGS.xs};
	transition: ${TRANSITIONS.sm};
	padding-inline: ${SPACINGS.xs};

	&:hover {
		background-color: ${COLORS.grey};
		cursor: grab;
	}
`;

export const ToggleControlWrapper = styled.div`
	flex-shrink: 0;
	margin-left: auto;
	display: flex;
	align-items: center;
	justify-content: flex-end;

	.components-toggle-control {
		margin-bottom: 0;
	}

	.components-toggle-control__label {
		display: none;
	}
`;
