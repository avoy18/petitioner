import { useState, useCallback } from '@wordpress/element';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import type { BuilderField, SelectField } from '../consts';
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
	const { formBuilderFields, updateFormBuilderFields } =
		useFormBuilderContext();

	const defaultCountryList = formState.default_values?.country_list || [];

	const [editCountryList, setEditCountryList] = useState(false);

	const [countryList, setCountryList] = useState<string[]>(() => {
		return (
			(formBuilderFields['country'] as SelectField)?.options ||
			defaultCountryList
		);
	});

	const onSave = useCallback(() => {
		updateFormBuilderFields('country', {
			...formBuilderFields['country'],
			options: countryList,
		} as SelectField); /* Country is always a select field */

		console.log('new state', {
			...formBuilderFields['country'],
			options: countryList,
		});
		setEditCountryList(false);
	}, [countryList]);

	const onCancel = useCallback(() => {
		setEditCountryList(false);
	}, []);

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
					onRequestClose={onCancel}
					size="large"
					headerActions={
						<Button onClick={onSave} variant="primary">
							{__('Save', 'petitioner')}
						</Button>
					}
				>
					<OptionList
						options={countryList}
						onOptionsChange={setCountryList}
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
