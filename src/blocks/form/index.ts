// @ts-expect-error WordPress block types are provided at runtime (bundled as externals)
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './Edit';

registerBlockType('petitioner/form', {
  title: __('Petitioner Form', 'petitioner'),
  icon: 'forms',
  category: 'widgets',
  edit: Edit,
  save: () => null,
});