import styled, { css } from 'styled-components';
import { COLORS, SPACINGS } from '@admin/theme';

export const TableHeadingEditorContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${SPACINGS.sm};
    overflow-x: auto;
    max-width: 100%;
`;

export const TableHeading = styled.div<{ $isActive?: boolean, $deleted?: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${SPACINGS.sm};
    padding: ${SPACINGS.sm};
    border: 1px solid ${({ $isActive }) => $isActive ? COLORS.primary : COLORS.grey};
    border-radius: var(--ptr-admin-input-border-radius);
    min-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    > span {
        ${({ $deleted }) => $deleted && css`
            opacity: 0.5;
            text-decoration: line-through;
        `}
    }
`

export const TableHeadingActions = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${SPACINGS.xs};
`;