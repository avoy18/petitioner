import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Modal,
} from '@wordpress/components';
import { Text, Divider, Heading } from '@admin/components/Experimental';

import { useState } from '@wordpress/element';
import type { IntegrationBoxProps } from './consts';

export default function IntegrationBox({
	title = 'reCAPTCHA',
	description = 'Google reCAPTCHA integration',
	enabled = false,
	integrationFields = null,
}: IntegrationBoxProps) {
	const [isOpen, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	return (
		<>
			<Card>
				<CardHeader>
					<Heading level={4}>{title}</Heading>
				</CardHeader>
				{/* @ts-ignore react/no-unknown-property: min-height is a valid CSS property */}
				<CardBody style={{ 'min-height': '80px' }}>
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
				<Modal size="large" title={title} onRequestClose={closeModal}>
					<Text>{description}</Text>
					<Divider margin={5} />
					{integrationFields}

					<Button
						style={{ marginTop: 16 }}
						variant="secondary"
						onClick={closeModal}
						data-testid="petitioner_modal_close"
					>
						Close
					</Button>
				</Modal>
			)}
		</>
	);
}
