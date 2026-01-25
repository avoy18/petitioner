import styled from 'styled-components';
import { COLORS, SPACINGS } from '@admin/theme';

export const EditPopoverContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: ${SPACINGS.sm};
    padding: ${SPACINGS.sm} ${SPACINGS.xl} ${SPACINGS.xl};
    border: 1px solid ${COLORS.grey};
    background-color: white;
    border-radius: var(--ptr-admin-input-border-radius);
`;

export const PopoverActions = styled.div`
    display: flex;
    gap: ${SPACINGS.sm};
`;

export const PopoverInputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${SPACINGS.sm};
`;