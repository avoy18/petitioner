import { __ } from '@wordpress/i18n';
import type { FetchSettings, UpdateSettings } from './consts';
import {
	DRAGGABLE_FIELD_TYPES,
	DEFAULT_BUILDER_FIELDS,
} from '@admin/context/FormBuilderContext';
import type { FieldKey } from '@admin/sections/EditFields/FormBuilder/consts';

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

	finalQuery.set('action', `petitioner_fetch_submissions`);
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
}: UpdateSettings) => {
	if (!data?.id) {
		console.error('Submission fetch error: missing the submission id');
		return;
	}

	const finalQuery = new URLSearchParams();

	finalQuery.set('action', 'petitioner_update_submissions');

	const finalData = new FormData();

	Object.entries(data).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			finalData.append(key, String(value));
		}
	});
	// finalData.append('status', newStatus);

	try {
		const request = await fetch(`${ajaxurl}?${finalQuery.toString()}`, {
			method: 'POST',
			body: finalData,
		});

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

/**
 * Returns a mapping from fieldKey to label for all available form fields.
 */
export const getFieldLabels = (): Record<FieldKey, string> => {
	const combinedFields = [
		...DRAGGABLE_FIELD_TYPES,
		...Object.values(DEFAULT_BUILDER_FIELDS),
	];

	const fieldMap: Record<string, string> = {};

	combinedFields.forEach((field) => {
		if (field?.fieldKey) {
			fieldMap[field.fieldKey] = field.label;
		}
	});

	return fieldMap;
};

/**
 * Converts a given value into a human-readable string for display in submission tables.
 * - For empty/undefined/null values, returns a localized "(empty)" string.
 * - For boolean `true` or string `'1'`, returns a localized "True" string.
 * - For boolean `false` or string `'0'`, returns a localized "False" string.
 * - For all other values, returns their string representation.
 *
 * @param {unknown} val - The value to convert.
 * @returns {string} Human-readable representation of the value.
 */
export const getHumanValue = (val: unknown): string => {
	if (val === undefined || val === null || val === '') {
		return __('(empty)', 'petitioner');
	}

	if (val === true || val === '1') {
		return __('True', 'petitioner');
	}

	if (val === false || val === '0') {
		return __('False', 'petitioner');
	}

	return String(val);
};
