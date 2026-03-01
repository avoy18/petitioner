import OptionList from '@admin/components/OptionList';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('OptionList Component', () => {
	it('renders the component with options', () => {
		render(
			<OptionList
				options={['Option 1', 'Option 2', 'Option 3']}
				onOptionsChange={() => {}}
			/>
		);
		expect(screen.getByTestId('option-list')).toBeInTheDocument();
	});

	it('renders all provided option values', () => {
		render(
			<OptionList
				options={['Apple', 'Banana', 'Cherry']}
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

	it('de-duplicates options', () => {
		render(
			<OptionList
				options={['Apple', 'Apple', 'Banana']}
				onOptionsChange={() => {}}
			/>
		);

		const apples = screen.getAllByText('Apple');
		expect(apples).toHaveLength(1);
		expect(screen.getByText('Banana')).toBeInTheDocument();
	});

	it('renders table headers (Value and Actions)', () => {
		render(
			<OptionList
				options={['Option 1']}
				onOptionsChange={() => {}}
			/>
		);

		expect(screen.getByText('Value')).toBeInTheDocument();
		expect(screen.getByText('Actions')).toBeInTheDocument();
	});

	it('renders a remove button for each option', () => {
		render(
			<OptionList
				options={['Alpha', 'Beta', 'Gamma']}
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
				options={['Alpha', 'Beta', 'Gamma']}
				onOptionsChange={mockOnChange}
			/>
		);

		const removeButtons = screen.getAllByLabelText('Remove option');
		await user.click(removeButtons[1]); // remove "Beta"

		expect(mockOnChange).toHaveBeenCalledWith(['Alpha', 'Gamma']);
	});

	it('calls onOptionsChange with empty array when last option is removed', async () => {
		const user = userEvent.setup();
		const mockOnChange = vi.fn();

		render(
			<OptionList
				options={['Only']}
				onOptionsChange={mockOnChange}
			/>
		);

		const removeButton = screen.getByLabelText('Remove option');
		await user.click(removeButton);

		expect(mockOnChange).toHaveBeenCalledWith([]);
	});
});
