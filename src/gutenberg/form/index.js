import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
// import Edit from './edit';
// import Save from './save';
// import './style.scss'; // Frontend styles
// import './editor.scss'; // Editor styles

registerBlockType('petitioner/form', {
  title: __('Petitioner Form', 'plugin'),
  icon: 'forms',
  category: 'widgets',
  edit: () => true,
  save: () => true,
});