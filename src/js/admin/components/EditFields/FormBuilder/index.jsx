import { Panel, PanelBody } from '@wordpress/components';
import { useRef } from '@wordpress/element';
import BuilderSettings from './BuilderSettings/';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { FormBuilderContextProvider } from '@admin/context/FormBuilderContext';

import DynamicField from './DynamicField';

function FormBuilderComponent() {
	const formRef = useRef(null);

	const handleDragStart = (event) => {
		formRef.current.classList.add('is-dragging');
	};

	const handleDragEnd = (event) => {
		formRef.current.classList.remove('is-dragging');
	};

	const { formBuilderFields } = useFormBuilderContext();

	const formBuilderKeys = Object.keys(formBuilderFields);

	return (
		<>
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
					ref={formRef}
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
							<div className="ptr-field-wrapper">
								{formBuilderKeys?.length > 0 &&
									formBuilderKeys.map((key) => {
										const currentField =
											formBuilderFields[key];
										return (
											<>
												<span className="ptr-visual-position"></span>
												<DynamicField
													name={key}
													type={currentField?.type}
													label={currentField?.label}
													placeholder={
														currentField?.placeholder
													}
													value={currentField?.value}
													onDragStart={handleDragStart}
													onDragEnd={handleDragEnd}
												/>
											</>
										);
									})}

								<span className="ptr-visual-position"></span>
							</div>
						</PanelBody>
					</Panel>
				</div>
			</div>
		</>
	);
}

export default function FormBuilder() {
	return (
		<FormBuilderContextProvider>
			<FormBuilderComponent />
		</FormBuilderContextProvider>
	);
}
