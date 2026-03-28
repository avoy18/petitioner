import { useCallback } from '@wordpress/element';
import { TextControl, Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { GoalMilestonesProps } from './consts';
import type { GoalMilestone } from '@admin/sections/EditFields/consts';
import { MilestoneRow, MilestoneField, RemoveButtonWrapper } from './styled';

/**
 * GoalMilestones Component
 *
 * Displays a single goal field by default. An "Add goal milestone" button
 * allows adding additional milestones, each with a goal value and a
 * count_start (when it becomes active).
 */
export default function GoalMilestones({
	milestones,
	onChange,
}: GoalMilestonesProps) {
	const handleUpdate = useCallback(
		(index: number, field: keyof GoalMilestone, rawValue: string) => {
			const updated = [...milestones];
			updated[index] = { ...updated[index], [field]: Number(rawValue) || 0 };
			onChange(updated);
		},
		[milestones, onChange]
	);

	const handleAdd = useCallback(() => {
		const lastMilestone = milestones[milestones.length - 1];
		const newCountStart = lastMilestone ? lastMilestone.value : 0;
		const newValue = lastMilestone ? lastMilestone.value + 100 : 100;
		onChange([...milestones, { value: newValue, count_start: newCountStart }]);
	}, [milestones, onChange]);

	const handleRemove = useCallback(
		(index: number) => {
			if (milestones.length <= 1) return;
			const updated = milestones.filter((_, i) => i !== index);
			onChange(updated);
		},
		[milestones, onChange]
	);

	return (
		<div data-testid="goal-milestones">
			{milestones.map((milestone, index) => (
				<MilestoneRow
					key={`milestone-row-${index}`}
					data-testid={`milestone-row-${index}`}
				>
					<MilestoneField>
						<TextControl
							type="number"
							label={
								index === 0
									? __('Signature goal *', 'petitioner')
									: __('Goal', 'petitioner')
							}
							value={String(milestone.value)}
							onChange={(val) =>
								handleUpdate(index, 'value', val)
							}
							min={0}
							__nextHasNoMarginBottom
						/>
					</MilestoneField>

					{index > 0 && (
						<>
							<MilestoneField>
								<TextControl
									type="number"
									label={__(
										'Show after # signatures',
										'petitioner'
									)}
									value={String(milestone.count_start)}
									onChange={(val) =>
										handleUpdate(
											index,
											'count_start',
											val
										)
									}
									min={0}
									__nextHasNoMarginBottom
								/>
							</MilestoneField>

							<RemoveButtonWrapper>
								<Button
									isDestructive
									variant="tertiary"
									icon="trash"
									onClick={() => handleRemove(index)}
									size="small"
									label={__('Remove milestone', 'petitioner')}
									data-testid={`remove-milestone-${index}`}
								/>
							</RemoveButtonWrapper>
						</>
					)}
				</MilestoneRow>
			))}

			<Button
				variant="secondary"
				onClick={handleAdd}
				size="small"
				data-testid="add-milestone-btn"
			>
				{__('+ Add goal milestone', 'petitioner')}
			</Button>
		</div>
	);
}
