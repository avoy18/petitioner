import styled from 'styled-components';

export const PreviewCard = styled.div`
	border: 1px solid var(--ptr-admin-color-grey);
	border-radius: var(--ptr-admin-wrapper-radius);
	background: #fff;
	overflow: hidden;
`;

export const PreviewHeader = styled.div`
	padding: var(--ptr-admin-spacing-md) var(--ptr-admin-spacing-lg);
	background: var(--ptr-admin-color-light);
	border-bottom: 1px solid var(--ptr-admin-color-grey);
	font-weight: 600;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const PreviewSelect = styled.select`
	max-width: 150px;
	font-size: 13px;
`;

export const PreviewIframe = styled.iframe`
	width: 100%;
	height: 700px;
	border: none;
	display: block;
`;
