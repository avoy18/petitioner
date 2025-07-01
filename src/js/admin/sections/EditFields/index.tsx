import { Dashicon } from '@wordpress/components';
import Submissions from './Submissions';
import FormBuilder from './FormBuilder';
import PetitionDetails from './PetitionDetails';
import BottomCallout from './BottomCallout';
import AdvancedSettings from './AdvancedSettings';
import Tabs from '@admin/components/Tabs';
import { EditFormContextProvider } from '@admin/context/EditFormContext';

export const tabs = [
	{
		name: 'petition-details',
		title: (
			<>
				<Dashicon icon="email-alt" /> Petition details
			</>
		),
		className: 'petition-tablink',
		renderingEl: <PetitionDetails />,
	},
	{
		name: 'form-builder',
		title: (
			<>
				<Dashicon icon="welcome-widgets-menus" /> Form builder
			</>
		),
		className: 'petition-tablink',
		renderingEl: <FormBuilder />,
	},
	{
		name: 'advanced-settings',
		title: (
			<>
				<Dashicon icon="admin-settings" /> Advanced settings
			</>
		),
		className: 'petition-tablink',
		renderingEl: <AdvancedSettings />,
	},
	{
		name: 'submissions',
		title: (
			<>
				<Dashicon icon="editor-ul" /> Submissions
			</>
		),
		className: 'petition-tablink',
		renderingEl: <Submissions />,
	},
];

function EditFieldsComponent() {
	return (
		<>
			<Tabs tabs={tabs} />
			<BottomCallout />
		</>
	);
}

export default function EditFields() {
	return (
		<EditFormContextProvider>
			<EditFieldsComponent />
		</EditFormContextProvider>
	);
}
