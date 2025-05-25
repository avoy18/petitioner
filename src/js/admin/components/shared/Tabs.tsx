import { TabPanel } from '@wordpress/components';
import { useState, useCallback } from 'react';
import { TabPanelProps } from '@admin/types/shared.types';

export default function Tabs(props: TabPanelProps) {
	const { tabs, onTabSelect = () => {} } = props;
	const [activeTab, setActiveTab] = useState('general');

	const handleTabSelect = useCallback((tabName: string) => {
		setActiveTab(tabName);
		onTabSelect(tabName);
	}, []);

	return (
		<>
			<TabPanel
				onSelect={handleTabSelect}
				// @ts-ignore: extra properties like `renderingEl` are safe but not part of Gutenberg TabPanel's type
				tabs={tabs}
			>
				{(tab) => <></>}
			</TabPanel>
			<div className={`petitioner-tab-content`}>
				{tabs.map((el) => {
					return (
						<div
							className={`petitioner-tab petitioner-tab ${activeTab === el.name ? 'active' : ''}`}
						>
							{el.renderingEl}
						</div>
					);
				})}
			</div>
		</>
	);
}
