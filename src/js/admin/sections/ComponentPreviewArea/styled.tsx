import styled from 'styled-components';
import { COLORS, SPACINGS } from '@admin/theme';

export const ShowcaseWrapper = styled.div`
	--ptr-showcase-sidebar-width: 250px;
	--ptr-showcase-gap: ${SPACINGS.xl};
	display: flex;
	gap: var(--ptr-showcase-gap);
	margin-top: ${SPACINGS.lg};
	max-width: 95%;

	padding-inline: ${SPACINGS.xl};
	box-sizing: border-box;
`;

export const Sidebar = styled.nav`
	width: var(--ptr-showcase-sidebar-width);
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	gap: ${SPACINGS.md};

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li {
		margin-bottom: ${SPACINGS.xs};
	}

	button {
		display: block;
		width: 100%;
		padding: ${SPACINGS.sm} ${SPACINGS.md};
		background: white;
		border: 1px solid ${COLORS.grey};
		border-radius: 4px;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background: ${COLORS.light};
		}

		&.active {
			background: ${COLORS.primary};
			color: white;
			border-color: ${COLORS.primary};
		}
	}
`;

export const Content = styled.main`
	background: white;
	padding: ${SPACINGS.xl};
	border: 1px solid ${COLORS.grey};
	border-radius: 4px;
	flex-grow: 0;
	max-width: calc(100% - var(--ptr-showcase-sidebar-width) - var(--ptr-showcase-gap));
`;

export const ComponentSection = styled.section`
	margin-bottom: ${SPACINGS['2xl']};
	padding-bottom: ${SPACINGS.lg};
	border-bottom: 2px solid ${COLORS.grey};

	h1 {
		margin-top: 0;
		margin-bottom: ${SPACINGS.sm};
		font-size: 28px;
		color: ${COLORS.dark};
	}

	.component-description {
		margin: 0;
		color: ${COLORS.darkGrey};
		font-size: 16px;
	}
`;

export const StorySection = styled.section`
	margin-bottom: ${SPACINGS['3xl']};
	padding-bottom: ${SPACINGS.xl};
	border-bottom: 1px solid ${COLORS.grey};

	&:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	h3 {
		margin-top: 0;
		margin-bottom: ${SPACINGS.sm};
		color: ${COLORS.darkGrey};
		font-size: 20px;
	}

	.story-description {
		margin-top: 0;
		margin-bottom: ${SPACINGS.lg};
		color: ${COLORS.darkGrey};
		font-size: 14px;
		font-style: italic;
	}

	.story-preview {
		padding: ${SPACINGS.xl};
		background: #f9f9f9;
		border: 1px solid ${COLORS.grey};
		border-radius: 4px;
	}
`;