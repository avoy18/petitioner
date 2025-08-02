// @ts-ignore
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import PetitionSelect from '../components/PetitionSelect';
import ServerComponent from '../components/ServerComponent';
import type { PetitionerSubmissionsProps } from './consts';
import { __ } from '@wordpress/i18n';

export default function Edit({
	attributes,
	setAttributes,
}: PetitionerSubmissionsProps) {
	const { formId } = attributes;
	const blockAtts = useBlockProps();

	const fetchPetitions = useCallback(() => {
		return useSelect((select) => {
			// @ts-ignore
			return select('core').getEntityRecords(
				'postType',
				'petitioner-petition',
				{
					per_page: -1,
					_fields: 'title,id',
				}
			);
		}, []);
	}, []);

	const allPetitions = fetchPetitions() || [];

	return (
		<div {...blockAtts}>
			<ServerComponent
				title={__('Petitioner Submissions', 'petitioner')}
				blockName="petitioner/submissions"
				attributes={attributes}
				allPetitions={allPetitions}
			/>
			<InspectorControls>
				<PanelBody>
					<PetitionSelect
						formId={formId}
						onChange={(el) => setAttributes({ formId: el })}
                        allPetitions={allPetitions}
					/>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
