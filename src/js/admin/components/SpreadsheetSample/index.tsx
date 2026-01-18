import { Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell, TableWrapper } from './styled';
import type { SpreadsheetSampleProps } from './consts';

export default function SpreadsheetSample({ headings, rows }: SpreadsheetSampleProps) {

    return (
        <TableWrapper>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeadCell></TableHeadCell>
                        {headings.map((heading) => (
                            <TableHeadCell key={heading}>{heading}</TableHeadCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={row.join(',')}>
                            <TableCell>{index + 1}</TableCell>
                            {row.map((cell) => (
                                <TableCell key={cell}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableWrapper>
    );
}