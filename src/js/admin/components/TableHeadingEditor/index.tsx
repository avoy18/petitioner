import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { TableHeadingEditorContainer, TableHeading, TableHeadingActions } from './styled';
import type { TableHeadingEditorProps, Heading } from './consts';

export default function TableHeadingEditor({ headings }: TableHeadingEditorProps) {
	const [activeHeading, setActiveHeading] = useState<Heading | null>(null);
	const [deletedHeadings, setDeletedHeadings] = useState<Set<string>>(new Set());

	const handleEditHeading = (id: string) => {
		setActiveHeading(headings.find((heading) => heading.id === id) || null);
	};

	const handleDeleteHeading = (id: string) => {
		setActiveHeading(null);
		setDeletedHeadings(prev => new Set(prev).add(id));
	};

	const handleRestoreHeading = (id: string) => {
		setDeletedHeadings(prev => {
			const newSet = new Set(prev);
			newSet.delete(id);
			return newSet;
		});
	};

	return (
		<TableHeadingEditorContainer>
			{headings.map((heading) => {
				const isDeleted = deletedHeadings.has(heading.id);
				return (
					<TableHeading
						$deleted={isDeleted}
						key={heading.id}>

						<span>{heading.label}</span>

						<TableHeadingActions>
							<Button size="small" icon="edit" variant="tertiary" onClick={() => handleEditHeading(heading.id)}></Button>
							{isDeleted ?
								<Button
									size="small"
									icon="plus"
									variant="tertiary"
									onClick={() => handleRestoreHeading(heading.id)} /> :
								<Button
									size="small"
									icon="trash"
									variant="tertiary"
									isDestructive={true}
									onClick={() => handleDeleteHeading(heading.id)}
								/>}
						</TableHeadingActions>
					</TableHeading>
				)
			})}
		</TableHeadingEditorContainer>
	);
}