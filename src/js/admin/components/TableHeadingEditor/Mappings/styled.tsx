import { COLORS, SPACINGS } from '@admin/theme';
import { Icon, Button } from '@wordpress/components';
import styled from 'styled-components';

export const MappingWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${SPACINGS.md};
	padding: ${SPACINGS.md};
	background: ${COLORS.light};
	border-radius: 4px;
	border: 1px solid ${COLORS.grey};
`;

export const MappingExample = styled.div`
	margin-top: ${SPACINGS.xs};
	padding: ${SPACINGS.sm};
	background: white;
	border-left: 3px solid ${COLORS.dark};
	border-radius: 2px;
`;

export const MappingInputGroup = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${SPACINGS.sm};
`;

export const MappingInputs = styled.div`
	display: flex;
	flex-direction: row;
	gap: ${SPACINGS.sm};
    align-items: center;
`;

export const MappingArrow = styled(Icon).attrs({ icon: 'arrow-right-alt' })`
	display: flex;
	flex-direction: row;
	gap: ${SPACINGS.sm};
	align-items: center;
    transform: translateY(10px)
`;

export const StyledButton = styled(Button)`
	transform: translateY(10px)
`;