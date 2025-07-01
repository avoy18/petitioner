import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import EditFields, { tabs } from '@admin/sections/EditFields';

describe('Edit fields', () => {
	const defaultPetitionerData = {
		form_id: 123,
		form_fields: {
			fname: { type: 'text', label: 'First name' },
			lname: { type: 'text', label: 'Last name' },
			email: { type: 'email', label: 'Email' },
		},
		field_order: ['fname', 'lname', 'email'],
	};

	beforeEach(() => {
		window.petitionerData = structuredClone(defaultPetitionerData);
	});

	it('Tabs are rendered', () => {
		render(<EditFields />);

		tabs.forEach((tabObject) => {
			expect(
				screen.getByTestId(`ptr-tab-${tabObject.name}`)
			).toBeInTheDocument();
		});
	});
	// 	render(<EditFields />);

	// 	tabs.forEach((tabObject) => {
	// 		const currentTab = screen.getByTestId(`ptr-tab-${tabObject.name}`);

	// 		// expect(

	// 		// ).toBeInTheDocument();
	// 	});
	// 	// Find and click the Form builder tab
	// 	const formBuilderTab = screen.getByRole('tab', {
	// 		name: /Form builder/i,
	// 	});

	// 	await userEvent.click(formBuilderTab);

	// 	// Now assert that the content of FormBuilder is visible
	// 	// Replace this with something you know renders inside <FormBuilder />
	// 	// expect(screen.getByText(/Form builder/i)).toBeInTheDocument();
	// });
});
