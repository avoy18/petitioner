import { Dashicon } from '@wordpress/components';
import Tabs from '@admin/components/Tabs';
import VisualSettings from './VisualSettings';
import Integrations from './Integrations';
import Labels from './Labels';
import {
	SettingsFormContextProvider,
	useSettingsFormContext,
} from '@admin/context/SettingsContext';
import { __ } from '@wordpress/i18n';

const tabs = [
	{
		name: 'visual',
		title: (
			<>
				<Dashicon icon="visibility" />{' '}
				{__('Visual Settings', 'petitioner')}
			</>
		),
		className: 'petition-tablink',
		renderingEl: <VisualSettings />,
	},
	{
		name: 'integrations',
		title: (
			<>
				<Dashicon icon="admin-generic" />{' '}
				{__('Integrations', 'petitioner')}
			</>
		),
		className: 'petition-tablink',
		renderingEl: <Integrations />,
	},
	{
		name: 'labels',
		title: (
			<>
				<Dashicon icon="editor-paste-text" />{' '}
				{__('Labels', 'petitioner')}
			</>
		),
		className: 'petition-tablink',
		renderingEl: <Labels />,
	},
];

function SettingsFieldsComponent() {
	const { formState } = useSettingsFormContext();
	const { active_tab } = formState;

	return (
		<div className="petitioner-settings-box">
			<Tabs tabs={tabs} updateURL={true} defaultTab={active_tab} />
		</div>
	);
}

export default function SettingsFields() {
	return (
		<SettingsFormContextProvider>
			<SettingsFieldsComponent />
		</SettingsFormContextProvider>
	);
}
