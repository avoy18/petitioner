import { memo, useMemo, useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ConditionalLogic from '@admin/components/ConditionalLogic';
import type { ConditionGroup, FieldOption, AvailableFields } from '@admin/components/ConditionalLogic/consts';
import { getFieldLabels } from '../utilities';
import { FiltersWrapper } from './styled';
import { EXCLUDED_FIELDS, type FiltersProps } from './consts';
import { normalizeDefaultValues } from '@admin/sections/EditFields/AdvancedSettings';

const Filters = ({
	validCount,
	logic,
	onLogicChange,
	submissionExample,
}: FiltersProps) => {
	const [showFilters, setShowFilters] = useState(false);
	const potentialLabels = getFieldLabels();

	const handleLogicChange = (newValue: ConditionGroup) => {
		onLogicChange(newValue);
		setShowFilters(false);
	};

	const availableFields = useMemo(() => {
		const defaultValues = normalizeDefaultValues(
			window.petitionerData.default_values
		);

		return Object.keys(submissionExample)
			.map((key) => {
				if (EXCLUDED_FIELDS.includes(key)) {
					return null;
				}

				const label =
					potentialLabels?.[key as keyof typeof potentialLabels];

				if (!label) {
					return null;
				}

				const field: FieldOption = {
					value: key,
					label,
					inputType: 'text',
				};

				if (key === 'country') {
					const countries = defaultValues.country_list || [];
					field.inputType = 'select';
					field.options = countries.map((country) => ({
						label: country,
						value: country,
					}));
				}

				return field;
			})
			.filter(Boolean) as AvailableFields;
	}, [submissionExample, potentialLabels]);

	return (
		<FiltersWrapper>
			<Button
				icon="filter"
				variant={validCount > 0 ? 'primary' : 'secondary'}
				onClick={() => setShowFilters(!showFilters)}
			>
				{showFilters
					? __('Hide filters', 'petitioner')
					: __('Show filters', 'petitioner')}

				<span>({validCount})</span>
			</Button>
			{showFilters && (
				<ConditionalLogic
					value={logic}
					onChange={handleLogicChange}
					availableFields={availableFields}
				/>
			)}
		</FiltersWrapper>
	);
};

export default memo(Filters);
