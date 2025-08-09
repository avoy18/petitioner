import styled from 'styled-components';
import {
	__experimentalText as Text,
	__experimentalHeading as Heading,
} from '@wordpress/components';

export const StyledHeading = styled(Heading)`
	margin-bottom: var(--ptr-admin-spacing-sm) !important;
`;

export const StyledText = styled(Text)`
    padding-bottom: var(--ptr-admin-spacing-sm) !important;
    margin-bottom: var(--ptr-admin-spacing-sm) !important;
    border-bottom: 1px solid var(--ptr-admin-color-grey);
`;