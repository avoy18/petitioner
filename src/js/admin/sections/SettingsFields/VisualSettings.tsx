import CodeEditor from '@admin/components/CodeEditor';
import ColorField from '@admin/components/ColorField';
import { useSettingsFormContext } from '@admin/context/SettingsContext';
import { SelectControl } from '@wordpress/components';

export default function VisualSettings() {
	const { formState, updateFormState, windowPetitionerData } = useSettingsFormContext();

	const defaultColors = windowPetitionerData?.default_values?.colors || {
		primary: '#000',
		dark: '#000',
		grey: '#000',
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
					Show letter on the frontend?
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
					Show petition title?
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
					Show petition goal?
				</label>
			</p>

			<hr />

			<h3 style={{ marginBottom: '0' }}>Colors</h3>
			<div className="ptr-field-panel">
				<div>
					<label>Primary color</label>
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
					<label>Dark color</label>
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
					<label>Grey color</label>
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

			<h3 style={{ marginBottom: '10px' }}>Layout & Sizing</h3>
			<div className="ptr-field-panel">
				<SelectControl
					label="Border Radius"
					value={formState?.border_radius || ''}
					options={[
						{ label: 'Default (8px)', value: '' },
						{ label: 'Sharp (2px)', value: 'xs' },
						{ label: 'Slightly Rounded (4px)', value: 'sm' },
						{ label: 'Rounded (8px)', value: 'md' },
						{ label: 'Very Rounded (16px)', value: 'lg' },
						{ label: 'Pill (999px)', value: 'full' },
					]}
					onChange={(val) => updateFormState('border_radius', val)}
				/>
				<input type="hidden" name="petitioner_border_radius" value={formState?.border_radius || ''} />
			</div>

			<div className="ptr-field-panel">
				<SelectControl
					label="Form Font Size"
					value={formState?.base_font_size || ''}
					options={[
						{ label: 'Default (14px)', value: '' },
						{ label: 'Extra Small (12px)', value: 'xs' },
						{ label: 'Small (14px)', value: 'sm' },
						{ label: 'Medium (16px)', value: 'md' },
					]}
					onChange={(val) => updateFormState('base_font_size', val)}
				/>
				<input type="hidden" name="petitioner_base_font_size" value={formState?.base_font_size || ''} />
			</div>

			<div className="ptr-field-panel">
				<SelectControl
					label="Button Font Size"
					value={formState?.button_font_size || ''}
					options={[
						{ label: 'Default (18px)', value: '' },
						{ label: 'Extra Small (12px)', value: 'xs' },
						{ label: 'Small (14px)', value: 'sm' },
						{ label: 'Medium (16px)', value: 'md' },
						{ label: 'Large (18px)', value: 'lg' },
					]}
					onChange={(val) => updateFormState('button_font_size', val)}
				/>
				<input type="hidden" name="petitioner_button_font_size" value={formState?.button_font_size || ''} />
			</div>

			<div className="ptr-field-panel">
				<SelectControl
					label="Input Border Thickness"
					value={formState?.input_border_width || ''}
					options={[
						{ label: 'Default', value: '' },
						{ label: '0px (None)', value: '0px' },
						{ label: '1px', value: '1px' },
						{ label: '2px', value: '2px' },
						{ label: '3px', value: '3px' },
					]}
					onChange={(val) => updateFormState('input_border_width', val)}
				/>
				<input type="hidden" name="petitioner_input_border_width" value={formState?.input_border_width || ''} />
			</div>

			<div className="ptr-field-panel">
				<SelectControl
					label="Field Spacing"
					value={formState?.field_spacing || ''}
					options={[
						{ label: 'Default (8px)', value: '' },
						{ label: 'Extra Small (4px)', value: 'xs' },
						{ label: 'Small (8px)', value: 'sm' },
						{ label: 'Medium (16px)', value: 'md' },
						{ label: 'Large (24px)', value: 'lg' },
						{ label: 'Extra Large (32px)', value: 'xl' },
					]}
					onChange={(val) => updateFormState('field_spacing', val)}
				/>
				<input type="hidden" name="petitioner_field_spacing" value={formState?.field_spacing || ''} />
			</div>

			<div className="ptr-field-panel">
				<SelectControl
					label="Input Size"
					value={formState?.input_size || ''}
					options={[
						{ label: 'Default (~62px)', value: '' },
						{ label: 'Small (32px)', value: 'sm' },
						{ label: 'Regular (40px)', value: 'md' },
						{ label: 'Large (48px)', value: 'lg' },
						{ label: 'Extra Large (~62px)', value: 'xl' },
					]}
					onChange={(val) => updateFormState('input_size', val)}
				/>
				<input type="hidden" name="petitioner_input_size" value={formState?.input_size || ''} />
			</div>

			<CodeEditor
				code={formState?.custom_css || ''}
				title="Custom CSS"
				help="Add your custom CSS here."
			/>
		</>
	);
}
