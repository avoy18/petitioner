import { COLORS, SPACINGS } from '@admin/theme';
import styled, { keyframes } from 'styled-components';

export const shimmer = keyframes`
    0% {
        background-position: -200px 0;
    }
    100% {
        background-position: calc(200px + 100%) 0;
    }
`;

export const SkeletonBox = styled.div`
    width: 100%;
    height: 16px;
    background: #f6f7f8;
    background-image: linear-gradient(
        to right,
        ${COLORS.grey} 0%,
        #e2e2e2 20%,
        ${COLORS.grey} 40%,
        ${COLORS.grey} 100%
    );
    background-repeat: no-repeat;
    background-size: 800px 100%;
    border-radius: 4px;
    animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export const TableWrapper = styled.div`
    overflow-x: auto;
    max-width: 100%;
    width: 100%;
    min-height: 500px;
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