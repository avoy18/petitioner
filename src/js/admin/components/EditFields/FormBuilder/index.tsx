import { Panel, PanelBody } from '@wordpress/components';
import DndSortableProvider from '@admin/context/DndSortableProvider';
import BuilderSettings from './BuilderSettings';
import {
	FormBuilderContextProvider,
	DRAGGABLE_FIELD_TYPES,
	useFormBuilderContext,
} from '@admin/context/FormBuilderContext';
import SortableField from './SortableField';
import styled from 'styled-components';
import { __ } from '@wordpress/i18n';
const StyledPanel = styled(Panel)`
	margin-top: var(--ptr-admin-spacing-md, 16px);

	.components-panel__body {
		padding: 0px;
	}

	.ptr-form-builder__form {
		margin-left: var(--ptr-admin-spacing-md);
	}
`;

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
			<StyledPanel>
				<div className="ptr-form-builder__form-header">
					<h3>{__('Form builder', 'petitioner')}</h3>
					<p>
						{__(
							"Drag and drop fields to build your form. Click on each field to edit it's properties",
							'petitioner'
						)}
					</p>
				</div>

				<PanelBody>
					<input
						type="hidden"
						name="petitioner_form_fields"
						value={JSON.stringify(formBuilderFields)}
					/>
					<input
						type="hidden"
						name="petitioner_field_order"
						value={JSON.stringify(fieldOrder)}
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
							{fieldOrder.map((fieldKey) => {
								return <SortableField id={fieldKey} />;
							})}
						</div>
					</div>
				</PanelBody>
			</StyledPanel>
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
