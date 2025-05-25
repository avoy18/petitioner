import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	__experimentalText as Text,
	__experimentalHeading as Heading,
	Button,
	Modal,
	__experimentalDivider as Divider,
} from '@wordpress/components';

import { useState } from '@wordpress/element';

export default function IntegrationBox({
	title = 'reCAPTCHA',
	description = 'Google reCAPTCHA integration',
	enabled = false,
	integrationFields = null,
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
				{/* @ts-ignore */}
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
					>
						Close
					</Button>
				</Modal>
			)}
		</>
	);
}
