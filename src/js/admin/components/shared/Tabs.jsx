import { TabPanel } from '@wordpress/components';

import { useState, useCallback} from 'react';

export default function Tabs({ tabs, onTabSelect = () => true }) {
	const [activeTab, setActiveTab] = useState('general');

	const handleTabSelect = useCallback((tabName) => {
		setActiveTab(tabName);
        onTabSelect(tabName);
	}, []);

	return (
		<>
			<TabPanel onSelect={handleTabSelect} tabs={tabs}>
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
