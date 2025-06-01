import { Dashicon } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import Submissions from './Submissions';
import FormSettings from './FormSettings';
import FormBuilder from './FormBuilder';
import PetitionDetails from './PetitionDetails';
import BottomCallout from './BottomCallout';
import AdvancedSettings from './AdvancedSettings';
import { EditFormContextProvider } from '@admin/context/EditFormContext';

import Tabs from '@admin/components/shared/Tabs';

function EditFieldsComponent() {
	const tabs = useMemo(
		() => [
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
						<Dashicon icon="welcome-write-blog" /> Form fields
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
		],
		[]
	);

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
