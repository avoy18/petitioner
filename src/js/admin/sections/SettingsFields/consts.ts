export type TShirtSize = '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface SettingsFormData {
	show_letter: boolean;
	show_title: boolean;
	show_goal: boolean;
	custom_css: string;
	primary_color: string;
	dark_color: string;
	grey_color: string;
	enable_recaptcha: boolean;
	recaptcha_site_key: string;
	recaptcha_secret_key: string;
	enable_hcaptcha: boolean;
	hcaptcha_site_key: string;
	hcaptcha_secret_key: string;
	enable_turnstile: boolean;
	turnstile_site_key: string;
	turnstile_secret_key: string;
	enable_akismet: boolean;
	label_overrides: Record<string, string>;
	active_tab?: string;
	border_radius: Exclude<TShirtSize, 'xl'>;
	base_font_size: Extract<TShirtSize, '' | 'xs' | 'sm' | 'md'>;
	button_font_size: Extract<TShirtSize, '' | 'xs' | 'sm' | 'md' | 'lg'>;
	field_spacing: Extract<TShirtSize, '' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'>;
	input_border_width: '' | '0px' | '1px' | '2px' | '3px';
	input_size: Extract<TShirtSize, '' | 'sm' | 'md' | 'lg' | 'xl'>;
}

export type DefaultValues = {
	colors: {
		primary: string;
		dark: string;
		grey: string;
	};
	labels: Record<string, string>;
	visual_options?: Record<string, Record<string, string>>;
};

export interface WindowSettingsData extends SettingsFormData {
	default_values?: DefaultValues;
}

export type SettingsFormContextValue = {
	formState: SettingsFormData;
	updateFormState: <K extends keyof SettingsFormData>(
		key: K,
		value: SettingsFormData[K]
	) => void;
	windowPetitionerData: WindowSettingsData;
};

export type IntegrationBoxProps = {
	title: string;
	description: string;
	enabled: boolean;
	integrationFields: React.ReactNode | null;
};

export type IntegrationConfigItem = IntegrationBoxProps & {
	name: string;
	hiddenFields: React.ReactNode | null;
};