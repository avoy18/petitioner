import {
	createContext,
	useContext,
	useState,
	useCallback,
} from '@wordpress/element';

import type {
	WindowSettingsData,
	SettingsFormData,
	SettingsFormContextValue,
} from '@admin/sections/SettingsFields/consts';

export const SettingsFormContext =
	createContext<SettingsFormContextValue | null>(null);

const normalizeSettingsData = (
	raw: Partial<WindowSettingsData> | undefined
): WindowSettingsData => ({
	show_letter: raw?.show_letter ?? true,
	show_title: raw?.show_title ?? true,
	show_goal: raw?.show_goal ?? true,
	custom_css: raw?.custom_css ?? '',
	primary_color: raw?.primary_color ?? '',
	dark_color: raw?.dark_color ?? '',
	grey_color: raw?.grey_color ?? '',
	enable_recaptcha: raw?.enable_recaptcha ?? false,
	recaptcha_site_key: raw?.recaptcha_site_key ?? '',
	recaptcha_secret_key: raw?.recaptcha_secret_key ?? '',
	enable_hcaptcha: raw?.enable_hcaptcha ?? false,
	hcaptcha_site_key: raw?.hcaptcha_site_key ?? '',
	hcaptcha_secret_key: raw?.hcaptcha_secret_key ?? '',
	enable_turnstile: raw?.enable_turnstile ?? false,
	turnstile_site_key: raw?.turnstile_site_key ?? '',
	turnstile_secret_key: raw?.turnstile_secret_key ?? '',
	enable_akismet: raw?.enable_akismet ?? true,
	default_values: raw?.default_values ?? {
		colors: {
			primary: '',
			dark: '',
			grey: '',
		},
	},
});

export const SettingsFormContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const windowPetitionerData = normalizeSettingsData(
		window.petitionerData as Partial<WindowSettingsData>
	);

	const {
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
		enable_akismet,
	} = windowPetitionerData;

	const [formState, setFormState] = useState<SettingsFormData>({
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
		enable_akismet,
	});

	const updateFormState = useCallback(
		<K extends keyof SettingsFormData>(
			key: K,
			value: SettingsFormData[K]
		) => {
			setFormState((prevState) => ({ ...prevState, [key]: value }));
		},
		[]
	);

	return (
		<SettingsFormContext.Provider
			value={{ formState, updateFormState, windowPetitionerData }}
		>
			{children}
		</SettingsFormContext.Provider>
	);
};

export function useSettingsFormContext() {
	const context = useContext(SettingsFormContext);
	if (!context) {
		throw new Error(
			'useSettingsFormContext must be used within an FormBuilderContextProvider'
		);
	}
	return context;
}
