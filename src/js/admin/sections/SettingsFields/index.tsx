import { useEffect, useRef } from '@wordpress/element';
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
	const iframeRef = useRef<HTMLIFrameElement>(null);

	// Sync settings to the iframe via postMessage
	useEffect(() => {
		if (iframeRef.current && iframeRef.current.contentWindow) {
			iframeRef.current.contentWindow.postMessage(
				{ type: 'UPDATE_SETTINGS', payload: formState },
				'*'
			);
		}
	}, [formState]);

	const previewUrl = `${ajaxurl}?action=petitioner_live_preview`;

	return (
		<div className="petitioner-settings-box" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
			<div style={{ flex: '1 1 60%', maxWidth: '800px' }}>
				<Tabs tabs={tabs} updateURL={true} defaultTab={active_tab} />
			</div>
			
			<div style={{ flex: '1 1 40%', minWidth: '400px', position: 'sticky', top: '40px' }}>
				<div style={{ border: '1px solid #ddd', borderRadius: '4px', background: '#fff', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
					<div style={{ padding: '10px 15px', background: '#f6f7f7', borderBottom: '1px solid #ddd', fontWeight: 600 }}>
						{__('Live Preview', 'petitioner')}
					</div>
					<iframe 
						ref={iframeRef}
						src={previewUrl} 
						style={{ width: '100%', height: '700px', border: 'none', display: 'block' }}
						onLoad={() => {
							// Trigger initial sync once iframe loads
							if (iframeRef.current?.contentWindow) {
								iframeRef.current.contentWindow.postMessage(
									{ type: 'UPDATE_SETTINGS', payload: formState },
									'*'
								);
							}
						}}
					/>
				</div>
			</div>
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
