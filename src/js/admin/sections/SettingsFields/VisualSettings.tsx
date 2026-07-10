import CodeEditor from '@admin/components/CodeEditor';
import ColorField from '@admin/components/ColorField';
import { useSettingsFormContext } from '@admin/context/SettingsContext';
import { SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { SettingsFormData } from './consts';

export default function VisualSettings() {
	const { formState, updateFormState, windowPetitionerData } = useSettingsFormContext();

	const defaultColors = windowPetitionerData?.default_values?.colors || {
		primary: '#000',
		dark: '#000',
		grey: '#000',
	};

	const visualOptions = windowPetitionerData?.default_values?.visual_options || {};
	
	const formatOptions = (optionsObj: Record<string, string> = {}) => {
		return Object.entries(optionsObj || {}).map(([value, label]) => ({
			label,
			value,
		}));
	};

	return (
		<>
			<p>
				<input
					checked={formState.show_letter}
					type="checkbox"
					name="petitioner_show_letter"
					id="petitioner_show_letter"
					className="widefat"
					onChange={(e) => {
						updateFormState('show_letter', e.target.checked);
					}}
				/>
				<label htmlFor="petitioner_show_letter">
					{__('Show letter on the frontend?', 'petitioner')}
				</label>
			</p>
			<p>
				<input
					checked={formState.show_title}
					type="checkbox"
					name="petitioner_show_title"
					id="petitioner_show_title"
					className="widefat"
					onChange={(e) => {
						updateFormState('show_title', e.target.checked);
					}}
				/>
				<label htmlFor="petitioner_show_title">
					{__('Show petition title?', 'petitioner')}
				</label>
			</p>
			<p>
				<input
					checked={formState.show_goal}
					type="checkbox"
					name="petitioner_show_goal"
					id="petitioner_show_goal"
					className="widefat"
					onChange={(e) => {
						updateFormState('show_goal', e.target.checked);
					}}
				/>
				<label htmlFor="petitioner_show_goal">
					{__('Show petition goal?', 'petitioner')}
				</label>
			</p>

			<hr />

			<h3 style={{ marginBottom: '0' }}>{__('Colors', 'petitioner')}</h3>
			<div className="ptr-field-panel">
				<div>
					<label>{__('Primary color', 'petitioner')}</label>
				</div>
				<ColorField
					id={'petitioner_primary_color'}
					color={formState?.primary_color}
					defaultColor={defaultColors?.primary}
					onColorChange={(newColor: string) =>
						updateFormState('primary_color', newColor)
					}
				/>
			</div>

			<div className="ptr-field-panel">
				<div>
					<label>{__('Dark color', 'petitioner')}</label>
				</div>
				<ColorField
					id={'petitioner_dark_color'}
					color={formState?.dark_color}
					defaultColor={defaultColors?.dark}
					onColorChange={(newColor: string) =>
						updateFormState('dark_color', newColor)
					}
				/>
			</div>

			<div className="ptr-field-panel">
				<div>
					<label>{__('Grey color', 'petitioner')}</label>
				</div>
				<ColorField
					id={'petitioner_grey_color'}
					color={formState?.grey_color}
					defaultColor={defaultColors?.grey}
					onColorChange={(newColor: string) =>
						updateFormState('grey_color', newColor)
					}
				/>
			</div>

			<hr />

			<h3 style={{ marginBottom: '0' }}>{__('Layout & Sizing', 'petitioner')}</h3>
			<div className="ptr-field-panel">
				<SelectControl
					label={__('Border Radius', 'petitioner')}
					value={formState?.border_radius || ''}
					options={formatOptions(visualOptions.border_radius)}
					onChange={(val) => updateFormState('border_radius', val as SettingsFormData['border_radius'])}
				/>
				<input type="hidden" name="petitioner_border_radius" value={formState?.border_radius || ''} />
			</div>

			<div className="ptr-field-panel">
				<SelectControl
					label={__('Form Font Size', 'petitioner')}
					value={formState?.base_font_size || ''}
					options={formatOptions(visualOptions.base_font_size)}
					onChange={(val) => updateFormState('base_font_size', val as SettingsFormData['base_font_size'])}
				/>
				<input type="hidden" name="petitioner_base_font_size" value={formState?.base_font_size || ''} />
			</div>

			<div className="ptr-field-panel">
				<SelectControl
					label={__('Button Font Size', 'petitioner')}
					value={formState?.button_font_size || ''}
					options={formatOptions(visualOptions.button_font_size)}
					onChange={(val) => updateFormState('button_font_size', val as SettingsFormData['button_font_size'])}
				/>
				<input type="hidden" name="petitioner_button_font_size" value={formState?.button_font_size || ''} />
			</div>

			<div className="ptr-field-panel">
				<SelectControl
					label={__('Input Border Thickness', 'petitioner')}
					value={formState?.input_border_width || ''}
					options={formatOptions(visualOptions.input_border_width)}
					onChange={(val) => updateFormState('input_border_width', val as SettingsFormData['input_border_width'])}
				/>
				<input type="hidden" name="petitioner_input_border_width" value={formState?.input_border_width || ''} />
			</div>

			<div className="ptr-field-panel">
				<SelectControl
					label={__('Field Spacing', 'petitioner')}
					value={formState?.field_spacing || ''}
					options={formatOptions(visualOptions.field_spacing)}
					onChange={(val) => updateFormState('field_spacing', val as SettingsFormData['field_spacing'])}
				/>
				<input type="hidden" name="petitioner_field_spacing" value={formState?.field_spacing || ''} />
			</div>

			<div className="ptr-field-panel">
				<SelectControl
					label={__('Input Size', 'petitioner')}
					value={formState?.input_size || ''}
					options={formatOptions(visualOptions.input_size)}
					onChange={(val) => updateFormState('input_size', val as SettingsFormData['input_size'])}
				/>
				<input type="hidden" name="petitioner_input_size" value={formState?.input_size || ''} />
			</div>

			<CodeEditor
				code={formState?.custom_css || ''}
				title={__('Custom CSS', 'petitioner')}
				help={__('Add your custom CSS here.', 'petitioner')}
			/>
		</>
	);
}
