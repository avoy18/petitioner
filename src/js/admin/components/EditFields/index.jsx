import { Dashicon } from '@wordpress/components';
import { useMemo } from '@wordpress/element';
import Submissions from './Submissions';
import FormSettings from './FormSettings';
import FormBuilder from './FormBuilder';
import PetitionDetails from './PetitionDetails';
import BottomCallout from './BottomCallout';
import AdvancedSettings from './AdvancedSettings';
import {
	useEditFormContext,
	EditFormContextProvider,
} from '@admin/context/EditFormContext';

import Tabs from '@admin/components/shared/Tabs';

function EditFieldsComponent() {
	const tabs = useMemo(
		() => [
			{
				name: 'form-builder',
				title: (
					<>
						<Dashicon icon="welcome-write-blog" /> Form builder
					</>
				),
				className: 'petition-tablink',
				renderingEl: <FormBuilder />,
			},
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
				name: 'form-settings',
				title: (
					<>
						<Dashicon icon="welcome-write-blog" /> Form settings
					</>
				),
				className: 'petition-tablink',
				renderingEl: <FormSettings />,
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
				renderingEl: (
					<Submissions />
				),
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
