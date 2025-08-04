// @ts-ignore
import ServerSideRender from '@wordpress/server-side-render';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { Petition, Attributes } from '../form/consts';
import styled from 'styled-components';

const StyledMessageBox = styled.div`
	padding: 24px;
	background: #efefef;
	border-radius: 4px;
	margin-bottom: 16px;
`;

export type PetitionerBlockAttributes = {
	title?: string;
	blockName: string;
	allPetitions?: Petition[];
	attributes: Attributes;
	customPreviewMessage?: React.ReactNode;
	noPreview?: boolean;
};

export default function ServerComponent({
	title = '',
	blockName = 'petitioner/form',
	attributes,
	allPetitions = [],
	customPreviewMessage,
	noPreview = false,
}: PetitionerBlockAttributes) {
	const { formId = '', newPetitionLink = '' } = attributes;

	if (!formId) {
		return (
			<StyledMessageBox>
				<p>
					<small>{title}</small>
				</p>
				<p>
					{__(
						'Use the dropdown in the block settings to select your petition.',
						'petitioner'
					)}
				</p>
			</StyledMessageBox>
		);
	}

	if (!allPetitions.length) {
		return (
			<StyledMessageBox>
				<p>
					<small>{title}</small>
				</p>
				<p>
					{__(
						"Looks like you haven't added any petitions yet!",
						'petitioner'
					)}
				</p>
				<Button variant="secondary" href={newPetitionLink || ''}>
					{__('Create your first petition', 'petitioner')}
				</Button>
			</StyledMessageBox>
		);
	}

	return (
		<div style={{ pointerEvents: 'none' }}>
			{!noPreview ? (
				<ServerSideRender block={blockName} attributes={attributes} />
			) : (
				<StyledMessageBox>
					{' '}
					<p>
						<small>{title}</small>
					</p>
					<p>{customPreviewMessage}</p>
				</StyledMessageBox>
			)}
		</div>
	);
}
