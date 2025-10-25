import styled from 'styled-components';
import { SPACINGS } from '@admin/theme';
import { CardBody } from '@wordpress/components';

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