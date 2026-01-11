import styled from 'styled-components';
import { COLORS, SPACINGS } from '@admin/theme';
import { Panel } from '@wordpress/components';

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
