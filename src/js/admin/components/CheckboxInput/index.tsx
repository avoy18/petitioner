import InputWrapper from '@admin/components/InputWrapper';
import type { CheckboxInputProps } from './consts';

export default function CheckboxInput(props: CheckboxInputProps) {
	const { checked, name, onChange, label, help } = props;

	return (
		<InputWrapper>
			<input
				checked={checked}
				type="checkbox"
				name={name}
				id={name}
				className="widefat"
				onChange={onChange}
			/>
			<label htmlFor={name}>
				{label}

				{help && (
					<>
						<br />
						<small>{help}</small>
					</>
				)}
			</label>
		</InputWrapper>
	);
}
