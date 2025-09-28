import styled from 'styled-components';

export const TableHeading = styled.th<{ $width?: string }>`
	${($width) => `width: ${$width}`};
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
