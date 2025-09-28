import styled from 'styled-components';

export const TableHeading = styled.th<{ $width?: string }>`
	${($width) => `width: ${$width}`}
`;
