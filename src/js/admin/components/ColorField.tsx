import { ColorPicker, Button, ColorIndicator } from '@wordpress/components';
import { createPortal } from 'react-dom';
import { useState, useEffect, useRef } from '@wordpress/element';
import styled from 'styled-components';

const PtrColorPicker = styled.div`
	position: relative;
	display: inline-block;
`;

const ColorPickerButton = styled(Button)`
	--wp-components-color-accent: #333;
	--wp-components-color-accent-hover: #333;
	display: flex;
	gap: 8px;
`;

const Palette = styled.div.attrs({ className: 'ptr-color-picker__palette' })<{
	$topValue?: string;
	$isOpen?: boolean;
}>`
	padding: 4px;
	border-radius: 4px;
	background: white;
	position: absolute;
	display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
	top: 0;
	right: 0;
	z-index: 9;
	transform: translate(calc(100% + 36px), calc(-100% + 36px))
		${({ $topValue }) => ($topValue ? `translateY(${$topValue})` : '')};
`;

export default function ColorField({
	color = '#fff',
	onColorChange = (color: string) => {},
	defaultColor = '#fff',
	label = 'Select Color',
	id = 'petitioner_color',
}) {
	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const [pickerTopValue, setPickerTopValue] = useState('0');
	const buttonRef = useRef(null);

	const PickerOverlay = () => {
		if (!isPickerOpen) {
			return null;
		}
		// Prevent the overlay from closing when clicking inside the color picker
		const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation();
			if (
				e.target instanceof Element &&
				e.target.closest('.ptr-color-picker__palette')
			) {
				return;
			}
			setIsPickerOpen(false);
		};

		return createPortal(
			<div
				className="ptr-color-picker__overlay"
				onClick={handleOverlayClick}
			/>,
			document.body
		);
	};

	useEffect(() => {
		const handleEscapeKey = (e: KeyboardEvent) => {
			if (isPickerOpen && e.key === 'Escape') {
				e.preventDefault();
				setIsPickerOpen(false);
				setPickerTopValue('0');
			}
		};

		document.addEventListener('keydown', handleEscapeKey);

		return () => {
			document.removeEventListener('keydown', handleEscapeKey);
		};
	}, [isPickerOpen]);

	const updateTopValue = () => {
		const button = buttonRef.current as HTMLElement | null;

		if (!button) return;

		const buttonRect = button.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const margin = 16;

		const paletteHeight = 396;

		const wouldBeTop = buttonRect.top - paletteHeight;
		const wouldBeBottom = wouldBeTop + paletteHeight;

		let adjustmentTop = 0;

		// Check if palette would go above viewport
		if (wouldBeTop < margin) {
			adjustmentTop = margin - wouldBeTop;
		}
		// Check if palette would go below viewport
		else if (wouldBeBottom > viewportHeight - margin) {
			const overlap = wouldBeBottom - (viewportHeight - margin);
			adjustmentTop = -overlap;
		}

		setPickerTopValue(adjustmentTop !== 0 ? `${adjustmentTop}px` : '0');
	};

	const handlePickerOpen = () => {
		setIsPickerOpen((prevState) => {
			const newState = !prevState;
			if (newState) {
				// Calculate position when opening
				updateTopValue();
			}
			return newState;
		});
	};

	return (
		<>
			<PtrColorPicker>
				<ColorPickerButton
					ref={buttonRef}
					onClick={handlePickerOpen}
					variant="secondary"
					className="color-picker__button"
				>
					<ColorIndicator colorValue={color || defaultColor} />
					{label}
				</ColorPickerButton>
				<Palette $topValue={pickerTopValue} $isOpen={isPickerOpen}>
					<ColorPicker
						color={color || defaultColor}
						onChange={(newColor) => {
							onColorChange(newColor);
						}}
						enableAlpha
						defaultValue={defaultColor}
					/>
				</Palette>

				<input data-testid="hidden_color_input" type="hidden" name={id} value={color || defaultColor} />
			</PtrColorPicker>
			<PickerOverlay />
		</>
	);
}
