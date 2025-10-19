import { useCallback, useState, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Card,
	CardDivider,
	CardHeader,
	CardBody,
	CardFooter,
	__experimentalText as Text,
	__experimentalHeading as Heading,
	Button,
	Modal,
} from '@wordpress/components';
import { getExportURL } from '../utilities';

export default function ExportModal({
	onClose = () => {},
}: {
	onClose: () => void;
}) {
	return (
		<Modal
			size="fill"
			title={__('Export submissions', 'petitioner-theme')}
			onRequestClose={onClose}
		>
			<Card>
				<CardHeader>
					<Heading>Preparing to export 200 submissions</Heading>
				</CardHeader>
				<CardBody>
					<Button variant="primary" href={getExportURL()}>
						{__('Export entries as CSV', 'petitioner')}
					</Button>
				</CardBody>
			</Card>
		</Modal>
	);
}
