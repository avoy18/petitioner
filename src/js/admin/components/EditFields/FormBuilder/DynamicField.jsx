import PtrDraggable from '@admin/components/shared/Draggable';
import { getFieldTypeGroup } from '@admin/utilities';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';

export default function DynamicField({
	name = '',
	type = 'text',
	label = 'Field Label',
	value = '',
	placeholder = '',
	required = false,
	onDragStart = () => true,
	onDragEnd = () => true,
}) {
	const { setBuilderEditScreen, builderEditScreen } = useFormBuilderContext();

	const inputType = getFieldTypeGroup(type);

	const handleFieldEdit = (event) => {
		event.preventDefault();
		setBuilderEditScreen(name);
	};

	const isActive = builderEditScreen === name;

	const fieldClassName = `ptr-fake-field ptr-fake-field--${inputType} ${!isActive ? '' : 'ptr-fake-field--active'}`;

	let FinalField = (
		<div className={fieldClassName}>
			<p className="ptr-fake-field__label">{label}</p>
			<div className="ptr-fake-field__input">{placeholder}</div>
		</div>
	);

	if (inputType === 'checkbox') {
		FinalField = (
			<div className={fieldClassName}>
				<input
					type="checkbox"
					id={name}
					name={name}
					required={required}
				/>
				<label htmlFor={name}>{label}</label>
			</div>
		);
	} else if (inputType === 'submit') {
		FinalField = (
			<div className={fieldClassName}>
				<button>{label}</button>
			</div>
		);
	} else if (inputType === 'wysiwyg') {
		FinalField = (
			<div
				className={fieldClassName}
				dangerouslySetInnerHTML={{
					__html: value,
				}}
			></div>
		);
	}

	return (
		<PtrDraggable
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			id={'draggable_' + name}
			onClick={handleFieldEdit}
		>
			{FinalField}
		</PtrDraggable>
	);
}
