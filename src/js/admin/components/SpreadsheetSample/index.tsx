import { Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, TableWrapper, SkeletonBox } from './styled';
import type { SpreadsheetSampleProps } from './consts';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { VisuallyHidden } from '@wordpress/components';

export default function SpreadsheetSample({ headings, rows, isLoading }: SpreadsheetSampleProps) {
    const columnCount = Math.max(headings.length, 5);

    const Headings = useMemo(() => {
        if (isLoading && headings.length === 0) {
            return <>
                <TableHeadCell $isCount={true}></TableHeadCell>
                {Array.from({ length: columnCount }).map((_, index) => (
                    <TableHeadCell key={`loading-heading-${index}`}>
                        <SkeletonBox />
                    </TableHeadCell>
                ))}
            </>
        }

        return <>
            <TableHeadCell $isCount={true}></TableHeadCell>
            {headings.map((heading) => (
                <TableHeadCell key={heading}>{heading}</TableHeadCell>
            ))}
        </>
    }, [isLoading, headings, columnCount]);

    const Rows = useMemo(() => {
        if (isLoading) {
            // Keep exactly the same number of rows as currently being viewed to prevent jumping,
            // or default to 10 if we have no existing grid to mimic.
            const rowCount = Math.max(rows.length, 10);
            
            return Array.from({ length: rowCount }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                    <TableCell $isCount={true}>{index + 1}</TableCell>
                    {Array.from({ length: headings.length || columnCount }).map((_, cellIndex) => (
                        <TableCell key={`loading-cell-${cellIndex}`}>
                            <SkeletonBox />
                        </TableCell>
                    ))}
                </TableRow>
            ));
        }

        if (rows.length === 0) {
            return <TableRow>
                <TableCell colSpan={headings.length + 1} style={{ textAlign: 'center' }}>
                    {__('No data', 'petitioner')}
                </TableCell>
            </TableRow>
        }

        return rows.map((row, index) => (
            <TableRow key={row.join(',') || `row-${index}`}>
                <TableCell $isCount={true}>{index + 1}</TableCell>
                {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
            </TableRow>
        ))
    }, [isLoading, rows, headings, columnCount]);

    return (
        <TableWrapper>
            {isLoading && <VisuallyHidden>{__('Loading...', 'petitioner')}</VisuallyHidden>}
            <Table>
                <TableHead>
                    <TableRow>
                        {Headings}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Rows}
                </TableBody>
            </Table>
        </TableWrapper>
    );
}