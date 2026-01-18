import styled from 'styled-components';
import { Button, CardBody } from '@wordpress/components';
import { SPACINGS, BREAKPOINTS } from '@admin/theme';
import NoticeSystem from '@admin/components/NoticeSystem';

const MOBILE_BREAKPOINT_QUERY = `(min-width: ${BREAKPOINTS['2xl']}px)`;

export const ExportWrapper = styled.div`
    --export-wrapper-gap: ${SPACINGS.xl};
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--export-wrapper-gap);
    
    @media ${MOBILE_BREAKPOINT_QUERY} {
        flex-direction: row;
    }
`;

export const DetailsWrapper = styled.div`
    @media ${MOBILE_BREAKPOINT_QUERY} {
        width: calc(33% - var(--export-wrapper-gap));
    }
`;

export const PreviewWrapper = styled.div`
    @media ${MOBILE_BREAKPOINT_QUERY} {
        width: calc(67% - var(--export-wrapper-gap));
    }
`;

export const StyledCardBody = styled(CardBody)`
    padding-block: ${SPACINGS['4xl']} ${SPACINGS['2xl']} !important;
`;

export const StyledExportButton = styled(Button)`
    width: 100%;
    text-align: center;
    font-size: 1.125rem;
    justify-content: center !important;
    display: flex;
    margin-top: ${SPACINGS.md};
    padding-block: ${SPACINGS.xl} !important;
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

export const NoticeSystemWrapper = styled(NoticeSystem)`
    position: absolute;
    --notice-system-z-index: 9999;
	--notice-system-top: ${SPACINGS.md};

    .components-notice {
        padding: ${SPACINGS.xs};
    }
`;

export const SampleOfSubmissionsWrapper = styled.div`
    margin-top: ${SPACINGS.md};
    display: flex;
    flex-direction: column;
    gap: ${SPACINGS.md};
`;