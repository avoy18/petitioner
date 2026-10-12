import type { OptionItem } from '@admin/sections/EditFields/FormBuilder/consts';

export function normalizeCountryList(value: unknown): OptionItem[] {
	if (!Array.isArray(value)) {
		return [];
	}

	const seen = new Set<string>();
	const countries: OptionItem[] = [];

	value.forEach((item) => {
		if (
			typeof item !== 'object' ||
			item === null ||
			!('value' in item) ||
			!('label' in item) ||
			typeof item.value !== 'string' ||
			typeof item.label !== 'string' ||
			item.value === '' ||
			seen.has(item.value)
		) {
			return;
		}

		seen.add(item.value);
		countries.push({ value: item.value, label: item.label });
	});

	return countries;
}

export function normalizedCountryList(rawDefaults: unknown): OptionItem[] {
	if (
		typeof rawDefaults !== 'object' ||
		rawDefaults === null ||
		!('country_list' in rawDefaults)
	) {
		return [];
	}

	return normalizeCountryList(rawDefaults.country_list);
}
