import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	__experimentalText as Text,
	__experimentalHeading as Heading,
	__experimentalGrid as Grid,
	Button,
	Modal,
	__experimentalDivider as Divider,
	CheckboxControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import { useState } from '@wordpress/element';

function IntegrationBox({
	name = '',
	title = 'reCAPTCHA',
	description = 'Google reCAPTCHA integration',
	enabled = false,
	integrationFields = () => true,
}) {
	const [isOpen, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	return (
		<>
			<Card>
				<CardHeader>
					<Heading level={4}>{title}</Heading>
				</CardHeader>
				<CardBody>
					<Text>{description}</Text>
				</CardBody>
				<CardFooter>
					<Text
						as="p"
						weight="bold"
						size="subheadline"
						color={enabled ? 'green' : 'neutral'}
					>
						{enabled ? 'Active' : 'Inactive'}
					</Text>
					<Button onClick={openModal} variant="primary">
						Configure
					</Button>
				</CardFooter>
			</Card>

			{isOpen && (
				<Modal
					size="large"
					title={title}
					closeButtonLabel={close}
					onRequestClose={closeModal}
				>
					<Text>{description}</Text>
					<Divider margin={5} />
					{integrationFields}

					<Button
						style={{ marginTop: 16 }}
						variant="secondary"
						onClick={closeModal}
					>
						Close
					</Button>
				</Modal>
			)}
		</>
	);
}

export default function Integrations({ formState, updateFormState }) {
	const integrations = [
		{
			name: 'recaptcha',
			title: 'Google reCAPTCHA v3',
			description:
				'Google reCAPTCHA integration. Use this to protect your forms from spam.',
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
			title: 'hCaptcha',
			description:
				'hCaptcha integration. Use this to protect your forms from spam.',
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
