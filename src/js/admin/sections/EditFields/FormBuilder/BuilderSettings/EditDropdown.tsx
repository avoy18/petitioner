import { useState } from '@wordpress/element';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { useEditFormContext } from '@admin/context/EditFormContext';
import type { BuilderField } from '../consts';
import { TextControl, CheckboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import CountrySettings from './CountrySettings';

const AdditionalSettings = ({
	builderEditScreen,
	draftLabelValue,
}: {
	builderEditScreen: string;
	draftLabelValue: BuilderField['label'];
}) => {
	const { formState } = useEditFormContext();

	if (builderEditScreen === 'country') {
		const defaultCountryList = formState.default_values?.country_list || [];

		return <CountrySettings defaultCountries={defaultCountryList} />;
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

			<AdditionalSettings
				builderEditScreen={builderEditScreen}
				draftLabelValue={draftLabelValue}
			/>
		</div>
	);
}
