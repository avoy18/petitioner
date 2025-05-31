import { Panel, PanelBody } from '@wordpress/components';
import DndSortableProvider from '@admin/context/DndSortableProvider';
import { BuilderField, BuilderFieldMap } from '@admin/types/form-builder.types';
import BuilderSettings from './BuilderSettings';
import {
	FormBuilderContextProvider,
	DRAGGABLE_FIELD_TYPES,
	useFormBuilderContext,
} from '@admin/context/FormBuilderContext';
import SortableField from './SortableField';

function generateUniqueFieldId() {
	return `field_${Date.now()}`;
}

function createDefaultField(type: string): BuilderField {
	return {
		type,
		fieldName: `New ${type}`,
		label: `${type} field`,
		required: false,
		removable: true,
		...(type === 'checkbox' && { defaultValue: false }),
		...(type === 'text' && { placeholder: 'Placeholder text' }),
	} as BuilderField;
}

function FormBuilderComponent() {
	const {
		fieldOrder,
		setFieldOrder,
		formBuilderFields,
		addFormBuilderField,
	} = useFormBuilderContext();

	const handleFieldInsert = (id: string, position: number) => {
		// get the field type from the draggable options
		const newField = DRAGGABLE_FIELD_TYPES.find(
			(field) => field.key === id
		);

		const newFieldID = newField?.key;

		if (!newField || typeof newFieldID !== 'string') {
			console.error('Field type not found:', id);
			return;
		}

		addFormBuilderField(newFieldID, newField);

		setFieldOrder((prev) => {
			const updated = [...prev];
			updated.splice(position, 0, newFieldID);
			return updated;
		});
	};

	return (
		<DndSortableProvider
			items={fieldOrder}
			onReorder={setFieldOrder}
			onInsert={handleFieldInsert}
		>
			<input
				type="hidden"
				name="petitioner_form_fields"
				value={JSON.stringify(formBuilderFields)}
			/>
			<div
				className="ptr-form-builder"
				style={{
					display: 'flex',
					flexDirection: 'row',
					padding: '24px 16px',
				}}
			>
				<div
					className="ptr-form-builder__settings"
					style={{ width: '30%' }}
				>
					<BuilderSettings />
				</div>
				<div
					className="ptr-form-builder__form"
					style={{ width: '70%' }}
				>
					<Panel>
						<div className="ptr-form-builder__form-header">
							<h3>Form builder</h3>
							<p>
								Drag and drop fields to build your form. Click
								on each field to edit it's properties
							</p>
						</div>

						<PanelBody>
							{fieldOrder.map((fieldKey) => {
								return <SortableField id={fieldKey} />;
							})}
						</PanelBody>
					</Panel>
				</div>
			</div>
		</DndSortableProvider>
	);
}

export default function FormBuilder() {
	return (
		<FormBuilderContextProvider>
			<FormBuilderComponent />
		</FormBuilderContextProvider>
	);
}
