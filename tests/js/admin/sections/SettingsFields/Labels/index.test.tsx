import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Labels from '@admin/sections/SettingsFields/Labels';
import * as SettingsContext from '@admin/context/SettingsContext';

// Mock TextInput if needed
vi.mock('@admin/components/TextInput', () => ({
	default: ({ label, value, onChange, onBlur }: any) => (
		<input
			data-testid={`text-input-${label}`}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onBlur={onBlur}
		/>
	),
}));

describe('Labels component', () => {
	const mockDefaults = {
		could_not_submit: 'Could not submit',
		thank_you: 'Thank you for signing',
	};

	const mockOverrides = {
		thank_you: 'Thanks!',
	};

	beforeEach(() => {
		// Set global windowPetitionerData
		window.windowPetitionerData = {
			default_values: {
				labels: mockDefaults,
			},
		};

		// Mock context
		vi.spyOn(SettingsContext, 'useSettingsFormContext').mockReturnValue({
			formState: {
				label_overrides: mockOverrides,
			},
			windowPetitionerData,
		});
	});

	it('renders all label inputs with default and override values', () => {
		render(<Labels />);

		expect(
			screen.getByTestId('text-input-could_not_submit')
		).toBeInTheDocument();

		expect(screen.getByTestId('text-input-thank_you')).toBeInTheDocument();

		// Check the override is pre-filled
		expect(screen.getByTestId('text-input-thank_you')).toHaveValue(
			'Thanks!'
		);
	});

	it('updates hidden input value after change', () => {
		render(<Labels />);

		const input = screen.getByTestId('text-input-could_not_submit');

		// Simulate change + blur
		fireEvent.change(input, { target: { value: 'Failed to submit' } });
		fireEvent.blur(input);

		const hiddenInput = screen.getByTestId('petitioner_label_overrides');
		const overrides = JSON.parse(hiddenInput.getAttribute('value') || '{}');

		expect(overrides).toHaveProperty(
			'could_not_submit',
			'Failed to submit'
		);
	});
});
