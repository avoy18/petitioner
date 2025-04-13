import {
	TabPanel,
	Dashicon,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useState, useCallback, useRef, useMemo } from 'react';
import Tabs from '../shared/Tabs';

export default function SettingsFields(props) {
	// const {

	// } = window.petitionerData;

	const [activeTab, setActiveTab] = useState('petition-details');

	const [formState, setFormState] = useState({
		//
	});

	const tabs = useMemo(
		() => [
			{
				name: 'general',
				title: (
					<>
						<Dashicon icon="email-alt" /> General
					</>
				),
				className: 'petition-tablink',
                renderingEl: <>General tab</>
			},
			{
				name: 'else',
				title: (
					<>
						<Dashicon icon="email-alt" /> Else
					</>
				),
				className: 'petition-tablink',
                renderingEl: <>Another tab</>
			},
		],
		[]
	);

	return (
		<>
			<Tabs tabs={tabs} />
		</>
	);
}
