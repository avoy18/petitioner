import { createRoot } from '@wordpress/element';
import ComponentPreview from '@admin/sections/ComponentPreviewArea';

import '../css/admin/index.css';
import { safelyParseJSON } from '@js/utilities';

import EditUI from '@admin/pages/EditUI';
import SettingsUI from '@admin/pages/SettingsUI';

const jsonContainer = document.getElementById('petitioner-json-data');
const rawJson = jsonContainer?.textContent || '{}';

window.petitionerData = jsonContainer
	? safelyParseJSON(rawJson)
	: {};


function ComponentPreviewUI() {
	const componentPreviewContainer = document.getElementById('petitioner-component-preview');
	if (componentPreviewContainer) {
		const componentPreviewRoot = createRoot(componentPreviewContainer);
		componentPreviewRoot.render(<ComponentPreview />);
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

ComponentPreviewUI();

removeLoading();
