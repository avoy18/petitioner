import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './Edit.jsx';

registerBlockType('petitioner/submissions', {
	title: __('Petitioner Submissions', 'petitioner'),
	icon: 'forms',
	category: 'widgets',
	edit: Edit,
	save: () => null,
});
