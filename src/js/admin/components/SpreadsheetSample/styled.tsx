import { COLORS, SPACINGS } from '@admin/theme';
import styled from 'styled-components';

export const TableWrapper = styled.div`
    overflow-x: auto;
    max-width: 100%;
    width: 100%;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    border: 1px solid ${COLORS.darkGrey};
    overflow: hidden;

    --cell-padding: ${SPACINGS.sm};
    --cell-border: 1px solid ${COLORS.darkGrey};
`;

export const TableHead = styled.thead`
    background-color: ${COLORS.grey};
`;

export const TableBody = styled.tbody`
     background-color: ${COLORS.light};
`;

export const TableRow = styled.tr`
`;

export const TableCell = styled.td<{ $isCount?: boolean }>`
    padding: var(--cell-padding);
    border: var(--cell-border);
    min-width: ${({ $isCount }) => $isCount ? 'auto' : '100px'};
    `;
    
    export const TableHeadCell = styled.th<{ $isCount?: boolean }>`
    padding: var(--cell-padding);
    border: var(--cell-border);
    text-align: left;
    min-width: ${({ $isCount }) => $isCount ? 'auto' : '100px'};
    white-space: nowrap;
`;