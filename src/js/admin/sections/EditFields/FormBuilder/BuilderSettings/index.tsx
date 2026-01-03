// import { useEditFormContext } from '@admin/context/EditFormContext';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import styled from 'styled-components';
import { applyFilters } from '@wordpress/hooks';

import EditInput from './EditInput';
import EditDropdown from './EditDropdown';
import EditCheckbox from './EditCheckbox';
import EditContent from './EditContent';
import EditSubmit from './EditSubmit';
import FieldList from './FieldList';

const screenKeys = [
	'email',
	'tel',
	'text',
	'date',
	'select',
	'checkbox',
	'wysiwyg',
	'submit',
	'textarea',
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
	const currentType = currentField?.type;

	const screens: Record<ScreenType | 'default', () => React.ReactNode> = {
		email: () => <EditInput />,
		tel: () => <EditInput />,
		text: () => <EditInput />,
		date: () => <EditInput />,
		textarea: () => <EditInput />,
		select: () => <EditDropdown />,
		checkbox: () => <EditCheckbox />,
		wysiwyg: () => <EditContent />,
		submit: () => <EditSubmit />,
		default: () => <FieldList />,
	};

	const ScreenComponent = () => {
		const DefaultComponent = screenKeys.includes(currentType as ScreenType)
			? screens[currentType as ScreenType]
			: screens.default;

		/**
		 * Apply any additional edit screen components for the current field
		 * This allows custom components to be used for specific field types or field keys
		 * 
		 * @param component The default component to be overridden
		 * @param currentField The current field being edited
		 * @param builderEditScreen The screen key of the current field
		 * @returns The final component to be rendered
		 */
		const FinalScreenComponent = applyFilters(
			'petitioner.formBuilder.editScreenComponent',
			DefaultComponent,
			currentField,
			builderEditScreen
		) as () => React.ReactNode;

		if (typeof FinalScreenComponent !== 'function') {
			return <DefaultComponent />;
		}

		return <FinalScreenComponent />;
	};

	return (
		<BuilderSettingsWrapper data-testid="ptr-builder-settings">
			{builderEditScreen != 'default' && (
				<>
					<Button
						variant="secondary"
						size="small"
						icon="arrow-left-alt2"
						onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
