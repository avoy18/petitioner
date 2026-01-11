import styled from 'styled-components';
import { COLORS, FONT_SIZES, SPACINGS, TRANSITIONS } from '@admin/theme';

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

export const ToggleCell = styled.td`
	width: 48px;
	padding: ${SPACINGS.sm};

	.components-toggle-control {
		margin-bottom: 0;
	}

	.components-toggle-control__label {
		display: none;
	}
`;

export const ValueCell = styled.td`
	padding: ${SPACINGS.xs};
	font-size: ${FONT_SIZES.sm};
`;
