import styled from 'styled-components';
import { Button } from '@wordpress/components';
import { SPACINGS } from '@admin/theme';

export const StyledExportButton = styled(Button)`
    width: 100%;
    text-align: center;
    font-size: 1.125rem;
    justify-content: center;
    display: flex;
    margin-top: ${SPACINGS.md};
    padding: ${SPACINGS.md};
`;

export const SummaryWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${SPACINGS.sm};
    margin-bottom: ${SPACINGS.md};
`;

export const SummaryItem = styled.div`
	font-size: 1rem;
`;

export const FiltersWrapper = styled.div`
	display: flex;
	flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
	gap: ${SPACINGS.md};
`;