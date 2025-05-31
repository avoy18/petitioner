import styled from 'styled-components';

const DragHandle = styled.div.attrs(() => ({
	className: 'ptr-drag-handle',
}))`
	cursor: grab;
	padding: 4px;
	font-size: 18px;
	user-select: none;

	&:before {
		content: '⋮⋮';
        font-weight: bold;
        font-size: 18px;
		// content: '≡';
	}
`;

export default DragHandle;
