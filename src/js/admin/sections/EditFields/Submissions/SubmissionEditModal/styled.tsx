import styled from 'styled-components';
import { SPACINGS, COLORS } from '@admin/theme';
import { CardBody, Button } from '@wordpress/components';
import { Text } from '@admin/components/Experimental'

export const ActionButtons = styled.div`
	display: flex;
	margin-bottom: ${SPACINGS.sm};
`;

export const FieldItem = styled(CardBody)`
	display: flex;
	align-items: flex-start;
	flex-direction: column;
	gap: ${SPACINGS.xs};
`;

export const InputGroup = styled.div`
	display: flex;
	align-items: center;
	gap: ${SPACINGS.sm};

	.components-base-control__field {
		margin-bottom: 0px;
	}
`;

export const ActionButtonWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: ${SPACINGS.sm};
`;

export const StyledFeaturedButtonWrapper = styled.div`
	--feat-button-padding-x: ${SPACINGS.xs};
	margin-bottom: ${SPACINGS.lg};
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: ${SPACINGS.sm};
`;

export const StyledFeatureButton = styled(Button)`
	padding-left: var(--feat-button-padding-x) !important;
	padding-right: var(--feat-button-padding-x) !important;
`;

export const HelpText = styled(Text)`
	padding-inline: var(--feat-button-padding-x);
`;