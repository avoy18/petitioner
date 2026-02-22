import { memo } from '@wordpress/element';
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
import { HIDE_HIDDEN_COLUMNS_LABEL, SHOW_HIDDEN_COLUMNS_LABEL, type TableHeadingEditorProps } from './consts';
import { getHeadingLabel } from './utilities';
import EditPopover from './EditPopover';

export { useTableHeadingState } from './hooks';

/**
 * Table heading editor component.
 * @example
 * 
 * const initialHeadings = [
 *     { id: 'id', label: 'ID' },
 *     { id: 'name', label: 'Name' },
 *     { id: 'email', label: 'Email' },
 * ];
 * const headingState = useTableHeadingState(initialHeadings);
 * 
 * const { currentHeading, modifiedHeadings } = headingState; // you can use these to display the current heading and modified headings
 * 
 * return (
 *     <div>
 *     	<TableHeadingEditor headingState={headingState} />
 *     	<div>
 *     		<h1>{currentHeading?.label}</h1>
 *     	</div>
 *     	<div>
 *     		<h2>Modified Headings</h2>
 *     		<ul>
 *     			{modifiedHeadings.map((heading) => (
 *     				<li key={heading.id}>{heading.label}</li>
 *     			))}
 *     		</ul>
 *     	</div>
 *     </div>
 * );
 * 
 * Note: The headings array is not synced if you modify it.
 * 
 * @param headingState - The state of the table heading editor
 * @returns {JSX.Element} The table heading editor component
 */
const TableHeadingEditor = ({ headingState, title }: TableHeadingEditorProps) => {
	const {
		currentHeading,
		modifiedHeadings,
		handleEditHeading,
		handleDeleteHeading,
		handleRestoreHeading,
		handleSaveHeading,
		showHiddenHeadings,
		handleShowHiddenHeadings,
	} = headingState;

	const hiddenCount = modifiedHeadings.filter((heading) => heading.overrides?.hidden).length;

	return (
		<TableHeadingEditorContainer>
			<HiddenItemsWrapper>
				<div>{title}</div>
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