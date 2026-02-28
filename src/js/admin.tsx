import '../css/admin/index.css';
import { safelyParseJSON } from '@js/utilities';

import mountPages from '@admin/pages';

const jsonContainer = document.getElementById('petitioner-json-data');
const rawJson = jsonContainer?.textContent || '{}';

window.petitionerData = jsonContainer
	? safelyParseJSON(rawJson)
	: {};

mountPages();
