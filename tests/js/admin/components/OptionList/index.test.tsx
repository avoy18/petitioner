import OptionList from '@admin/components/OptionList';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

const option = (value: string, label = value) => ({ value, label });

describe('OptionList Component', () => {
	it('renders the component with options', () => {
		render(
			<OptionList
				options={[option('option-1', 'Option 1'), option('option-2', 'Option 2'), option('option-3', 'Option 3')]}
				onOptionsChange={() => {}}
			/>
		);
		expect(screen.getByTestId('option-list')).toBeInTheDocument();
	});

	it('renders all provided option values', () => {
		render(
			<OptionList
				options={[option('apple', 'Apple'), option('banana', 'Banana'), option('cherry', 'Cherry')]}
				onOptionsChange={() => {}}
			/>
		);

		expect(screen.getByText('Apple')).toBeInTheDocument();
		expect(screen.getByText('Banana')).toBeInTheDocument();
		expect(screen.getByText('Cherry')).toBeInTheDocument();
	});

	it('renders nothing when options are empty', () => {
		const { container } = render(
			<OptionList options={[]} onOptionsChange={() => {}} />
		);

		expect(container.firstChild).toBeNull();
	});

	it('renders the label', () => {
		render(
			<OptionList
				options={[option('ca', 'Canada')]}
				onOptionsChange={() => {}}
			/>
		);

		expect(screen.getByText('Canada')).toBeInTheDocument();
		expect(screen.queryByText('ca')).not.toBeInTheDocument();
	});

	it('renders table headers (Value and Actions)', () => {
		render(
			<OptionList
				options={[option('option-1', 'Option 1')]}
				onOptionsChange={() => {}}
			/>
		);

		expect(screen.getByText('Value')).toBeInTheDocument();
		expect(screen.getByText('Actions')).toBeInTheDocument();
	});

	it('renders a remove button for each option', () => {
		render(
			<OptionList
				options={[option('alpha', 'Alpha'), option('beta', 'Beta'), option('gamma', 'Gamma')]}
				onOptionsChange={() => {}}
			/>
		);

		const removeButtons = screen.getAllByLabelText('Remove option');
		expect(removeButtons).toHaveLength(3);
	});

	it('calls onOptionsChange without the removed option when remove is clicked', async () => {
		const user = userEvent.setup();
		const mockOnChange = vi.fn();

		render(
			<OptionList
				options={[option('alpha', 'Alpha'), option('beta', 'Beta'), option('gamma', 'Gamma')]}
				onOptionsChange={mockOnChange}
			/>
		);

		const removeButtons = screen.getAllByLabelText('Remove option');
		await user.click(removeButtons[1]); // remove "Beta"

		expect(mockOnChange).toHaveBeenCalledWith([option('alpha', 'Alpha'), option('gamma', 'Gamma')]);
	});

	it('calls onOptionsChange with empty array when last option is removed', async () => {
		const user = userEvent.setup();
		const mockOnChange = vi.fn();

		render(
			<OptionList
				options={[option('only', 'Only')]}
				onOptionsChange={mockOnChange}
			/>
		);

		const removeButton = screen.getByLabelText('Remove option');
		await user.click(removeButton);

		expect(mockOnChange).toHaveBeenCalledWith([]);
	});
});
