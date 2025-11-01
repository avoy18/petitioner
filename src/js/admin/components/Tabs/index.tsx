import { TabPanel } from '@wordpress/components';
import { useState, useCallback } from 'react';
import type { TabPanelProps, Tab } from './consts';
import { updateActiveTabURL } from '@admin/utilities';

export default function Tabs(props: TabPanelProps) {
	const {
		tabs,
		onTabSelect = () => {},
		defaultTab = '',
		updateURL = false,
	} = props;
	const tabKeys = tabs.map((tab) => tab.name);
	const [activeTab, setActiveTab] = useState(() => {
		return tabKeys.indexOf(defaultTab) !== -1 ? defaultTab : tabKeys[0];
	});

	const handleTabSelect = useCallback((tabName: Tab['name']) => {
		setActiveTab(tabName);
		onTabSelect(tabName, tabKeys);

		if (updateURL) {
			updateActiveTabURL(tabName, tabKeys);
		}
	}, [onTabSelect, tabKeys, updateURL]);

	return (
		<>
			<TabPanel
				onSelect={handleTabSelect}
				// @ts-ignore: extra properties like `renderingEl` are safe but not part of Gutenberg TabPanel's type
				tabs={tabs}
				initialTabName={activeTab}
			>
				{(tab) => <></>}
			</TabPanel>
			<div className={`petitioner-tab-content`}>
				{tabs.map((el) => {
					return (
						<div
							key={el.name}
							data-testid={`ptr-tab-${el.name}`}
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
