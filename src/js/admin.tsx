import { createRoot } from 'react-dom/client';
import EditFields from '@admin/sections/EditFields';
import SettingsFields from '@admin/sections/SettingsFields';
import ShortcodeArea from '@admin/sections/ShortcodeArea';

import '../scss/admin.scss';
import { safelyParseJSON } from '@js/utilities';

declare global {
	interface Window {
		petitionerData: Record<string, unknown>;
	}
}

const jsonContainer = document.getElementById('petitioner-json-data');
const rawJson = jsonContainer?.textContent || '{}';

window.petitionerData = jsonContainer
	? safelyParseJSON(rawJson)
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
