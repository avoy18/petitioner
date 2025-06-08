import { Dashicon } from '@wordpress/components';
import { useState, useCallback } from 'react';
import Tabs from '../shared/Tabs';
import VisualSettings from './VisualSettings';
import Integrations from './Integrations';

import { SettingsFormContextProvider } from '@admin/context/SettingsContext';

function SettingsFieldsComponent() {
	const tabs = [
		{
			name: 'visual',
			title: (
				<>
					<Dashicon icon="visibility" /> Visual settings
				</>
			),
			className: 'petition-tablink',
			renderingEl: <VisualSettings />,
		},
		{
			name: 'integrations',
			title: (
				<>
					<Dashicon icon="admin-generic" /> Integrations
				</>
			),
			className: 'petition-tablink',
			renderingEl: <Integrations />,
		},
	];

	return (
		<div className="petitioner-settings-box">
			<Tabs tabs={tabs} />
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
