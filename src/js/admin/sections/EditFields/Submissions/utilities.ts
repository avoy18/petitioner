import { __ } from '@wordpress/i18n';
import { getAjaxNonce } from '@admin/utilities';
import {
	type FetchSettings,
	type UpdateSettings,
	type DeleteSettings,
	UPDATE_ACTION,
	FETCH_ACTION,
	DELETE_ACTION,
} from './consts';
import type {
	FieldKey,
	FieldType,
} from '@admin/sections/EditFields/FormBuilder/consts';
import { ALl_POSSIBLE_FIELDS } from '@admin/context/FormBuilderContext';

export const fetchSubmissions = async ({
	currentPage = 1,
	formID,
	perPage = 100,
	order,
	orderby,
	onSuccess = (data) => {},
}: FetchSettings) => {
	if (!formID) {
		console.error('Submission fetch error: missing the form id');
		return;
	}

	const finalQuery = new URLSearchParams();

	finalQuery.set('action', FETCH_ACTION);
	finalQuery.set('page', String(currentPage));
	finalQuery.set('form_id', String(formID));
	finalQuery.set('per_page', String(perPage));

	if (order && ['asc', 'desc'].indexOf(order) !== -1) {
		finalQuery.set('order', order);
	}

	if (orderby) {
		finalQuery.set('orderby', orderby);
	}

	try {
		const request = await fetch(`${ajaxurl}?${finalQuery.toString()}`);
		const response = await request.json();

		if (response.success) {
			onSuccess(response.data);
		} else {
			console.error('Failed to fetch data');
		}
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};

export const updateSubmissions = async ({
	data,
	onSuccess = () => {},
	onError = (msg: string) => {},
}: UpdateSettings) => {
	if (!data?.id) {
		console.error('Submission fetch error: missing the submission id');
		return;
	}

	const finalQuery = new URLSearchParams();

	finalQuery.set('action', UPDATE_ACTION);

	const finalData = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			finalData.append(key, String(value));
		}
	});

	finalData.append('petitioner_nonce', getAjaxNonce());

	try {
		const request = await fetch(`${ajaxurl}?${finalQuery.toString()}`, {
			method: 'POST',
			body: finalData,
		});

		const response = await request.json();

		if (response.success) {
			onSuccess(response.data);
		} else {
			onError('Failed to fetch data');
		}
	} catch (error) {
		onError('Error fetching data: ' + error);
	}
};

export const deleteSubmissions = async ({
	id,
	onSuccess,
	onError,
}: DeleteSettings) => {
	if (!id) {
		onError('Submission fetch error: missing the submission id');
		return;
	}

	const finalQuery = new URLSearchParams();

	finalQuery.set('action', DELETE_ACTION);

	const finalData = new FormData();

	finalData.append('id', String(id));
	finalData.append('petitioner_nonce', getAjaxNonce());

	try {
		const request = await fetch(`${ajaxurl}?${finalQuery.toString()}`, {
			method: 'POST',
			body: finalData,
		});

		const response = await request.json();

		if (response.success) {
			onSuccess();
		} else {
			onError('Failed to fetch data');
		}
	} catch (error) {
		onError('Error fetching data: ' + error);
	}
};

/**
 * Returns a mapping from fieldKey to label for all available form fields.
 */
export const getFieldLabels = (): Partial<Record<FieldKey, string>> => {
	const fieldMap: Record<string, string> = {};

	ALl_POSSIBLE_FIELDS.forEach((field) => {
		if (field?.fieldKey) {
			fieldMap[field.fieldKey] = field.label;
		}
	});

	return {
		...fieldMap,
		name: __('First/Last name', 'petitioner'),
		consent: __('Consent', 'petitioner'),
		submitted_at: __('Submitted at', 'petitioner'),
	};
};

/**
 * Converts a given value into a human-readable string for display in submission tables.
 * - For empty/undefined/null values, returns a localized "(empty)" string.
 * - For boolean `true` or string `'1'`, returns a localized "True" string.
 * - For boolean `false` or string `'0'`, returns a localized "False" string.
 * - For all other values, returns their string representation.
 *
 * @param {string} val - The value to convert.
 * @param {string} type - the value type
 * @returns {string} Human-readable representation of the value.
 */
export const getHumanValue = (val: string, type: string): string => {
	if (val.length === 0) {
		return __('(empty)', 'petitioner');
	}

	if (type === 'checkbox') {
		return val === '1' ? '✅' : '❌';
	}

	if (type === 'date') {
		const date = new Date(val);

		if (!isNaN(date.getTime())) {
			const dateString = date.toLocaleDateString(undefined, {
				month: 'short',
				day: 'numeric',
			});

			const timeString = date.toLocaleTimeString(undefined, {
				hour: 'numeric',
				minute: '2-digit',
				hour12: true,
			});

			return `${dateString} ${timeString}`;
		}
	}

	return val;
};

/**
 * Returns the FieldType for a given FieldKey.
 * If the key is 'submitted_at', returns 'date'.
 * Otherwise, looks up the type from the ALl_POSSIBLE_FIELDS list.
 * Falls back to 'text' if the field or type is not found.
 */
export const getSubmissionValType = (label: FieldKey): FieldType => {
	if (label === 'submitted_at') {
		return 'date';
	}

	const correctItem = ALl_POSSIBLE_FIELDS.find(
		(item) => item.fieldKey === label
	);

	return correctItem?.type || 'text';
};

export const getExportURL = () => {
	const urlString = String(window?.petitionerData?.export_url);

	if (urlString.length === 0) {
		console.warn('Petitioner warning: export url is not defined');
	}

	return urlString;
};
