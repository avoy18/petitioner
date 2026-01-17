import styled from 'styled-components';
import { FONT_SIZES, SPACINGS, TRANSITIONS } from '@admin/theme';

export const Row = styled.tr<{ $isDragging?: boolean }>`
	opacity: ${({ $isDragging }) => ($isDragging ? 0.5 : 1)};

	&:hover .ptr-drag-handle {
		opacity: 1;
	}
`;

export const DragCell = styled.td`
	width: 32px;
	padding: ${SPACINGS.sm};

	.ptr-drag-handle {
		opacity: 0;
		transition: opacity ${TRANSITIONS.sm};
	}
`;

export const ValueCell = styled.td`
	padding: ${SPACINGS.xs};
	font-size: ${FONT_SIZES.sm};
`;
