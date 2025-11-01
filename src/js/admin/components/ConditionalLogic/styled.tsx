import styled from 'styled-components';

export const ConditionalLogicWrapper = styled.div`
	border: 1px solid rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	padding: var(--ptr-admin-spacing-md, 16px);
	background: #fff;
`;

export const GroupWrapper = styled.div`
	border: 2px dashed rgba(0, 0, 0, 0.2);
	border-radius: 4px;
	padding: var(--ptr-admin-spacing-md, 16px);
	margin-bottom: var(--ptr-admin-spacing-md, 16px);
	background: rgba(0, 0, 0, 0.02);
`;

export const GroupHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: var(--ptr-admin-spacing-md, 16px);

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
	gap: 8px;
	margin-bottom: 8px;

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
	gap: 8px;
	margin-top: 8px;
`;
