// @ts-expect-error WordPress block types are provided at runtime (bundled as externals)
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback, useEffect, useRef } from '@wordpress/element';
import PetitionSelect from '../components/PetitionSelect';
import ServerComponent from '../components/ServerComponent';
import PetitionerSubmissions from '@js/frontend/submissions/index';
import type { PetitionerSubmissionsProps, FieldType } from './consts';
import { __ } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';

export default function Edit(props: PetitionerSubmissionsProps) {
	const { attributes, setAttributes, clientId } = props;
	const {
		formId,
		perPage = 10,
		style = 'simple',
		fields = [],
		showPagination = true,
		hidePageNumbers = false,
		availableFields = [],
	} = attributes;
	
	const blockAtts = useBlockProps();
	const wrapperRef = useRef<HTMLDivElement>(null);
	// @ts-ignore
	const { selectBlock } = useDispatch('core/block-editor');

	useEffect(() => {
		if (!wrapperRef.current) return;

		const initBlock = () => {
			const submissionsDiv = wrapperRef.current?.querySelector(
				'.petitioner-submissions:not([data-ptr-initialized])'
			);
			if (submissionsDiv instanceof HTMLElement) {
				submissionsDiv.dataset.ptrInitialized = 'true';
				new PetitionerSubmissions(submissionsDiv);
			}
		};

		// Initial check in case it's already rendered
		initBlock();

		const observer = new MutationObserver(() => {
			initBlock();
		});

		observer.observe(wrapperRef.current, { childList: true, subtree: true });

		return () => observer.disconnect();
	}, []);

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

	const handleSelect = () => {
		selectBlock(clientId);
	};

	return (
		<div {...blockAtts} ref={wrapperRef} onClickCapture={handleSelect} style={{ minHeight: '150px' }}>
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
					{showPagination && (
						<ToggleControl
							label={__('Hide Page Numbers', 'petitioner')}
							help={__('Only show Prev/Next buttons', 'petitioner')}
							checked={hidePageNumbers}
							onChange={(value) =>
								setAttributes({ hidePageNumbers: value })
							}
						/>
					)}
					<FormTokenField
						label={__('Fields to show', 'petitioner')}
						value={fields}
						suggestions={availableFields}
						onChange={(value) => {
							setAttributes({ fields: value });
						}}
						__experimentalExpandOnFocus={true}
						placeholder={__(
							'separated by comma, e.g. name, country, submitted_at',
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
