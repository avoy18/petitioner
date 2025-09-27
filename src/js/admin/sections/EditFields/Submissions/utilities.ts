import type { FetchSettings, UpdateSettings } from './consts';

export const fetchSubmissions = async ({
	action = 'fetch_submissions',
	currentPage = 1,
	formID,
	perPage = 100,
	onSuccess = (data) => {},
}: FetchSettings) => {
	if (!formID) {
		console.error('Submission fetch error: missing the form id');
		return;
	}

	const finalQuery = new URLSearchParams();

	finalQuery.set('action', `petitioner__${action}`);
	finalQuery.set('page', String(currentPage));
	finalQuery.set('form_id', String(formID));
	finalQuery.set('per_page', String(perPage));

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

	const finalData = new FormData(data);
	// finalData.append('status', newStatus);

	try {
		const request = await fetch(`${ajaxurl}?${finalQuery.toString()}`, {
			method: 'POST',
            body: finalData
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
