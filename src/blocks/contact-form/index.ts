// @ts-expect-error WordPress block types are provided at runtime (bundled as externals)
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './Edit';

registerBlockType('petitioner/contact-form', {
	title: __('Petitioner Contact Form', 'petitioner'),
	icon: 'email',
	category: 'widgets',
	edit: Edit,
	save: () => null,
});
