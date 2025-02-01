import React from 'react';

import {
	TextControl,
	SelectControl,
	TabPanel,
	Dashicon,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import Submissions from './Submissions';
import { useState, useCallback } from 'react';

const petitionerLetter = document.getElementById('petitionerLetterArea');

export default function FormFields(props) {
	const {
		title = '',
		send_to_representative = false,
		email = '',
		cc_emails = '',
		goal = 0,
		show_country = false,
		subject = '',
		require_approval = false,
		approval_state = 'approved',
	} = window.petitionerData;

	const [activeTab, setActiveTab] = useState('petition-details');

	const [formState, setFormState] = useState({
		title,
		send_to_representative,
		email,
		cc_emails,
		goal,
		show_country,
		subject,
		require_approval,
		approval_state,
	});

	const updateActiveTab = useCallback((tabName) => {
		setActiveTab(tabName);
	}, []);

	// Utility function to update state
	const updateFormState = (key, value) => {
		setFormState((prevState) => ({
			...prevState,
			[key]: value,
		}));
	};

	const tabs = [
		{
			name: 'petition-details',
			title: (
				<>
					<Dashicon icon="email-alt" /> Petition details
				</>
			),
			className: 'petition-tablink petition-tablink--petition',
		},
		{
			name: 'form-settings',
			title: (
				<>
					<Dashicon icon="welcome-write-blog" />
					Form settings
				</>
			),
			className: 'petition-tablink petition-tablink--form',
		},
		{
			name: 'submissions',
			title: (
				<>
					<Dashicon icon="editor-ul" />
					Submissions
				</>
			),
			className: 'petition-tablink petition-tablink--form',
		},
	];

	const handleTabSelect = (tabName) => {
		updateActiveTab(tabName);
		if (petitionerLetter === null) return;

		petitionerLetter.style.display =
			tabName === 'petition-details' ? 'block' : 'none';
	};

	return (
		<>
			<TabPanel onSelect={handleTabSelect} tabs={tabs}>
				{(tab) => <></>}
			</TabPanel>

			<div className={`petitioner-tab-content`}>
				<div
					className={`petitioner-tab petitioner-tab ${activeTab === 'petition-details' ? 'active' : ''}`}
				>
					<p>
						<TextControl
							style={{ width: '100%' }}
							required
							label="Petition Title *"
							value={formState.title}
							name="petitioner_title"
							id="petitioner_title"
							onChange={(value) =>
								updateFormState('title', value)
							}
						/>
					</p>

					<p>
						<input
							checked={formState.send_to_representative}
							type="checkbox"
							name="petitioner_send_to_representative"
							id="petitioner_send_to_representative"
							className="widefat"
							onChange={(e) =>
								updateFormState(
									'send_to_representative',
									e.target.checked
								)
							}
						/>
						<label htmlFor="petitioner_send_to_representative">
							Send this email to representative?
						</label>
					</p>

					<p>
						<TextControl
							style={{ width: '100%' }}
							required
							type="text"
							label="Petition target email *"
							value={formState.email}
							name="petitioner_email"
							id="petitioner_email"
							onChange={(value) =>
								updateFormState('email', value)
							}
						/>
					</p>

					<p>
						<TextControl
							style={{ width: '100%' }}
							type="text"
							label="Petition CC emails"
							value={formState.cc_emails}
							help="(can have multiple - separated by comma)"
							name="petitioner_cc_emails"
							id="petitioner_cc_emails"
							onChange={(value) =>
								updateFormState('cc_emails', value)
							}
						/>
					</p>

					<p>
						<TextControl
							style={{ width: '100%' }}
							type="text"
							required
							label="Petition subject *"
							value={formState.subject}
							name="petitioner_subject"
							id="petitioner_subject"
							onChange={(value) =>
								updateFormState('subject', value)
							}
						/>
					</p>
				</div>
				<div
					className={`petitioner-tab petitioner-tab ${activeTab === 'form-settings' ? 'active' : ''}`}
				>
					<p>
						<TextControl
							style={{ width: '100%' }}
							required
							type="number"
							label="Signature goal *"
							value={formState.goal}
							name="petitioner_goal"
							id="petitioner_goal"
							help="Select your target submission number. You can disable this in the general settings"
							onChange={(value) => updateFormState('goal', value)}
						/>
					</p>

					<p>
						<input
							checked={formState.show_country}
							type="checkbox"
							name="petitioner_show_country"
							id="petitioner_show_country"
							className="widefat"
							onChange={(e) =>
								updateFormState(
									'show_country',
									e.target.checked
								)
							}
						/>
						<label htmlFor="petitioner_show_country">
							Show country field?
						</label>
					</p>

					<p>
						<input
							checked={formState.require_approval}
							type="checkbox"
							name="petitioner_require_approval"
							id="petitioner_require_approval"
							className="widefat"
							onChange={(e) => {
								const isChecked = e.target.checked;
								updateFormState('require_approval', isChecked);

								window.petitionerData.require_approval =
									isChecked;
								// Trigger custom event
								const evt = new CustomEvent(
									'onPtrApprovalChange',
									{
										detail: {
											requireApproval: isChecked,
										},
									}
								);
								window.dispatchEvent(evt);
							}}
						/>
						<label htmlFor="petitioner_require_approval">
							Require approval for submissions?
						</label>
						<br />
						<small>
							When enabled, submissions will be saved as drafts
							and will require approval before being published.
						</small>
					</p>

					{formState.require_approval && (
						<p>
							<SelectControl
								value={formState.approval_state}
								id="petitioner_approval_state"
								name="petitioner_approval_state"
								label="Default approval state"
								options={[
									{
										value: 'Confirmed',
										label: 'Confirmed by default',
									},
									{
										value: 'Declined',
										label: 'Needs approval by default',
									},
								]}
								onChange={(value) => {
									updateFormState('approval_state', value);

									window.petitionerData.approval_state =
										value;
									// Trigger custom event
									const evt = new CustomEvent(
										'onPtrApprovalChange',
										{
											detail: {
												approvalState: value,
											},
										}
									);
									window.dispatchEvent(evt);
								}}
							/>
						</p>
					)}
				</div>
				<div
					className={`petitioner-tab ${activeTab === 'submissions' ? 'active' : ''}`}
				>
					<Submissions formID={window.petitionerData.form_id} />
				</div>
			</div>
		</>
	);
}
