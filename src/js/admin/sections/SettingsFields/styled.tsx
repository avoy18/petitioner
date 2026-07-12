import styled from 'styled-components';
import { SPACINGS, BREAKPOINTS } from '@admin/theme';

export const SettingsContainer = styled.div.attrs({ className: 'petitioner-settings-box' })``;

export const VisualSettingsLayout = styled.div`
	display: flex;
	gap: 20px;
	align-items: flex-start;
`;

export const MainContent = styled.div`
	flex: 1 1 60%;
	max-width: 800px;
`;

export const SidebarContent = styled.div`
	flex: 1 1 40%;
	min-width: 400px;
	position: sticky;
	top: 40px;
`;

export const SizingGrid = styled.div`
	display: grid;
	gap: ${SPACINGS.lg};
	grid-template-columns: 1fr;
	grid-auto-rows: min-content;

	@media (min-width: ${BREAKPOINTS.xl}px) {
		grid-template-columns: repeat(2, 250px);
	}
`
