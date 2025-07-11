import CodeEditor from '@admin/components/CodeEditor';
import ColorField from '@admin/components/ColorField';
import { useSettingsFormContext } from '@admin/context/SettingsContext';

export default function VisualSettings() {
	const { formState, updateFormState, windowPetitionerData } = useSettingsFormContext();
	
	const defaultColors = windowPetitionerData.default_values.colors || {
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

			<CodeEditor
				code={formState?.custom_css || ''}
				title="Custom CSS"
				help="Add your custom CSS here."
			/>
		</>
	);
}
