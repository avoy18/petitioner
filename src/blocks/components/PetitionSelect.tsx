import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
export type PetitionSelectProps = {
	formId: string;
	onChange: (formId: string) => void;
	allPetitions?: Petition[];
};

export type Petition = {
	title: { raw: string };
	id: string;
};

export default function PetitionSelect({
	formId,
	onChange,
	allPetitions = [],
}: PetitionSelectProps) {
	const petitionOptions = [
		{ label: __('Please select your petition', 'petitioner'), value: '' },
	];

	allPetitions.forEach((el) => {
		let label = el.title.raw;

		const limit = 40;

		if (label.length > limit) {
			label = label.substring(0, limit) + '...';
		}

		const objToPush = { label, value: el.id };

		petitionOptions.push(objToPush);
	});

	return (
		<SelectControl
			label={__('Selected Petition', 'petitioner')}
			value={formId}
			options={petitionOptions}
			onChange={onChange}
		/>
	);
}
