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
import {
	StyledExportButton,
	SummaryWrapper,
	SummaryItem,
	FiltersWrapper,
} from './styled';
import { getExportURL } from '../utilities';
import ConditionalLogic, {
	useConditionalLogic,
	formatLogicToString,
} from '@admin/components/ConditionalLogic';

export default function ExportModal({
	onClose = () => {},
	total = 0,
}: {
	onClose: () => void;
	total: number;
}) {
	const [showFilters, setShowFilters] = useState(false);
	const { logic, setLogic, isValid } = useConditionalLogic();

	return (
		<Modal
			size="large"
			title={__('Export submissions', 'petitioner-theme')}
			onRequestClose={onClose}
		>
			<Card>
				<CardBody>
					<SummaryWrapper>
						<SummaryItem>Total: {total}</SummaryItem>
						<SummaryItem>
							Filters: {formatLogicToString(logic)}
						</SummaryItem>
					</SummaryWrapper>

					<FiltersWrapper>
						<Button
							icon="filter"
							variant="secondary"
							onClick={() => setShowFilters(!showFilters)}
						>
							{showFilters
								? __('Hide filters', 'petitioner')
								: __('Show filters', 'petitioner')}
						</Button>
						{showFilters && (
							<ConditionalLogic
								value={logic}
								onChange={setLogic}
								availableFields={[
									{ value: 'email', label: 'Email' },
									{ value: 'name', label: 'Name' },
								]}
							/>
						)}
					</FiltersWrapper>
				</CardBody>
			</Card>
			<StyledExportButton variant="primary" href={getExportURL()}>
				{__('Export as CSV', 'petitioner')} ({total})
			</StyledExportButton>
		</Modal>
	);
}
