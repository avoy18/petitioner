import { Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, TableWrapper } from './styled';
import type { SpreadsheetSampleProps } from './consts';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function SpreadsheetSample({ headings, rows, isLoading }: SpreadsheetSampleProps) {
    const Headings = useMemo(() => {
        return <>
            <TableHeadCell $isCount={true}></TableHeadCell>
            {headings.map((heading) => (
                <TableHeadCell key={heading}>{heading}</TableHeadCell>
            ))}
        </>
    }, [isLoading, headings]);

    const Rows = useMemo(() => {
        if (rows.length === 0) {
            return <TableRow>
                <TableCell colSpan={headings.length}>{__('No data', 'petitioner')}</TableCell>
            </TableRow>
        }

        return rows.map((row, index) => (
            <TableRow key={row.join(',')}>
                <TableCell $isCount={true}>{index + 1}</TableCell>
                {row.map((cell) => (
                    <TableCell key={cell}>{cell}</TableCell>
                ))}
            </TableRow>
        ))
    }, [isLoading, rows, headings]);

    if (isLoading) {
        return <TableWrapper>
            <Table>
                <TableHead>
                    <TableHeadCell>{__('Loading...', 'petitioner')}</TableHeadCell>
                </TableHead>
            </Table>
        </TableWrapper>
    }

    return (
        <TableWrapper>
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