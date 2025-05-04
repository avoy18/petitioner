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
	const { formState, updateFormState } = useEditFormContext();

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
				renderingEl: (
					<FormBuilder
						formState={formState}
						updateFormState={updateFormState}
					/>
				),
			},
			{
				name: 'petition-details',
				title: (
					<>
						<Dashicon icon="email-alt" /> Petition details
					</>
				),
				className: 'petition-tablink',
				renderingEl: (
					<PetitionDetails
						formState={formState}
						updateFormState={updateFormState}
					/>
				),
			},
			{
				name: 'form-settings',
				title: (
					<>
						<Dashicon icon="welcome-write-blog" /> Form settings
					</>
				),
				className: 'petition-tablink',
				renderingEl: (
					<FormSettings
						formState={formState}
						updateFormState={updateFormState}
					/>
				),
			},
			{
				name: 'advanced-settings',
				title: (
					<>
						<Dashicon icon="admin-settings" /> Advanced settings
					</>
				),
				className: 'petition-tablink',
				renderingEl: (
					<AdvancedSettings
						formState={formState}
						updateFormState={updateFormState}
					/>
				),
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
					<Submissions formID={window.petitionerData.form_id} />
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

export default function EditFields(props) {
	return (
		<EditFormContextProvider>
			<EditFieldsComponent />
		</EditFormContextProvider>
	);
}
