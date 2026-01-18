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

    --cell-padding: ${SPACINGS.xs};
    --cell-border: 1px solid ${COLORS.darkGrey};
    --ptr-admin-spreadsheet-green: #69a87c;
`;

export const TableHead = styled.thead`
    background-color: var(--ptr-admin-spreadsheet-green);
    color: ${COLORS.light};
`;

export const TableBody = styled.tbody`
    background-color: ${COLORS.light};
`;

export const TableRow = styled.tr`
`;

export const TableCell = styled.td`
    padding: var(--cell-padding);
    border: var(--cell-border);
`;

export const TableHeadCell = styled.th`
    padding: var(--cell-padding);
    border: var(--cell-border);
    text-align: left;
`;