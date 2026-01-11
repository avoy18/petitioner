import styled from 'styled-components';
import { COLORS, SPACINGS, TRANSITIONS } from '@admin/theme';
import { Panel } from '@wordpress/components';

export const RowWrapper = styled.div`
	display: flex;
	align-items: center;
	gap: ${SPACINGS.xs};
	border-bottom: 1px solid ${COLORS.grey};
	border-radius: ${SPACINGS.xs};

	&:hover {
		background-color: ${COLORS.light};
		cursor: grab;
	}
`;

export const DragHandleCell = styled.div`
	width: 32px;
	padding: ${SPACINGS.sm};

	.ptr-drag-handle {
		opacity: 0;
		transition: opacity ${TRANSITIONS.sm};
	}

	${RowWrapper}:hover & .ptr-drag-handle {
		opacity: 1;
	}
`;

export const StyledOptionsList = styled.div<{ $maxHeight: number }>`
	max-height: ${({ $maxHeight }) => $maxHeight}px;
	overflow-y: auto;
`;

export const OptionListLabel = styled.div`
	font-weight: bold;
`;

export const StyledPanel = styled(Panel)`
    border-radius: ${SPACINGS.sm};
    padding-bottom: ${SPACINGS.lg};
    background-color: ${COLORS.light};
`;