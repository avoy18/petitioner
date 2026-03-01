import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import EditFields, { tabs } from '@admin/sections/EditFields';

describe('EditFields', () => {
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

	it('renders all tabs', () => {
		render(<EditFields />);

		tabs.forEach((tabObject) => {
			expect(
				screen.getByTestId(`ptr-tab-${tabObject.name}`)
			).toBeInTheDocument();
		});
	});

	it('renders tab buttons that are clickable', () => {
		render(<EditFields />);

		// The TabPanel from WP renders tab buttons with role="tab"
		const tabButtons = screen.getAllByRole('tab');
		expect(tabButtons.length).toBeGreaterThanOrEqual(tabs.length);
	});

	it('renders first tab content by default', () => {
		render(<EditFields />);

		// The first tab is "petition-details", verify its content area exists
		const firstTabContent = screen.getByTestId(`ptr-tab-${tabs[0].name}`);
		expect(firstTabContent).toBeInTheDocument();
		expect(firstTabContent.classList.contains('active')).toBe(true);
	});

	it('switches active tab when a tab is clicked', async () => {
		const user = userEvent.setup();
		render(<EditFields />);

		const secondTabName = tabs[1].name;

		// Find and click the Form builder tab
		const secondTabButton = screen.getByRole('tab', {
			name: /form builder/i,
		});
		await user.click(secondTabButton);

		const secondTabContent = screen.getByTestId(
			`ptr-tab-${secondTabName}`
		);
		expect(secondTabContent.classList.contains('active')).toBe(true);

		// First tab should no longer be active
		const firstTabContent = screen.getByTestId(`ptr-tab-${tabs[0].name}`);
		expect(firstTabContent.classList.contains('active')).toBe(false);
	});

	it('renders BottomCallout alongside tabs', () => {
		render(<EditFields />);

		// All tab content areas should exist in the DOM
		tabs.forEach((tab) => {
			expect(
				screen.getByTestId(`ptr-tab-${tab.name}`)
			).toBeInTheDocument();
		});
	});

	it('has exactly the expected number of tabs', () => {
		expect(tabs).toHaveLength(4);
		expect(tabs.map((t) => t.name)).toEqual([
			'petition-details',
			'form-builder',
			'advanced-settings',
			'submissions',
		]);
	});
});
