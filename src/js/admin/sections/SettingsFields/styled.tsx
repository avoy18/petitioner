import styled from 'styled-components';

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
