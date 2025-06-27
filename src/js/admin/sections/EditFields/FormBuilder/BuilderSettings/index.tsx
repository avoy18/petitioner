// import { useEditFormContext } from '@admin/context/EditFormContext';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { Button, TextControl } from '@wordpress/components';
import { getFieldTypeGroup } from '@admin/utilities';
import { __ } from '@wordpress/i18n';
import styled from 'styled-components';

import EditInput from './EditInput';
import EditDropdown from './EditDropdown';
import EditCheckbox from './EditCheckbox';
import EditContent from './EditContent';
import EditSubmit from './EditSubmit';
import FieldList from './FieldList';

const screenKeys = [
	'input',
	'select',
	'checkbox',
	'wysiwyg',
	'submit',
] as const;

type ScreenType = (typeof screenKeys)[number];

const BuilderSettingsWrapper = styled.div`
	padding: var(--ptr-admin-spacing-md);
	border-radius: 8px;
	border: 1px solid rgba(00, 00, 00, 0.1);
	background-color: var(--ptr-admin-color-light);
	position: relative;

	h3,
	p {
		margin-top: 0;
		margin-bottom: var(--ptr-admin-spacing-md);
	}

	button {
		margin-bottom: var(--ptr-admin-spacing-md);
	}
`;

export default function BuilderSettings() {
	const { formBuilderFields, builderEditScreen, setBuilderEditScreen } =
		useFormBuilderContext();

	const currentField = formBuilderFields[builderEditScreen];
	const currentType = getFieldTypeGroup(currentField?.type);

	const screens: Record<ScreenType | 'default', () => any> = {
		input: () => <EditInput />,
		select: () => <EditDropdown />,
		checkbox: () => <EditCheckbox />,
		wysiwyg: () => <EditContent />,
		submit: () => <EditSubmit />,
		default: () => <FieldList />,
	};

	const ScreenComponent = screenKeys.includes(currentType as ScreenType)
		? screens[currentType as ScreenType]
		: screens.default;
	console.log(builderEditScreen);
	return (
		<BuilderSettingsWrapper data-testid="ptr-builder-settings">
			{builderEditScreen != 'default' && (
				<>
					<Button
						variant="secondary"
						size="small"
						icon="arrow-left-alt2"
						onClick={(e) => {
							e.preventDefault();
							setBuilderEditScreen('default');
						}}
					>
						{__('Back', 'petitioner')}
					</Button>

					<h3 data-testid="ptr-builder-settings-title">
						{__('Editing: ', 'petitioner')}
						{currentField?.fieldName}
					</h3>

					<p>
						{__(
							'Edit the properties of this field below.',
							'petitioner'
						)}
					</p>
				</>
			)}

			<ScreenComponent />
		</BuilderSettingsWrapper>
	);
}
