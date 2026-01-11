import styled from 'styled-components';
import { COLORS, FONT_SIZES, SPACINGS, TRANSITIONS } from '@admin/theme';

export const OptionsTable = styled.table`
	width: 100%;
	border-collapse: collapse;
	margin-top: ${SPACINGS.md};

	th {
		padding: ${SPACINGS.sm} ${SPACINGS.md};
		text-align: left;
		font-weight: 600;
		text-transform: uppercase;
		font-size: 11px;
		color: ${COLORS.darkGrey};
		background-color: ${COLORS.light};
		border-bottom: 1px solid ${COLORS.grey};
	}
`;

export const TableBody = styled.tbody`
	tr {
		border-bottom: 1px solid ${COLORS.grey};
		transition: background-color ${TRANSITIONS.sm};

		&:hover {
			background-color: ${COLORS.light};
		}
	}
`;

export const StyledTh = styled.th<{ $width?: string }>`
	padding: ${SPACINGS.xs};
	font-size: ${FONT_SIZES.sm};
	width: ${({ $width }) => $width || 'auto'};
`;
