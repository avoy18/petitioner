import styled from 'styled-components';
import { Text, Heading } from '@admin/components/Experimental';

export const StyledHeading = styled(Heading)`
	margin-bottom: var(--ptr-admin-spacing-sm) !important;
`;

export const StyledText = styled(Text)`
    padding-bottom: var(--ptr-admin-spacing-sm) !important;
    margin-bottom: var(--ptr-admin-spacing-sm) !important;
    border-bottom: 1px solid var(--ptr-admin-color-grey);
`;