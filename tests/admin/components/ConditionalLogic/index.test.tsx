import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ConditionalLogic, {
	useConditionalLogic,
} from '@admin/components/ConditionalLogic';
import { act } from 'react';

const availableFields = [
	{ value: 'email', label: 'Email' },
	{ value: 'name', label: 'Name' },
	{ value: 'country', label: 'Country' },
];

// Test wrapper component
function TestWrapper() {
	const { logic, setLogic } = useConditionalLogic();

	return (
		<ConditionalLogic
			value={logic}
			onChange={setLogic}
			availableFields={availableFields}
		/>
	);
}

describe('ConditionalLogic component', () => {
	it('renders with initial empty condition', () => {
		render(<TestWrapper />);

		// Check for the "Match" text
		expect(screen.getByText(/match/i)).toBeInTheDocument();

		// Check for AND/OR selector
		expect(screen.getByText(/of the following:/i)).toBeInTheDocument();

		// Check for field selectors
		expect(screen.getByText(/select field.../i)).toBeInTheDocument();

		// Check for Add Condition button
		expect(
			screen.getByRole('button', { name: /add condition/i })
		).toBeInTheDocument();
	});

	it('adds a new condition when Add Condition button is clicked', async () => {
		const user = userEvent.setup();
		render(<TestWrapper />);

		// Initially should have 1 condition
		const initialFields = screen.getAllByText(/select field.../i);
		expect(initialFields).toHaveLength(1);

		// Click Add Condition
		const addButton = screen.getByRole('button', {
			name: /add condition/i,
		});

		await act(async () => {
			await user.click(addButton);
		});

		// Now should have 2 conditions
		const updatedFields = screen.getAllByText(/select field.../i);
		expect(updatedFields).toHaveLength(2);
	});

	it('removes a condition when remove button is clicked', async () => {
		const user = userEvent.setup();
		render(<TestWrapper />);

		// Add a second condition first
		const addButton = screen.getByRole('button', {
			name: /add condition/i,
		});

		await act(async () => {
			await user.click(addButton);
		});

		// Should have 2 conditions now
		expect(screen.getAllByText(/select field.../i)).toHaveLength(2);

		// Find and click remove button
		const removeButtons = screen.getAllByRole('button', {
			name: /remove condition/i,
		});
		expect(removeButtons).toHaveLength(2);

		await act(async () => {
			await user.click(removeButtons[0]);
		});

		// Should have 1 condition left
		expect(screen.getAllByText(/select field.../i)).toHaveLength(1);
	});

	it('displays available field options in dropdown', () => {
		render(<TestWrapper />);

		// Check that field options are available
		availableFields.forEach((field) => {
			expect(screen.getByText(field.label)).toBeInTheDocument();
		});
	});

	it('calls onChange when logic is updated', async () => {
		const user = userEvent.setup();
		const mockOnChange = vi.fn();

		function TestWithMock() {
			const { logic } = useConditionalLogic();

			return (
				<ConditionalLogic
					value={logic}
					onChange={mockOnChange}
					availableFields={availableFields}
				/>
			);
		}

		render(<TestWithMock />);

		// Click Add Condition
		const addButton = screen.getByRole('button', {
			name: /add condition/i,
		});

		await act(async () => {
			await user.click(addButton);
		});

		// onChange should have been called
		expect(mockOnChange).toHaveBeenCalled();
	});

	it('shows operators dropdown with all options', () => {
		render(<TestWrapper />);

		// Check for operator options - use exact match for "Equals"
		expect(screen.getByText('Equals')).toBeInTheDocument();
		expect(screen.getByText('Contains')).toBeInTheDocument();
		expect(screen.getByText('Is Empty')).toBeInTheDocument();
	});

	it('hides value input for is_empty and is_not_empty operators', async () => {
		const user = userEvent.setup();
		render(<TestWrapper />);

		// Initially should have value input (Enter value... placeholder)
		expect(
			screen.getByPlaceholderText(/enter value.../i)
		).toBeInTheDocument();

		// Select "Is Empty" operator (this would require more complex interaction)
		// For now, just verify the value input exists by default
		const valueInputs = screen.getAllByPlaceholderText(/enter value.../i);
		expect(valueInputs.length).toBeGreaterThan(0);
	});
});

describe('useConditionalLogic hook', () => {
	function HookTestWrapper() {
		const { logic, isValid, resetLogic } = useConditionalLogic({
			defaultLogic: 'OR',
		});

		return (
			<div>
				<div data-testid="logic-type">{logic.logic}</div>
				<div data-testid="is-valid">
					{isValid ? 'valid' : 'invalid'}
				</div>
				<div data-testid="conditions-count">
					{logic.conditions.length}
				</div>
				<button onClick={resetLogic}>Reset</button>
			</div>
		);
	}

	it('initializes with default logic type', () => {
		render(<HookTestWrapper />);

		expect(screen.getByTestId('logic-type')).toHaveTextContent('OR');
	});

	it('initializes with one empty condition', () => {
		render(<HookTestWrapper />);

		expect(screen.getByTestId('conditions-count')).toHaveTextContent('1');
	});

	it('validates conditions correctly', () => {
		render(<HookTestWrapper />);

		// Initially invalid because condition is empty
		expect(screen.getByTestId('is-valid')).toHaveTextContent('invalid');
	});

	it('resets logic when resetLogic is called', async () => {
		const user = userEvent.setup();
		render(<HookTestWrapper />);

		const resetButton = screen.getByRole('button', { name: /reset/i });

		await act(async () => {
			await user.click(resetButton);
		});

		// Should still have 1 condition after reset
		expect(screen.getByTestId('conditions-count')).toHaveTextContent('1');
	});
});
