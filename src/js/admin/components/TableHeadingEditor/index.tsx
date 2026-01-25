import { TableHeadingEditorContainer, TableHeading } from './styled';
import type { TableHeadingEditorProps } from './consts';

export default function TableHeadingEditor({ headings }: TableHeadingEditorProps) {
	return (
		<TableHeadingEditorContainer>
			{headings.map((heading) => (
				<TableHeading key={heading.id}>{heading.label}</TableHeading>
			))}
		</TableHeadingEditorContainer>
	);
}