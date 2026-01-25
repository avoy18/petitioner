import { useState } from '@wordpress/element';
import { TableHeadingEditorContainer, TableHeading } from './styled';
import type { TableHeadingEditorProps, Heading } from './consts';

export default function TableHeadingEditor({ headings }: TableHeadingEditorProps) {
	const [activeHeading, setActiveHeading] = useState<Heading | null>(null);

	return (
		<TableHeadingEditorContainer>
			{headings.map((heading) => (
				<TableHeading
					key={heading.id}>
					{heading.label}
				</TableHeading>
			))}
		</TableHeadingEditorContainer>
	);
}