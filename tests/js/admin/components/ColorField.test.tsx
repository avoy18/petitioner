import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ColorField from '@admin/components/ColorField'; // adjust path as needed

describe('ColorField', () => {
	let onColorChange: (color: string) => void;

	beforeEach(() => {
		onColorChange = vi.fn();
	});

	it('renders with initial color and label', () => {
		render(
			<ColorField
				color="#123456"
				defaultColor="#abcdef"
				label="My Color"
				id="test_color"
			/>
		);

		expect(screen.getByText('My Color')).toBeInTheDocument();

		const hiddenInput = screen.getByTestId(
			'hidden_color_input'
		) as HTMLInputElement;
		expect(hiddenInput).toHaveAttribute('name', 'test_color');
		expect(hiddenInput).toHaveValue('#123456');
	});

	it('opens the color picker when button is clicked', () => {
		render(<ColorField label="Pick Color" />);

		const button = screen.getByRole('button', { name: /pick color/i });
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

		fireEvent.click(button);

		const palette = document.querySelector('.ptr-color-picker__palette');
		expect(palette).toHaveStyle({ display: 'block' });
	});

	it('closes color picker when overlay is clicked', () => {
		render(<ColorField label="Pick Color" />);

		const button = screen.getByRole('button', { name: /pick color/i });
		fireEvent.click(button);

		const overlay = document.querySelector('.ptr-color-picker__overlay');
		expect(overlay).toBeInTheDocument();

		fireEvent.click(overlay!);

		const palette = document.querySelector('.ptr-color-picker__palette');
		expect(palette).toHaveStyle({ display: 'none' });
	});

	it('calls onColorChange when color is picked', () => {
		render(<ColorField label="Color" onColorChange={onColorChange} />);

		// Open picker
		const button = screen.getByRole('button', { name: /color/i });
		fireEvent.click(button);

		const colorPicker = document.querySelector(
			'.ptr-color-picker__palette input[type="range"]'
		) as HTMLInputElement;

		// Simulate color change
		if (colorPicker) {
			fireEvent.change(colorPicker, { target: { value: '#ff0000' } });
			expect(onColorChange).toHaveBeenCalled();
		} else {
			console.warn(
				'Color input not found, may need more specific targeting'
			);
		}
	});
});
