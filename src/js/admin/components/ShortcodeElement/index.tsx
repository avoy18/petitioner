import {
	ClipboardButton,
	BaseControl,
	TextControl,
} from '@wordpress/components';
import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import type { ShortcodeProps } from './consts';
import InputWrapper from '@admin/components/InputWrapper';
import { ShortcodeControlInner } from './styled';

export default function ShortcodeElement({
	clipboardValue,
	label,
	help,
	fieldName = 'petitioner_shortcode',
    width = 'auto',
}: ShortcodeProps) {
	const [isCopied, setIsCopied] = useState(false);

	const handleCopy = () => {
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 3000);
	};

	return (
		<InputWrapper>
			<BaseControl help={help}>
				<BaseControl.VisualLabel>{label}</BaseControl.VisualLabel>
				<ShortcodeControlInner>
					<TextControl
						disabled
						type="text"
						name={fieldName}
						id={fieldName}
						value={clipboardValue}
						onChange={() => {}}
                        style={{ width }}
					/>

					<ClipboardButton
						// @ts-ignore
						size="compact"
						text={clipboardValue}
						className="components-button is-secondary"
						onCopy={handleCopy}
					>
						{!isCopied
							? __('Copy', 'petitioner')
							: __('Copied!', 'petitioner')}
					</ClipboardButton>
				</ShortcodeControlInner>
			</BaseControl>
		</InputWrapper>
	);
}
