import { __ } from '@wordpress/i18n';
import { Button, Modal } from '@wordpress/components';
import { useCallback, useMemo, useState } from '@wordpress/element';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import OptionList from '@admin/components/OptionList';

import type { SelectField, OptionItem } from '../consts';

const CountrySettings = ({
	defaultCountries = [],
}: {
	defaultCountries?: OptionItem[];
}) => {
	const { formBuilderFields, updateFormBuilderFields } =
		useFormBuilderContext();

	const [editCountryList, setEditCountryList] = useState(false);

	const initialCountryList = useMemo(() => {
		if (
			(formBuilderFields['country'] as SelectField)?.options?.length > 0
		) {
			return (formBuilderFields['country'] as SelectField)?.options;
		}

		return defaultCountries;
	}, [formBuilderFields['country']]);

	const [countryList, setCountryList] =
		useState<OptionItem[]>(initialCountryList);

	const onSave = useCallback(() => {
		updateFormBuilderFields('country', {
			...formBuilderFields['country'],
			options: countryList,
		} as SelectField); /* Country is always a select field */

		setEditCountryList(false);
	}, [countryList]);

	const onCancel = useCallback(() => {
		setEditCountryList(false);
	}, []);

	const onResetToDefault = useCallback(() => {
		setCountryList(defaultCountries);
	}, [defaultCountries]);

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
					<Button variant="tertiary" onClick={onResetToDefault}>
						{__('Reset to default', 'petitioner')}
					</Button>
					<OptionList
						options={countryList}
						onOptionsChange={(newOrder) => setCountryList(newOrder)}
					/>
				</Modal>
			)}
		</>
	);
};

export default CountrySettings;
