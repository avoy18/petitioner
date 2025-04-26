import {
	__experimentalGrid as Grid,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import IntegrationBox from './IntegrationBox';
import { __ } from '@wordpress/i18n';

export default function Integrations({ formState, updateFormState }) {
	const integrations = [
		{
			name: 'recaptcha',
			title: __('Google reCAPTCHA v3', 'petitioner'),
			description: __(
				'Google reCAPTCHA integration. Use this to protect your forms from spam.',
				'petitioner'
			),
			enabled: formState.enable_recaptcha,
			integrationFields: (
				<>
					<div>
						<ToggleControl
							label="Enable reCAPTCHA v3"
							checked={formState.enable_recaptcha}
							onChange={(checked) =>
								updateFormState('enable_recaptcha', checked)
							}
						/>

						<p>
							<TextControl
								label="Site Key"
								value={formState.recaptcha_site_key}
								onChange={(value) =>
									updateFormState('recaptcha_site_key', value)
								}
								placeholder="Enter your reCAPTCHA site key"
							/>
						</p>

						<p>
							<TextControl
								label="Secret Key"
								value={formState.recaptcha_secret_key}
								onChange={(value) =>
									updateFormState(
										'recaptcha_secret_key',
										value
									)
								}
								placeholder="Enter your reCAPTCHA secret key"
							/>
						</p>
					</div>
				</>
			),
			hiddenFields: (
				<div className="ptr-hidden-fields">
					<input
						type="checkbox"
						name="petitioner_enable_recaptcha"
						checked={formState.enable_recaptcha}
					/>
					<input
						type="hidden"
						name="petitioner_recaptcha_site_key"
						value={formState.recaptcha_site_key}
					/>
					<input
						type="hidden"
						name="petitioner_recaptcha_secret_key"
						value={formState.recaptcha_secret_key}
					/>
				</div>
			),
		},
		{
			name: 'hcaptcha',
			title: __('hCaptcha', 'petitioner'),
			description: __(
				'hCaptcha integration. Use this to protect your forms from spam.',
				'petitioner'
			),
			enabled: formState.enable_hcaptcha,
			integrationFields: (
				<>
					<div>
						<ToggleControl
							label="Enable hCaptcha"
							checked={formState.enable_hcaptcha}
							onChange={(checked) =>
								updateFormState('enable_hcaptcha', checked)
							}
						/>

						<p>
							<TextControl
								label="Site Key"
								value={formState.hcaptcha_site_key}
								onChange={(value) =>
									updateFormState('hcaptcha_site_key', value)
								}
								placeholder="Enter your hcaptcha site key"
							/>
						</p>

						<p>
							<TextControl
								label="Secret Key"
								value={formState.hcaptcha_secret_key}
								onChange={(value) =>
									updateFormState(
										'hcaptcha_secret_key',
										value
									)
								}
								placeholder="Enter your hcaptcha secret key"
							/>
						</p>
					</div>
				</>
			),
			hiddenFields: (
				<div className="ptr-hidden-fields">
					<input
						type="checkbox"
						name="petitioner_enable_hcaptcha"
						checked={formState.enable_hcaptcha}
					/>
					<input
						type="hidden"
						name="petitioner_hcaptcha_site_key"
						value={formState.hcaptcha_site_key}
					/>
					<input
						type="hidden"
						name="petitioner_hcaptcha_secret_key"
						value={formState.hcaptcha_secret_key}
					/>
				</div>
			),
		},
		{
			name: 'turnstile',
			title: 'Cloudflare Turnstile',
			description:
				'Cloudflare Turnstile integration. A captcha alternative that is privacy-friendly.',
			enabled: formState.enable_turnstile,
			integrationFields: (
				<>
					<div>
						<ToggleControl
							label="Enable Turnstile"
							checked={formState.enable_turnstile}
							onChange={(checked) =>
								updateFormState('enable_turnstile', checked)
							}
						/>

						<p>
							<TextControl
								label="Site Key"
								value={formState.turnstile_site_key}
								onChange={(value) =>
									updateFormState('turnstile_site_key', value)
								}
								placeholder="Enter your Turnstile site key"
							/>
						</p>

						<p>
							<TextControl
								label="Secret Key"
								value={formState.turnstile_secret_key}
								onChange={(value) =>
									updateFormState(
										'turnstile_secret_key',
										value
									)
								}
								placeholder="Enter your Turnstile secret key"
							/>
						</p>
					</div>
				</>
			),
			hiddenFields: (
				<div className="ptr-hidden-fields">
					<input
						type="checkbox"
						name="petitioner_enable_turnstile"
						checked={formState.enable_turnstile}
					/>
					<input
						type="hidden"
						name="petitioner_turnstile_site_key"
						value={formState.turnstile_site_key}
					/>
					<input
						type="hidden"
						name="petitioner_turnstile_secret_key"
						value={formState.turnstile_secret_key}
					/>
				</div>
			),
		},
	];

	return (
		<Grid alignment="bottom" columns={3} gap={3}>
			{integrations.map((integration) => (
				<div key={integration.name}>
					<IntegrationBox {...integration} />
					{integration.hiddenFields}
				</div>
			))}
		</Grid>
	);
}
