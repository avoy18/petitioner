import React from 'react';

import {
	TabPanel,
	Dashicon,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { useState, useCallback, useRef, useMemo } from 'react';
import Submissions from './Submissions';
import FormSettings from './FormSettings';
import PetitionDetails from './PetitionDetails';
import BottomCallout from './BottomCallout';

export default function FormFields(props) {
	const petitionerLetterRef = useRef(null);

	const {
		title = '',
		send_to_representative = false,
		email = '',
		cc_emails = '',
		show_goal = true,
		goal = 0,
		show_country = false,
		subject = '',
		require_approval = false,
		approval_state = 'approved',
		letter = '',
		add_legal_text = false,
		consent_text = '',
		legal_text = '',
		form_id = '',
		add_consent_checkbox = false,
		override_ty_email = false,
		ty_email = '',
		ty_email_subject = '',
	} = window.petitionerData;

	const [activeTab, setActiveTab] = useState('petition-details');

	const [formState, setFormState] = useState({
		title,
		send_to_representative,
		email,
		cc_emails,
		show_goal,
		goal,
		show_country,
		subject,
		require_approval,
		approval_state,
		letter,
		add_legal_text,
		legal_text,
		add_consent_checkbox,
		consent_text,
		override_ty_email,
		ty_email,
		ty_email_subject,
	});

	const updateFormState = useCallback((key, value) => {
		setFormState((prevState) => ({ ...prevState, [key]: value }));
	}, []);

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
			},
			{
				name: 'form-settings',
				title: (
					<>
						<Dashicon icon="welcome-write-blog" /> Form settings
					</>
				),
				className: 'petition-tablink',
			},
			{
				name: 'submissions',
				title: (
					<>
						<Dashicon icon="editor-ul" /> Submissions
					</>
				),
				className: 'petition-tablink',
			},
		],
		[]
	);

	const handleTabSelect = useCallback((tabName) => {
		setActiveTab(tabName);
		if (petitionerLetterRef.current) {
			petitionerLetterRef.current.style.display =
				tabName === 'petition-details' ? 'block' : 'none';
		}
	}, []);

	return (
		<>
			<TabPanel onSelect={handleTabSelect} tabs={tabs}>
				{(tab) => <></>}
			</TabPanel>

			<div className={`petitioner-tab-content`}>
				<div
					className={`petitioner-tab petitioner-tab ${activeTab === 'petition-details' ? 'active' : ''}`}
				>
					<PetitionDetails
						formState={formState}
						updateFormState={updateFormState}
					/>
				</div>
				<div
					className={`petitioner-tab petitioner-tab ${activeTab === 'form-settings' ? 'active' : ''}`}
				>
					<FormSettings
						formState={formState}
						updateFormState={updateFormState}
					/>
				</div>
				<div
					className={`petitioner-tab ${activeTab === 'submissions' ? 'active' : ''}`}
				>
					<Submissions formID={window.petitionerData.form_id} />
				</div>
			</div>

			<BottomCallout />
		</>
	);
}
