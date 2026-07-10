import styled from 'styled-components';

export const PreviewCard = styled.div`
	border: 1px solid #ddd;
	border-radius: 4px;
	background: #fff;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

export const PreviewHeader = styled.div`
	padding: 10px 15px;
	background: #f6f7f7;
	border-bottom: 1px solid #ddd;
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
