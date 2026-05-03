
import { applyFilters } from '@wordpress/hooks';
import { Dashicon } from '@wordpress/components';
import Submissions from './Submissions';
import FormBuilder from './FormBuilder';
import IntegrationArea from './IntegrationsArea';
import PetitionDetails from '@admin/sections/EditFields/PetitionDetails';
import BottomCallout from '@admin/sections/EditFields/BottomCallout';
import AdvancedSettings from '@admin/sections/EditFields/AdvancedSettings';
import Tabs from '@admin/components/Tabs';
import {
	EditFormContextProvider,
	useEditFormContext,
} from '@admin/context/EditFormContext';

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
		name: 'integrations',
		title: (
			<>
				<Dashicon icon="admin-generic" /> Integrations
			</>
		),
		className: 'petition-tablink petition-tablink--integrations',
		renderingEl: <IntegrationArea />,
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
	const { formState } = useEditFormContext();
	const { active_tab } = formState;

	const showIntegrations = applyFilters('petitioner.admin.sections.edit_fields.show_integrations', false) as boolean;
	const visibleTabs = showIntegrations ? tabs : tabs.filter(tab => tab.name !== 'integrations');

	return (
		<>
			<Tabs tabs={visibleTabs} defaultTab={active_tab} updateURL={true} />
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
