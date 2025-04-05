import React from 'react';
import { createRoot } from 'react-dom/client';
import FormFields from './admin/components/FormFields/';
import ShortcodeArea from './admin/components/ShortcodeArea';

// import AV_Petitioner_Submissions_Table from "./admin/petitions-table";
import '../scss/admin.scss';
// new AV_Petitioner_Submissions_Table();

function FormArea() {
	return (
		<div>
			<ShortcodeArea />
			<FormFields />
		</div>
	);
}

const editorContainer = document.getElementById('petitioner-admin-form');
const jsonContainer = document.getElementById('petitioner-json-data');
window.petitionerData = jsonContainer ? JSON.parse(jsonContainer?.textContent) : {};

if (editorContainer) {
	const editorRoot = createRoot(editorContainer);
	editorRoot.render(<FormArea />);
}

// const settingsContainer = document.getElementById(
// 	'petitioner-settings-container'
// );

// if (settingsContainer) {
// 	const submissionsRoot = createRoot(settingsContainer);
// 	submissionsRoot.render(() => <>Settings!</>);
// }

// const submissionsContainer = document.getElementById("petitioner-submissions-container");

// if (submissionsContainer) {
//     const submissionsRoot = createRoot(submissionsContainer);
//     submissionsRoot.render(<Submissions formID={window.petitionerData.form_id} />);
// }

const loadingElement = document.querySelector('.ptr-is-loading');

if (loadingElement) {
	loadingElement.classList.remove('ptr-is-loading');
}
