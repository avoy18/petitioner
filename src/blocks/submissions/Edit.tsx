// @ts-expect-error WordPress block types are provided at runtime (bundled as externals)
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
	Notice,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useCallback, useEffect, useRef } from '@wordpress/element';
import PetitionSelect from '../components/PetitionSelect';
import ServerComponent from '../components/ServerComponent';
import PetitionerSubmissions from '@js/frontend/submissions/index';
import type { PetitionerSubmissionsProps, FieldType } from './consts';
import { __ } from '@wordpress/i18n';
import { FormTokenField } from '@wordpress/components';

const instanceMap = new WeakMap<HTMLElement, PetitionerSubmissions>();

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
		availableStyles = [],
		styleEditorHints = {},
	} = attributes;

	const blockAtts = useBlockProps();
	const wrapperRef = useRef<HTMLDivElement>(null);
	const { selectBlock } = useDispatch('core/block-editor');

	useEffect(() => {
		if (!wrapperRef.current) return;

		const initBlock = () => {
			const submissionsDiv = wrapperRef.current?.querySelector(
				'.petitioner-submissions:not([data-ptr-initialized])'
			);
			if (submissionsDiv instanceof HTMLElement) {
				try {
					// Mark as initialized before construction to prevent infinite loop on failure
					submissionsDiv.dataset.ptrInitialized = 'true';
					const instance = new PetitionerSubmissions(submissionsDiv);
					instanceMap.set(submissionsDiv, instance);
				} catch (err) {
					// If data isn't ready, let it fail silently.
					// Note: This node will not be retried to prevent infinite loops.
				}
			}
		};

		// Initial check in case it's already rendered
		initBlock();

		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.removedNodes.forEach((node) => {
					if (node instanceof HTMLElement) {
						if (node.classList.contains('petitioner-submissions')) {
							instanceMap.get(node)?.destroy();
							instanceMap.delete(node);
						}
						const instances = node.querySelectorAll<HTMLElement>('.petitioner-submissions');
						instances.forEach(inst => {
							instanceMap.get(inst)?.destroy();
							instanceMap.delete(inst);
						});
					}
				});
			});
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
	const styleHint = styleEditorHints?.[style];

	const handleSelect = () => {
		selectBlock(clientId);
	};

	return (
		<div {...blockAtts} ref={wrapperRef} onClickCapture={handleSelect}>
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
						options={availableStyles}
						onChange={(value) => setAttributes({ style: value })}
						help={__(
							'Some settings below only apply to certain styles.',
							'petitioner'
						)}
					/>
					{styleHint ? (
						<Notice status="info" isDismissible={false}>
							{styleHint}
						</Notice>
					) : null}
				</PanelBody>
			</InspectorControls>
		</div>
	);
}
