import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DynamicField from './DynamicField';
import DragHandle from '@admin/components/shared/DragHandle';
import styled from 'styled-components';

const Wrapper = styled.div`
	padding-left: 24px;
	position: relative;
	border-radius: 4px;
	border: 1px solid transparent;

	&.ptr-active,
	&.ptr-active:hover {
		border: 1px solid var(--ptr-admin-color-dark);
	}

	.ptr-drag-handle {
		position: absolute;
		left: 4px;
		top: 50%;
		transform: translateY(-50%);
		opacity: 0;
	}

	&:hover {
		border: 1px dashed rgba(00, 00, 00, 0.3);
	}

	&:hover,
	&.ptr-active {
		.ptr-drag-handle {
			opacity: 1;
		}
	}
`;

type Props = {
	id: string;
	children?: React.ReactNode;
};

export default function SortableField({ id }: Props) {
	const { formBuilderFields, builderEditScreen } = useFormBuilderContext();
	const { attributes, listeners, setNodeRef, transform, isDragging } =
		useSortable({
			id,
			animateLayoutChanges: defaultAnimateLayoutChanges,
		});

	const currentField = formBuilderFields[id];

	const ptrProps = {
		name: id,
		type: currentField.type,
		label: currentField.label,
		placeholder:
			'placeholder' in currentField
				? currentField.placeholder
				: undefined,
		value: 'value' in currentField ? currentField.value : undefined,
		required: currentField.required,
		removable: currentField.removable,
		defaultValue:
			'defaultValue' in currentField
				? currentField.defaultValue
				: undefined,
	};

	const adjustedTransform = transform
		? {
				x: transform.x,
				y: transform.y,
				scaleX: 1,
				scaleY: 1,
			}
		: null;

	const style = {
		transform: CSS.Transform.toString(adjustedTransform),
		transition: '0s',
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 1000 : 'auto',
	};

	return (
		<Wrapper
			className={builderEditScreen === id ? 'ptr-active' : ''}
			ref={setNodeRef}
			style={style}
		>
			<DragHandle {...attributes} {...listeners} />
			<DynamicField {...ptrProps} />
		</Wrapper>
	);
}
