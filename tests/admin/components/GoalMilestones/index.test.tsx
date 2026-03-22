import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import GoalMilestones from '@admin/components/GoalMilestones';

describe('GoalMilestones Component', () => {
	const defaultMilestones = [{ value: 100, count_start: 0 }];

	it('renders a single milestone row by default', () => {
		const onChange = vi.fn();
		render(
			<GoalMilestones
				milestones={defaultMilestones}
				onChange={onChange}
			/>
		);

		expect(screen.getByTestId('milestone-row-0')).toBeInTheDocument();
		expect(
			screen.queryByTestId('milestone-row-1')
		).not.toBeInTheDocument();
	});

	it('renders the goal value in the input', () => {
		const onChange = vi.fn();
		render(
			<GoalMilestones
				milestones={defaultMilestones}
				onChange={onChange}
			/>
		);

		const input = screen.getByDisplayValue('100');
		expect(input).toBeInTheDocument();
	});

	it('does not show a remove button for the first milestone', () => {
		const onChange = vi.fn();
		render(
			<GoalMilestones
				milestones={defaultMilestones}
				onChange={onChange}
			/>
		);

		expect(
			screen.queryByTestId('remove-milestone-0')
		).not.toBeInTheDocument();
	});

	it('adds a new milestone when "Add goal milestone" is clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<GoalMilestones
				milestones={defaultMilestones}
				onChange={onChange}
			/>
		);

		const addButton = screen.getByTestId('add-milestone-btn');
		await user.click(addButton);

		expect(onChange).toHaveBeenCalledTimes(1);
		const newMilestones = onChange.mock.calls[0][0];
		expect(newMilestones).toHaveLength(2);
		expect(newMilestones[1]).toEqual({ value: 0, count_start: 100 });
	});

	it('renders multiple milestones with remove buttons', () => {
		const onChange = vi.fn();
		const milestones = [
			{ value: 100, count_start: 0 },
			{ value: 500, count_start: 100 },
		];

		render(
			<GoalMilestones milestones={milestones} onChange={onChange} />
		);

		expect(screen.getByTestId('milestone-row-0')).toBeInTheDocument();
		expect(screen.getByTestId('milestone-row-1')).toBeInTheDocument();
		expect(
			screen.queryByTestId('remove-milestone-0')
		).not.toBeInTheDocument();
		expect(
			screen.getByTestId('remove-milestone-1')
		).toBeInTheDocument();
	});

	it('calls onChange when removing a milestone', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		const milestones = [
			{ value: 100, count_start: 0 },
			{ value: 500, count_start: 100 },
		];

		render(
			<GoalMilestones milestones={milestones} onChange={onChange} />
		);

		const removeBtn = screen.getByTestId('remove-milestone-1');
		await user.click(removeBtn);

		expect(onChange).toHaveBeenCalledTimes(1);
		const updated = onChange.mock.calls[0][0];
		expect(updated).toHaveLength(1);
		expect(updated[0]).toEqual({ value: 100, count_start: 0 });
	});

	it('calls onChange when updating a milestone value', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();

		render(
			<GoalMilestones
				milestones={defaultMilestones}
				onChange={onChange}
			/>
		);

		const input = screen.getByDisplayValue('100');
		await user.clear(input);

		// After clearing, onChange should be called with value 0
		expect(onChange).toHaveBeenCalled();
		const firstCall = onChange.mock.calls[0][0];
		expect(firstCall[0].value).toBe(0);
		expect(firstCall[0].count_start).toBe(0);
	});


	it('shows "Show after # signatures" label only on secondary milestones', () => {
		const onChange = vi.fn();
		const milestones = [
			{ value: 100, count_start: 0 },
			{ value: 500, count_start: 100 },
		];

		render(
			<GoalMilestones milestones={milestones} onChange={onChange} />
		);

		// First row should say "Signature goal *"
		expect(screen.getByText('Signature goal *')).toBeInTheDocument();
		// Second row should say "Goal" and show "Show after..." field
		expect(
			screen.getByText('Show after # signatures')
		).toBeInTheDocument();
	});
});
