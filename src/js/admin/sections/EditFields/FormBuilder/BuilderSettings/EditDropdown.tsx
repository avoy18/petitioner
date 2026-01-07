import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import type { BuilderField } from '../consts';
import {
	TextControl,
	CheckboxControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useEditFormContext } from '@admin/context/EditFormContext';
import { __ } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';

const CountrySettings = () => {
	const { formState } = useEditFormContext();
	const { formBuilderFields, updateFormBuilderFields, builderEditScreen } =
		useFormBuilderContext();
	const countryList = formState.default_values?.country_list || [];

	return (
		<>
			<FormTokenField
				label={__('Manually select countries to show', 'petitioner')}
				value={formBuilderFields[builderEditScreen].country_list || []}
				suggestions={countryList}
				onChange={(tokens) =>
					updateFormBuilderFields(builderEditScreen, {
						...formBuilderFields[builderEditScreen],
						country_list: tokens,
					})
				}
			/>
		</>
	);
};

const AdditionalSettings = ({
	builderEditScreen,
	draftLabelValue,
}: {
	builderEditScreen: string;
	draftLabelValue: BuilderField['label'];
}) => {
	if (builderEditScreen === 'country') {
		return <CountrySettings />;
	}

	return null;
};

export default function EditDropdown() {
	const { formBuilderFields, updateFormBuilderFields, builderEditScreen } =
		useFormBuilderContext();

	const currentField = formBuilderFields[builderEditScreen];

	if (!currentField) {
		return null;
	}

	const [draftLabelValue, setDraftLabelValue] = useState(currentField.label);

	const onLabelEditComplete = () => {
		updateFormBuilderFields(builderEditScreen, {
			...formBuilderFields[builderEditScreen],
			label: draftLabelValue,
		});
	};

	const onRequiredEditComplete = (value: boolean) => {
		updateFormBuilderFields(builderEditScreen, {
			...formBuilderFields[builderEditScreen],
			required: Boolean(value),
		});
	};

	return (
		<div>
			<p>
				<TextControl
					label="Field label"
					value={draftLabelValue}
					onChange={setDraftLabelValue}
					onBlur={onLabelEditComplete}
				/>
			</p>

			<p>
				<CheckboxControl
					label="Required"
					checked={currentField.required}
					onChange={onRequiredEditComplete}
				/>
			</p>

			{AdditionalSettings && (
				<AdditionalSettings
					builderEditScreen={builderEditScreen}
					draftLabelValue={draftLabelValue}
				/>
			)}
		</div>
	);
}
