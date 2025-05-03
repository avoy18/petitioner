import React from 'react';
import { createRoot } from 'react-dom/client';
import EditFields from './admin/components/EditFields';
import SettingsFields from './admin/components/SettingsFields';
import ShortcodeArea from './admin/components/ShortcodeArea';

import '../scss/admin.scss';

const jsonContainer = document.getElementById('petitioner-json-data');
window.petitionerData = jsonContainer
	? JSON.parse(jsonContainer?.textContent)
	: {};

function EditUI() {
	function FormArea() {
		return (
			<div>
				<ShortcodeArea />
				<EditFields />
			</div>
		);
	}

	const editorContainer = document.getElementById('petitioner-admin-form');

	if (editorContainer) {
		const editorRoot = createRoot(editorContainer);
		editorRoot.render(<FormArea />);
	}
}

function SettingsUI() {
	const settingsContainer = document.getElementById(
		'petitioner-settings-admin-form'
	);

	if (settingsContainer) {
		const submissionsRoot = createRoot(settingsContainer);
		submissionsRoot.render(<SettingsFields />);
	}
}

function removeLoading() {
	const loadingElement = document.querySelector('.ptr-is-loading');

	if (loadingElement) {
		loadingElement.classList.remove('ptr-is-loading');
	}
}

EditUI();

SettingsUI();

removeLoading();
