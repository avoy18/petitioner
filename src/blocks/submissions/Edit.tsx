// @ts-ignore
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
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
	const {
		formId,
		perPage = 10,
		style = 'simple',
		fields = [],
		showPagination = true,
	} = attributes;
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
				noPreview={true}
				customPreviewMessage={__(
					'Submissions will load on the frontend',
					'petitioner'
				)}
			/>
			<InspectorControls>
				<PanelBody>
					<PetitionSelect
						formId={formId}
						onChange={(el) => setAttributes({ formId: el })}
						allPetitions={allPetitions}
					/>
					<TextControl
						label={__('Submissions per page', 'petitioner')}
						value={perPage}
						onChange={(value) =>
							setAttributes({ perPage: Number(value) || 10 })
						}
						type="number"
						min={1}
					/>
					<ToggleControl
						label={__('Show pagination', 'petitioner')}
						checked={showPagination}
						onChange={(value) =>
							setAttributes({ showPagination: value })
						}
					/>
					<TextControl
						label={__('Fields to show', 'petitioner')}
						value={fields.join(', ')}
						onChange={(value) => {
							const newFields = value
								.split(',')
								.map((field) => field.trim())
								.filter((field) => field);
							setAttributes({ fields: newFields });
						}}
						type="text"
						placeholder={__(
							'separated by comma, e.g. name, country, submitted_at',
							'petitioner'
						)}
						help={__(
							'Available fields: name, country, postal_code, submitted_at',
							'petitioner'
						)}
					/>
					<SelectControl
						label={__('Style', 'petitioner')}
						value={style}
						options={[
							{
								label: __('Simple', 'petitioner'),
								value: 'simple',
							},
							{
								label: __('Table', 'petitioner'),
								value: 'table',
							},
						]}
						onChange={(value) =>
							setAttributes({
								style: value as 'simple' | 'table',
							})
						}
					/>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
