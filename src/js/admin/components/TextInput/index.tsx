import InputWrapper from './../InputWrapper';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import styled from 'styled-components';

const StyledTextControl = styled(TextControl)`
	width: 100%;
`;

export default function TextInput({
	id,
	label,
	value,
	onChange,
	placeholder = '',
	type = 'text',
	required = false,
	help = '',
	...rest
}: {
	id: string;
	label: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	type?: 'text' | 'email' | 'number';
	required?: boolean;
	help?: string;
	[rest: string]: any;
}) {
	return (
		<InputWrapper>
			<StyledTextControl
				label={label}
				value={value}
				defaultValue={value}
				type={type}
				help={help}
				name={id}
				id={id}
				placeholder={placeholder}
				onChange={onChange}
				required={required}
				{...rest}
			/>
		</InputWrapper>
	);
}
