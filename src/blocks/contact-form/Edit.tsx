// @ts-expect-error WordPress block types are provided at runtime (bundled as externals)
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
// @ts-expect-error WordPress block types are provided at runtime (bundled as externals)
import ServerSideRender from '@wordpress/server-side-render';
import { useSelect } from '@wordpress/data';
import { Button, SelectControl, PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { Petition } from '../form/consts';

type ContactFormAttributes = {
	formId: string;
	newContactFormLink?: string;
};

type EditProps = {
	attributes: ContactFormAttributes;
	setAttributes: (attrs: Partial<ContactFormAttributes>) => void;
};

const messageStyle = { padding: '24px', background: '#efefef' };

export default function Edit({ attributes, setAttributes }: EditProps) {
	const { formId, newContactFormLink } = attributes;
	const blockAtts = useBlockProps();

	const contactForms: Petition[] =
		useSelect(
			(select) =>
				// @ts-ignore
				select('core').getEntityRecords('postType', 'petitioner-contact', {
					per_page: -1,
					_fields: 'title,id',
				}),
			[]
		) || [];

	const options = [
		{ label: __('Please select your contact form', 'petitioner'), value: '' },
		...contactForms.map((form) => ({
			label:
				form.title.raw.length > 40
					? form.title.raw.substring(0, 40) + '...'
					: form.title.raw,
			value: form.id,
		})),
	];

	let content;

	if (!contactForms.length) {
		content = (
			<div style={messageStyle}>
				<p>
					<small>{__('Petitioner Contact Form', 'petitioner')}</small>
				</p>
				<p>
					{__(
						"Looks like you haven't added any contact forms yet!",
						'petitioner'
					)}
				</p>
				<Button variant="secondary" href={newContactFormLink || ''}>
					{__('Create your first contact form', 'petitioner')}
				</Button>
			</div>
		);
	} else if (!formId) {
		content = (
			<div style={messageStyle}>
				<p>
					<small>{__('Petitioner Contact Form', 'petitioner')}</small>
				</p>
				<p>
					{__(
						'Use the dropdown in the block settings to select your contact form.',
						'petitioner'
					)}
				</p>
			</div>
		);
	} else {
		content = (
			<div style={{ pointerEvents: 'none' }}>
				<ServerSideRender
					block="petitioner/contact-form"
					attributes={{ formId }}
				/>
			</div>
		);
	}

	return (
		<div {...blockAtts}>
			<InspectorControls>
				<PanelBody>
					<SelectControl
						label={__('Selected contact form', 'petitioner')}
						value={formId}
						options={options}
						onChange={(value) => setAttributes({ formId: value })}
					/>
				</PanelBody>
			</InspectorControls>

			{content}
		</div>
	);
}
