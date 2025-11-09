import styled from 'styled-components';
import { COLORS, SPACINGS } from '@admin/theme';

export const LogicWrapper = styled.span`
	display: inline-flex;
	align-items: center;
	gap: ${SPACINGS.xs};
	flex-wrap: wrap;
`;

export const ConditionBadge = styled.span`
	display: inline-flex;
	align-items: center;
	gap: ${SPACINGS.xs};
	padding: 2px ${SPACINGS.xs};
	border: 1px solid ${COLORS.grey};
	border-radius: 3px;
	font-size: 0.875rem;
`;

export const FieldName = styled.span`
	font-weight: 600;
	color: ${COLORS.primary};
`;

export const Operator = styled.span`
	color: ${COLORS.darkGrey};
	font-style: italic;
`;

export const Value = styled.span`
	color: ${COLORS.dark};
	font-weight: 500;
`;

export const LogicConnector = styled.span`
	font-weight: 700;
	color: ${COLORS.darkGrey};
	padding: 0 ${SPACINGS.xs};
`;

export const EmptyState = styled.span`
	color: ${COLORS.grey};
	font-style: italic;
`;

