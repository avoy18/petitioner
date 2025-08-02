// @ts-ignore
import ServerSideRender from '@wordpress/server-side-render';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { Petition, FormId, Attributes } from '../form/consts';
import form from 'dist-gutenberg/blocks/form';

export type PetitionerBlockAttributes = {
	title?: string;
	blockName: string;
	allPetitions?: Petition[];
	attributes: Attributes;
};

export default function ServerComponent({
	title = '',
	blockName = 'petitioner/form',
	attributes,
	allPetitions = [],
}: PetitionerBlockAttributes) {
	const { formId = '', newPetitionLink = '' } = attributes;

	if (!formId) {
		return (
			<div style={{ padding: '24px', background: '#efefef' }}>
				<p>
					<small>{title}</small>
				</p>
				<p>
					{__(
						'Use the dropdown in the block settings to select your petition.',
						'petitioner'
					)}
				</p>
			</div>
		);
	}

	if (!allPetitions.length) {
		return (
			<div style={{ padding: '24px', background: '#efefef' }}>
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
			</div>
		);
	}

	return (
		<div style={{ pointerEvents: 'none' }}>
			<ServerSideRender block={blockName} attributes={attributes} />
		</div>
	);
}
