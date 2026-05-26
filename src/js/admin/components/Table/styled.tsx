import styled, { css } from 'styled-components';
import { COLORS, TRANSITIONS } from '@admin/theme';

export const TableHeading = styled.th<{ $width?: string }>`
	${({ $width }) => `width: ${$width};`}
	cursor: pointer;
	&,
	&.sorted {
		padding-inline: var(--ptr-admin-spacing-sm) !important;
	}
`;

export const HeadingLabel = styled.div`
	display: inline-flex;
	gap: var(--ptr-admin-spacing-xs);
`;

export const StyledTable = styled.table<{ $clickable: boolean }>`
	&.striped > tbody > {
		&:nth-child(odd) {
			background-color: ${COLORS.light};
		}

		tr.is-featured td {
			background-color: #f3f8fc !important;
		}
		tr.is-featured:nth-child(odd) td {
			background-color: #e6f0f9 !important;
		}

		${({ $clickable }) =>
			$clickable &&
			css`
				tr {
					transition: ${TRANSITIONS.sm};
					&:hover {
						cursor: pointer;
						background: ${COLORS.grey} !important;
					}
				}
				tr.is-featured:hover td {
					cursor: pointer;
					background-color: #dbeaf5 !important;
				}
			`}
	}
`;
