import { applyFilters } from '@wordpress/hooks';
import { Dashicon } from '@wordpress/components';
import Submissions from './Submissions';
import FormBuilder from './FormBuilder';
import IntegrationArea from './IntegrationsArea';
import PetitionDetails from '@admin/sections/EditFields/PetitionDetails';
import ContactDetails from '@admin/sections/EditFields/ContactDetails';
import BottomCallout from '@admin/sections/EditFields/BottomCallout';
import AdvancedSettings from '@admin/sections/EditFields/AdvancedSettings';
import ContactAdvancedSettings from '@admin/sections/EditFields/ContactAdvancedSettings';
import Tabs from '@admin/components/Tabs';
import {
	EditFormContextProvider,
	useEditFormContext,
} from '@admin/context/EditFormContext';

const formBuilderTab = {
	name: 'form-builder',
	title: (
		<>
			<Dashicon icon="welcome-widgets-menus" /> Form builder
		</>
	),
	className: 'petition-tablink',
	renderingEl: <FormBuilder />,
};

const integrationsTab = {
	name: 'integrations',
	title: (
		<>
			<Dashicon icon="admin-generic" /> Integrations
		</>
	),
	className: 'petition-tablink petition-tablink--integrations',
	renderingEl: <IntegrationArea />,
};

const submissionsTab = {
	name: 'submissions',
	title: (
		<>
			<Dashicon icon="editor-ul" /> Submissions
		</>
	),
	className: 'petition-tablink',
	renderingEl: <Submissions />,
};

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
	formBuilderTab,
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
	integrationsTab,
	submissionsTab,
];

export const contactTabs = [
	{
		name: 'contact-details',
		title: (
			<>
				<Dashicon icon="email-alt" /> Contact details
			</>
		),
		className: 'petition-tablink',
		renderingEl: <ContactDetails />,
	},
	formBuilderTab,
	{
		name: 'advanced-settings',
		title: (
			<>
				<Dashicon icon="admin-settings" /> Advanced settings
			</>
		),
		className: 'petition-tablink',
		renderingEl: <ContactAdvancedSettings />,
	},
	integrationsTab,
	submissionsTab,
];

function EditFieldsComponent() {
	const { formState } = useEditFormContext();
	const { active_tab, form_type } = formState;

	const formTabs = form_type === 'contact' ? contactTabs : tabs;
	const showIntegrations = applyFilters('petitioner.admin.sections.edit_fields.show_integrations', false) as boolean;
	const visibleTabs = showIntegrations ? formTabs : formTabs.filter(tab => tab.name !== 'integrations');

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
