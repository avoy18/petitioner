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

	it('renders all base tabs by default', () => {
		render(<EditFields />);

		const baseTabs = tabs.filter(t => t.name !== 'integrations');

		baseTabs.forEach((tabObject) => {
			expect(
				screen.getByTestId(`ptr-tab-${tabObject.name}`)
			).toBeInTheDocument();
		});

		// Verify integrations tab is NOT rendered by default
		expect(screen.queryByTestId('ptr-tab-integrations')).not.toBeInTheDocument();
	});

	it('renders base tab buttons that are clickable', () => {
		render(<EditFields />);

		const baseTabs = tabs.filter(t => t.name !== 'integrations');
		// The TabPanel from WP renders tab buttons with role="tab"
		const tabButtons = screen.getAllByRole('tab');
		expect(tabButtons.length).toBeGreaterThanOrEqual(baseTabs.length);
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


	it('has exactly the expected number of total registered tabs', () => {
		expect(tabs).toHaveLength(5);
		expect(tabs.map((t) => t.name)).toEqual([
			'petition-details',
			'form-builder',
			'advanced-settings',
			'integrations',
			'submissions',
		]);
	});

	it('renders the integrations tab when the hook returns true', () => {
		import('@wordpress/hooks').then(({ addFilter, removeFilter }) => {
			// Add filter to enable the tab
			addFilter('petitioner.admin.sections.edit_fields.show_integrations', 'test-namespace', () => true);

			const { unmount } = render(<EditFields />);
			
			// Verify it now exists
			expect(screen.getByTestId('ptr-tab-integrations')).toBeInTheDocument();
			
			// Clean up the filter for other tests
			removeFilter('petitioner.admin.sections.edit_fields.show_integrations', 'test-namespace');
			unmount();
		});
	});
});
