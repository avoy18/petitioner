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
import { StyledExportButton } from './styled';
import { getExportURL } from '../utilities';
import ConditionalLogic from '@admin/components/ConditionalLogic';

export default function ExportModal({
	onClose = () => {},
	total = 0,
}: {
	onClose: () => void;
	total: number;
}) {
	return (
		<Modal
			size="large"
			title={__('Export submissions', 'petitioner-theme')}
			onRequestClose={onClose}
		>
			<Card>
				<CardHeader>
					<Heading>Preparing to export {total} submissions</Heading>
				</CardHeader>
				<CardBody>
					<ConditionalLogic />
					<StyledExportButton variant="primary" href={getExportURL()}>
						{__('Export as CSV', 'petitioner')}
					</StyledExportButton>
				</CardBody>
			</Card>
		</Modal>
	);
}
