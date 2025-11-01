import styled from 'styled-components';
import { SPACINGS } from '@admin/theme';

export const ConditionalLogicWrapper = styled.div`
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	padding: ${SPACINGS.md};
	background: #fff;
`;

export const GroupWrapper = styled.div`
	border: 2px dashed rgba(0, 0, 0, 0.2);
	border-radius: 4px;
	padding: ${SPACINGS.md};
	margin-bottom: ${SPACINGS.md};
	background: rgba(0, 0, 0, 0.02);
`;

export const GroupHeader = styled.div`
	display: flex;
	align-items: center;
	gap: ${SPACINGS.sm};
	margin-bottom: ${SPACINGS.md};

	span {
		font-weight: 500;
		color: rgba(0, 0, 0, 0.7);
	}

	.components-base-control {
		margin-bottom: 0;
		width: auto;
		min-width: 100px;
	}

	.components-base-control__field {
		margin-bottom: 0;
	}
`;

export const ConditionRow = styled.div`
	display: flex;
	align-items: flex-start;
	gap: ${SPACINGS.sm};
	margin-bottom: ${SPACINGS.sm};

	.components-base-control {
		margin-bottom: 0;
		flex: 1;
	}

	.components-base-control__field {
		margin-bottom: 0;
	}

	> button {
		flex-shrink: 0;
		margin-top: 2px;
	}
`;

export const ActionButtons = styled.div`
	display: flex;
	gap: ${SPACINGS.sm};
	margin-top: ${SPACINGS.sm};
`;
