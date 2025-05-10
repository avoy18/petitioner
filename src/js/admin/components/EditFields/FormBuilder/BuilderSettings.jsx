import { useEditFormContext } from '@admin/context/EditFormContext';
import { Button } from '@wordpress/components';

export default function BuilderSettings(props) {
	const { builderEditScreen, setBuilderEditScreen } = useEditFormContext();

	const screens = {
		input: () => <EditInput />,
		select: () => <SelectInput />,
		checkbox: () => <EditCheckbox />,
		legal: () => <EditLegal />,
		default: () => <InputList />,
	};

	const ScreenComponent = screens[builderEditScreen] || screens.default;

	return (
		<div>
			<Button
				onClick={(e) => {
					e.preventDefault();
					setBuilderEditScreen('default');
				}}
			>
				Back
			</Button>
			<ScreenComponent />
		</div>
	);
}

function InputList() {
	return <div>Input list goes here</div>;
}

function SelectInput() {
	return <div>Dropdown goes here</div>;
}

function EditInput() {
	return <div>Editing an input</div>;
}

function EditCheckbox() {
	return <div>Editing a checkbox</div>;
}

function EditLegal() {
	return <div>Editing legal text</div>;
}
