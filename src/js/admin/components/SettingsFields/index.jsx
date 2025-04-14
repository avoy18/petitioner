import { Dashicon } from '@wordpress/components';
import { useState, useMemo, useCallback } from 'react';
import Tabs from '../shared/Tabs';

function GeneralSettings({ formState, updateFormState }) {
	const defaultColors = window.petitionerData?.default_colors;

	function CodeEditor({ title, help }) {
		return (
			<div>
				<p>
					<label for="petitioner_custom_css">{title}</label>
					<br />
					<span>{help}</span>
				</p>
				<textarea
					name="petitioner_custom_css"
					id="petitionerCode"
					rows="10"
					cols="50"
					className="large-text code petitioner-code-editor"
				>
					{formState.custom_css}
				</textarea>
			</div>
		);
	}

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

			<CodeEditor title="Custom CSS" help="Add your custom CSS here." />
		</>
	);
}

export default function SettingsFields(props) {
	const {
		show_letter = true,
		show_title = true,
		show_goal = true,
		custom_css,
		primary_color,
		dark_color,
		grey_color,
		enable_recaptcha = false,
		recaptcha_site_key,
		recaptcha_secret_key,
		enable_hcaptcha = false,
		hcaptcha_site_key,
		hcaptcha_secret_key,
	} = window.petitionerData;

	const [formState, setFormState] = useState({
		show_letter,
		show_title,
		show_goal,
		custom_css,
		primary_color,
		dark_color,
		grey_color,
		enable_recaptcha,
		recaptcha_site_key,
		recaptcha_secret_key,
		enable_hcaptcha,
		hcaptcha_site_key,
		hcaptcha_secret_key,
	});

	const updateFormState = useCallback((key, value) => {
		setFormState((prevState) => ({ ...prevState, [key]: value }));
	}, []);

	const tabs = [
		{
			name: 'general',
			title: (
				<>
					<Dashicon icon="email-alt" /> General
				</>
			),
			className: 'petition-tablink',
			renderingEl: (
				<GeneralSettings
					formState={formState}
					updateFormState={updateFormState}
				/>
			),
		},
		{
			name: 'else',
			title: (
				<>
					<Dashicon icon="email-alt" /> Else
				</>
			),
			className: 'petition-tablink',
			renderingEl: <>Another tab</>,
		},
	];

	return (
		<>
			<Tabs tabs={tabs} />
		</>
	);
}
