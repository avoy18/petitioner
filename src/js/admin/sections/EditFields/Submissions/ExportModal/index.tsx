import { useCallback, useState, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Card,
	CardDivider,
	CardBody,
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
	const { logic, setLogic, validCount } = useConditionalLogic();

	const exportURL = useMemo(() => getExportURL(), []);

	return (
		<Modal
			size="large"
			title={__('Export submissions', 'petitioner-theme')}
			onRequestClose={onClose}
		>
			<Card>
				<CardBody>
					<SummaryWrapper>
						<SummaryItem>
							{__('Total:', 'petitioner')}{' '}
							<strong>{total}</strong>
						</SummaryItem>
						<SummaryItem>
							{__('Filters:', 'petitioner')}{' '}
							<strong>{formatLogicToString(logic)}</strong>
						</SummaryItem>
						<CardDivider />
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

							<span>({validCount})</span>
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
			<form action={exportURL} method="POST" target="_blank">
				<input
					type="hidden"
					name="conditional_logic"
					value={JSON.stringify(logic)}
				/>
				<StyledExportButton type="submit" variant="primary">
					{__('Export as CSV', 'petitioner')} ({total})
				</StyledExportButton>
			</form>
		</Modal>
	);
}
