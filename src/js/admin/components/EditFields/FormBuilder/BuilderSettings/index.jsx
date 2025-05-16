// import { useEditFormContext } from '@admin/context/EditFormContext';
import { useFormBuilderContext } from '@admin/context/FormBuilderContext';
import { Button, TextControl } from '@wordpress/components';
import { getFieldTypeGroup } from '@admin/utilities';
import { __ } from '@wordpress/i18n';

import EditInput from './EditInput';
import EditDropdown from './EditDropdown';
import EditCheckbox from './EditCheckbox';
import EditContent from './EditContent';
import EditSubmit from './EditSubmit';

export default function BuilderSettings(props) {
	const { formBuilderFields, builderEditScreen, setBuilderEditScreen } =
		useFormBuilderContext();

	const currentField = formBuilderFields[builderEditScreen];
	const currentType = getFieldTypeGroup(currentField?.type);

	const screens = {
		input: () => <EditInput />,
		select: () => <EditDropdown />,
		checkbox: () => <EditCheckbox />,
		wysiwyg: () => <EditContent />,
		submit: () => <EditSubmit />,
		default: () => <InputList />,
	};

	const ScreenComponent = screens[currentType] || screens.default;

	return (
		<div>
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

					<h4>
						{__('Editing: ', 'petitioner')}
						{currentField?.fieldName}
					</h4>
				</>
			)}

			<ScreenComponent />
		</div>
	);
}

function InputList() {
	return (
		<div
			style={{
				padding: '16px 24px 0px 0px',
			}}
		>
			Click on one of the inputs on the right to show it's field settings.
		</div>
	);
}
