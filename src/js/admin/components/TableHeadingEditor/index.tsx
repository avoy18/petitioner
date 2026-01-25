import { memo, useMemo } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import {
	TableHeadingEditorContainer,
	TableHeading,
	TableHeadingActions,
	TableHeadingLabel,
	TableHeadingsWrapper,
	HiddenItemsWrapper
} from './styled';
import { useTableHeadingState } from './hooks';
import { HIDE_HIDDEN_COLUMNS_LABEL, SHOW_HIDDEN_COLUMNS_LABEL, type TableHeadingEditorProps } from './consts';
import { getHeadingLabel } from './utilities';
import EditPopover from './EditPopover';

const TableHeadingEditor = ({ headings }: TableHeadingEditorProps) => {
	const {
		currentHeading,
		modifiedHeadings,
		handleEditHeading,
		handleDeleteHeading,
		handleRestoreHeading,
		handleSaveHeading,
		showHiddenHeadings,
		handleShowHiddenHeadings,
	} = useTableHeadingState(headings);

	const hiddenCount = useMemo(() => {
		return modifiedHeadings.filter((heading) => heading.overrides?.hidden).length;
	}, [modifiedHeadings]);

	return (
		<TableHeadingEditorContainer>
			<HiddenItemsWrapper>
				<Button
					size="small"
					icon="visibility"
					variant="tertiary"
					label={showHiddenHeadings ? HIDE_HIDDEN_COLUMNS_LABEL : SHOW_HIDDEN_COLUMNS_LABEL}
					showTooltip={true}
					onClick={handleShowHiddenHeadings}>
					{showHiddenHeadings ? HIDE_HIDDEN_COLUMNS_LABEL : SHOW_HIDDEN_COLUMNS_LABEL} ({hiddenCount})
				</Button>
			</HiddenItemsWrapper>
			<TableHeadingsWrapper>
				{modifiedHeadings.map((heading) => {
					const isDeletedHeading = heading.overrides?.hidden;

					if (isDeletedHeading && !showHiddenHeadings) {
						return null;
					}

					return (
						<TableHeading key={heading.id} $isActive={currentHeading?.id === heading.id} $deleted={isDeletedHeading}>
							<TableHeadingLabel $deleted={isDeletedHeading}>
								{getHeadingLabel(heading)}
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