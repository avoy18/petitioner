import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { TableHeadingEditorContainer, TableHeading, TableHeadingActions, TableHeadingLabel, TableHeadingsWrapper } from './styled';
import type { TableHeadingEditorProps } from './consts';
import { useTableHeadingState } from './hooks';

import EditPopover from './EditPopover';

export default function TableHeadingEditor({ headings }: TableHeadingEditorProps) {
	const { currentHeading, modifiedHeadings, handleEditHeading, handleDeleteHeading, handleRestoreHeading, handleSaveHeading, isDeleted } = useTableHeadingState(headings);

	return (
		<TableHeadingEditorContainer>
			<TableHeadingsWrapper>
				{modifiedHeadings.map((heading) => {
					const isDeletedHeading = isDeleted(heading.id);

					return (
						<TableHeading
							key={heading.id}>

							<TableHeadingLabel $deleted={isDeletedHeading}>{heading.label}</TableHeadingLabel>

							<TableHeadingActions>
								<Button size="small" icon="edit" variant="tertiary" onClick={() => handleEditHeading(heading.id)}></Button>
								{isDeletedHeading ?
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
			</TableHeadingsWrapper>

			{currentHeading && <EditPopover
				heading={currentHeading}
				onClose={() => handleEditHeading(null)}
				onSave={handleSaveHeading}
			/>}
		</TableHeadingEditorContainer>
	);
}