import styled from 'styled-components';
import { Button, CardBody } from '@wordpress/components';
import { SPACINGS } from '@admin/theme';
import NoticeSystem from '@admin/components/NoticeSystem';

export const StyledCardBody = styled(CardBody)`
    padding-block: ${SPACINGS['4xl']} ${SPACINGS['2xl']} !important;
`;

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

export const NoticeSystemWrapper = styled(NoticeSystem)`
    position: absolute;
    --notice-system-z-index: 9999;
	--notice-system-top: ${SPACINGS.md};

    .components-notice {
        padding: ${SPACINGS.xs} ${SPACINGS.xs};
    }
`;