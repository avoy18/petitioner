import styled, { css } from 'styled-components';
import { COLORS, SPACINGS } from '@admin/theme';

export const TableHeadingEditorContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${SPACINGS.sm};
`;

export const TableHeadingsWrapper = styled.div`
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
`

export const TableHeadingLabel = styled.span<{ $deleted?: boolean }>`
    ${({ $deleted }) => $deleted && css`
        opacity: 0.5;
        text-decoration: line-through;
    `}
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const TableHeadingActions = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${SPACINGS.xs};
`;

export const HiddenItemsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${SPACINGS.xs};
    justify-content: flex-end;
`;