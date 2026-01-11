import { useState } from '@wordpress/element';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import type { BuilderField } from '../consts';
import {
	TextControl,
	CheckboxControl,
	Modal,
	Button,
} from '@wordpress/components';
import { useEditFormContext } from '@admin/context/EditFormContext';
import { __ } from '@wordpress/i18n';
import OptionList from '@admin/components/OptionList';

const CountrySettings = () => {
	const { formState } = useEditFormContext();
	const { formBuilderFields, updateFormBuilderFields, builderEditScreen } =
		useFormBuilderContext();
	const countryList = formState.default_values?.country_list || [];
	const [editCountryList, setEditCountryList] = useState(false);

	return (
		<>
			<Button
				onClick={() => setEditCountryList(true)}
				variant="tertiary"
				icon="edit"
			>
				{__('Customize country list', 'petitioner')}
			</Button>
			{editCountryList && (
				<Modal
					title={__('Customize country list', 'petitioner')}
					onRequestClose={() => setEditCountryList(false)}
					size="large"
				>
					<OptionList
						options={countryList}
						onOptionsChange={(newValues) => {
							console.log('onOptionsChange', newValues);
						}}
					/>
				</Modal>
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
