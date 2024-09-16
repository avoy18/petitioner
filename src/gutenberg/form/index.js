// import Edit from './Edit';
// // import Save from './Save';
// const { registerBlockType } = wp.blocks;
// const { __ } = wp.i18n;
// // import './style.scss'; // Frontend styles
// // import './editor.scss'; // Editor styles

// registerBlockType('petitioner/form', {
//   title: __('Petitioner Form', 'petitioner'),
//   category: 'widgets',
//   edit: Edit,
//   save: () => null
// });


import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './Edit.jsx';
// import Save from './Save';
// import './style.scss'; // Include styles if you have them

// Register the block
registerBlockType('petitioner/form', {
  title: __('Petitioner Form', 'petitioner'),
  icon: 'forms',
  category: 'widgets',
  edit: Edit,  // React component for the editor view
  save: () => null,  // React component for the frontend view
});