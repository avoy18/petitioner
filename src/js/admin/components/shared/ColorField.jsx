import {
	ColorPicker,
	Button,
	__experimentalInputControl as InputControl,
	ColorIndicator,
} from '@wordpress/components';
import { createPortal } from 'react-dom';
import { useState, useCallback, useEffect } from 'react';

export default function ColorField(props) {
	const {
		color = '#fff',
		onColorChange = () => true,
		defaultColor = '#fff',
		label = 'Select Color',
		id = 'petitioner_color',
	} = props;

	const [isPickerOpen, setIsPickerOpen] = useState(false);

	const PickerOverlay = () => {
		if (!isPickerOpen) {
			return null;
		}
		// Prevent the overlay from closing when clicking inside the color picker
		const handleOverlayClick = (e) => {
			e.stopPropagation();
			if (e.target.closest('.ptr-color-picker__palette')) {
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
		const handleEscapeKey = (e) => {
			if (isPickerOpen && e.key === 'Escape') {
				e.preventDefault();
				setIsPickerOpen(false);
			}
		};

		document.addEventListener('keydown', handleEscapeKey);

		return () => {
			document.removeEventListener('keydown', handleEscapeKey);
		};
	}, [isPickerOpen]);

	const handlePickerOpen = () => {
		setIsPickerOpen((prevState) => !prevState);
	};

	return (
		<>
			<div className="ptr-color-picker">
				<Button
					onClick={handlePickerOpen}
					variant="secondary"
					className="color-picker__button"
				>
					<ColorIndicator colorValue={color || defaultColor} />
					{label}
				</Button>
				{isPickerOpen && (
					<div className="ptr-color-picker__palette">
						<ColorPicker
							color={color || defaultColor}
							onChange={(newColor) => {
								onColorChange(newColor);
							}}
							enableAlpha
							defaultValue={defaultColor}
						/>
					</div>
				)}

				<input
					type="hidden"
					name={id}
					value={color || defaultColor}
				/>
			</div>
			<PickerOverlay />
		</>
	);
}
