import { useState } from '@wordpress/element';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import type { BuilderField } from '../consts';
import {
	TextControl,
	CheckboxControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useEditFormContext } from '@admin/context/EditFormContext';
import { __ } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';
import OptionList from '@admin/components/OptionList';

const CountrySettings = () => {
	const { formState } = useEditFormContext();
	const { formBuilderFields, updateFormBuilderFields, builderEditScreen } =
		useFormBuilderContext();
	const countryList = formState.default_values?.country_list || [];
	const [editCountryList, setEditCountryList] = useState(false);

	return (
		<>
			<ToggleControl
				label={__('Customize country list', 'petitioner')}
				checked={editCountryList}
				onChange={setEditCountryList}
				help={__('Customize the country list to show in the dropdown.', 'petitioner')}
			/>
			{editCountryList && (
				<OptionList
					maxHeight={250}
					options={countryList}
					onOptionsChange={() => {}}
					label={__('Field options', 'petitioner')}
				/>
			)}
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
