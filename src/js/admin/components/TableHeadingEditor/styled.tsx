import styled from 'styled-components';
import { COLORS, SPACINGS } from '@admin/theme';

export const TableHeadingEditorContainer = styled.div`
    display: flex;
    flex-direction: row;
    gap: ${SPACINGS.sm};
`;

export const TableHeading = styled.div<{ $isActive?: boolean }>`
    display: flex;
    flex-direction: row;
    gap: ${SPACINGS.sm};
    padding: ${SPACINGS.sm};
    border: 1px solid ${({ $isActive }) => $isActive ? COLORS.primary : COLORS.grey};
    border-radius: var(--ptr-admin-input-border-radius);
`