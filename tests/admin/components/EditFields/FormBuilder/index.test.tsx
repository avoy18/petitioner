import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import FormBuilder from '@admin/components/EditFields/FormBuilder';

describe('Form builder fields', () => {
	const defaultPetitionerData = {
		form_id: 123,
		form_fields: {
			fname: {
				type: 'text',
				label: 'First name',
				fieldName: 'First name',
			},
			lname: { type: 'text', label: 'Last name', fieldName: 'Last name' },
			email: { type: 'email', label: 'Email', fieldName: 'Your email' },
		},
		field_order: ['fname', 'lname', 'email'],
	};

	beforeEach(() => {
		window.petitionerData = structuredClone(defaultPetitionerData);
	});

	it('The fields render from the petitionerData', () => {
		window.petitionerData = defaultPetitionerData;
		render(<FormBuilder />);

		expect(screen.getByText('First name')).toBeVisible();
		expect(screen.getByText('Last name')).toBeVisible();
		expect(screen.getByText('Email')).toBeVisible();
	});

	it('The fields use the defined order', () => {
		const customFieldOrder = ['email', 'fname', 'lname'];

		window.petitionerData = {
			...defaultPetitionerData,
			field_order: customFieldOrder,
		};

		render(<FormBuilder />);

		const fieldLabels = screen.getAllByTestId(/^ptr-fake-field-/);

		const renderedOrder = fieldLabels.map((el) => el.textContent?.trim());

		const expectedOrder = ['Email', 'First name', 'Last name'];

		expect(renderedOrder).toEqual(expectedOrder);
	});

	it('Falls back to field object key order when field_order is missing', () => {
		const { field_order, ...rest } = defaultPetitionerData;
		window.petitionerData = rest;

		render(<FormBuilder />);

		const renderedLabels = screen.getAllByTestId(/^ptr-fake-field-/);

		const renderedOrder = renderedLabels.map((el) =>
			el.textContent?.trim()
		);

		expect(renderedOrder).toEqual(['First name', 'Last name', 'Email']);
	});

	it('Clicking the form field opens the settings', async () => {
		const emailFieldData = defaultPetitionerData.form_fields.email;
		const user = userEvent.setup();
		render(<FormBuilder />);

		const labelLink = screen.getByTestId('ptr-fake-field-email');

		await user.click(labelLink);

		const settingsPanel = screen.getByTestId('ptr-builder-settings');

		const settingsPanelTitle = screen.getByTestId(
			'ptr-builder-settings-title'
		);

		expect(settingsPanelTitle.textContent).toEqual(
			`Editing: ${emailFieldData.fieldName}`
		);

		const theLabelInput =
			within(settingsPanel).getByLabelText('Field label');

		expect(theLabelInput).toBeVisible();
		expect(theLabelInput).toHaveValue(emailFieldData.label);
	});
});
