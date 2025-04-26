import { Dashicon } from '@wordpress/components';
import { useState, useCallback } from 'react';
import Tabs from '../shared/Tabs';
import VisualSettings from './VisualSettings';
import Integrations from './Integrations';

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
		enable_turnstile = false,
		turnstile_site_key,
		turnstile_secret_key,
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
		enable_turnstile,
		turnstile_site_key,
		turnstile_secret_key,
	});

	const updateFormState = useCallback((key, value) => {
		setFormState((prevState) => ({ ...prevState, [key]: value }));
	}, []);

	const tabs = [
		{
			name: 'visual',
			title: (
				<>
					<Dashicon icon="visibility" /> Visual settings
				</>
			),
			className: 'petition-tablink',
			renderingEl: (
				<VisualSettings
					formState={formState}
					updateFormState={updateFormState}
				/>
			),
		},
		{
			name: 'integrations',
			title: (
				<>
					<Dashicon icon="admin-generic" /> Integrations
				</>
			),
			className: 'petition-tablink',
			renderingEl: (
				<Integrations
					formState={formState}
					updateFormState={updateFormState}
				/>
			),
		},
	];

	return (
		<div className="petitioner-settings-box">
			<Tabs tabs={tabs} />
		</div>
	);
}
