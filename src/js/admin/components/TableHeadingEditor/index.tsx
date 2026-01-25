import { memo } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	TableHeadingEditorContainer,
	TableHeading,
	TableHeadingActions,
	TableHeadingLabel,
	TableHeadingsWrapper,
} from './styled';
import { useTableHeadingState } from './hooks';
import type { TableHeadingEditorProps } from './consts';

import EditPopover from './EditPopover';

const TableHeadingEditor = ({ headings }: TableHeadingEditorProps) => {
	const {
		currentHeading,
		modifiedHeadings,
		handleEditHeading,
		handleDeleteHeading,
		handleRestoreHeading,
		handleSaveHeading,
		isDeleted,
	} = useTableHeadingState(headings);

	return (
		<TableHeadingEditorContainer>
			<TableHeadingsWrapper>
				{modifiedHeadings.map((heading) => {
					const isDeletedHeading = isDeleted(heading.id);

					return (
						<TableHeading key={heading.id}>
							<TableHeadingLabel $deleted={isDeletedHeading}>
								{heading.label}
							</TableHeadingLabel>

							<TableHeadingActions>
								<Button
									size="small"
									icon="edit"
									variant="tertiary"
									label={__('Edit column', 'petitioner')}
									showTooltip={true}
									onClick={() => handleEditHeading(heading.id)}
								/>
								{isDeletedHeading ? (
									<Button
										size="small"
										icon="visibility"
										variant="tertiary"
										label={__('Show column', 'petitioner')}
										showTooltip={true}
										onClick={() => handleRestoreHeading(heading.id)}
									/>
								) : (
									<Button
										size="small"
										icon="hidden"
										variant="tertiary"
										isDestructive={true}
										label={__('Hide column', 'petitioner')}
										showTooltip={true}
										onClick={() => handleDeleteHeading(heading.id)}
									/>
								)}
							</TableHeadingActions>
						</TableHeading>
					);
				})}
			</TableHeadingsWrapper>

			{currentHeading && (
				<EditPopover
					key={currentHeading.id}
					heading={currentHeading}
					onClose={() => handleEditHeading(null)}
					onSave={handleSaveHeading}
				/>
			)}
		</TableHeadingEditorContainer>
	);
};

export default memo(TableHeadingEditor);