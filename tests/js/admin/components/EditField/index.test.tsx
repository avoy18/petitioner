import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import EditField from '@admin/components/EditField';

describe('EditField component', () => {
	it('renders a text input by default', () => {
		render(
			<EditField
				type="text"
				value="test value"
				onChange={() => {}}
				placeholder="Enter text"
			/>
		);
		
		const input = screen.getByPlaceholderText('Enter text');
		expect(input).toBeInTheDocument();
		expect(input).toHaveValue('test value');
	});

	it('renders a select when type is select with options', () => {
		render(
			<EditField
				type="select"
				value="option2"
				onChange={() => {}}
				options={[
					{ label: 'Option 1', value: 'option1' },
					{ label: 'Option 2', value: 'option2' },
				]}
			/>
		);
		
		const select = screen.getByRole('combobox');
		expect(select).toBeInTheDocument();
		expect(select).toHaveValue('option2');
	});

	it('renders a checkbox when type is checkbox', () => {
		render(
			<EditField
				type="checkbox"
				value="1"
				onChange={() => {}}
			/>
		);
		
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toBeInTheDocument();
		expect(checkbox).toBeChecked();
	});

	it('handles checkbox unchecked state', () => {
		render(
			<EditField
				type="checkbox"
				value="0"
				onChange={() => {}}
			/>
		);
		
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).not.toBeChecked();
	});

	it('renders textarea when type is textarea', () => {
		render(
			<EditField
				type="textarea"
				value="multiline text"
				onChange={() => {}}
				placeholder="Enter description"
			/>
		);
		
		const textarea = screen.getByPlaceholderText('Enter description');
		expect(textarea).toBeInTheDocument();
		expect(textarea.tagName).toBe('TEXTAREA');
	});

	it('calls onChange when text input changes', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		
		render(
			<EditField
				type="text"
				value=""
				onChange={onChange}
				placeholder="Type here"
			/>
		);
		
		const input = screen.getByPlaceholderText('Type here');
		await user.type(input, 'new value');
		
		expect(onChange).toHaveBeenCalled();
	});

	it('calls onChange with "1" when checkbox is checked', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		
		render(
			<EditField
				type="checkbox"
				value="0"
				onChange={onChange}
			/>
		);
		
		const checkbox = screen.getByRole('checkbox');
		await user.click(checkbox);
		
		expect(onChange).toHaveBeenCalledWith('1');
	});

	it('calls onChange with "0" when checkbox is unchecked', async () => {
		const onChange = vi.fn();
		const user = userEvent.setup();
		
		render(
			<EditField
				type="checkbox"
				value="1"
				onChange={onChange}
			/>
		);
		
		const checkbox = screen.getByRole('checkbox');
		await user.click(checkbox);
		
		expect(onChange).toHaveBeenCalledWith('0');
	});

	it('renders date input when type is date', () => {
		render(
			<EditField
				type="date"
				value="2024-01-15"
				onChange={() => {}}
			/>
		);
		
		const input = screen.getByDisplayValue('2024-01-15');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'date');
	});
});
