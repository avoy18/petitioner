import React from 'react';
import {
	ClipboardButton,
	BaseControl,
	TextControl,
} from '@wordpress/components';
import { useState } from 'react';

export default function ShortCodeArea(): JSX.Element | undefined {
	const formID = window?.petitionerData?.form_id;
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = () => {
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 3000);
	};

	if (!formID) return;

	return (
		<p
			style={{
				marginBottom: '16px',
			}}
		>
			<BaseControl help="Use this shortcode on the frontend of your website to show the petition form">
				<BaseControl.VisualLabel>
					Your Petitioner shortcode
				</BaseControl.VisualLabel>
				<div
					style={{
						display: 'flex',
						gap: '8px',
					}}
				>
					<TextControl
						disabled
						type="text"
						name="petitioner_shortcode"
						id="petitioner_shortcode"
						value={`[petitioner-form id="${formID}"]`}
						onChange={() => {}}
						style={{
							maxWidth: '200px',
						}}
					/>

					<ClipboardButton
						// @ts-ignore
						size="compact"
						text={`[petitioner-form id="${formID}"]`}
						className="components-button is-secondary"
						onCopy={handleCopy}
					>
						{!isCopied ? 'Copy' : 'Copied!'}
					</ClipboardButton>
				</div>
			</BaseControl>
		</p>
	);
}
