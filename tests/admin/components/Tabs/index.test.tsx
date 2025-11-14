import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Tabs from '@admin/components/Tabs';
import { act } from 'react';
const tabs = [
	{
		name: 'tabOne',
		title: 'Tab title one',
		className: 'petition-tablink',
		renderingEl: <div>Tab content one</div>,
	},
	{
		name: 'tabTwo',
		title: 'Tab title two',
		className: 'petition-tablink',
		renderingEl: <div>Tab content two</div>,
	},
];

describe('Tabs sharable component', () => {
	it('Tab links are shown', () => {
		render(<Tabs tabs={tabs} onTabSelect={() => true} />);

		tabs.forEach((tabObject) => {
			expect(
				screen.getByTestId(`ptr-tab-${tabObject.name}`)
			).toBeInTheDocument();
		});
	});

	it('Tab opens on click and callback fires', async () => {
		const user = userEvent.setup();
		const mockHandleTab = vi.fn();

		render(<Tabs tabs={tabs} onTabSelect={mockHandleTab} />);

		for (const tab of tabs) {
			const tabTitleRegex = new RegExp(tab.title, 'i');
			const link = screen.getByRole('tab', { name: tabTitleRegex });

			await act(async () => {
				await user.click(link);
			});

			expect(mockHandleTab).toHaveBeenCalledWith(tab.name, tabs.map(t => t.name));

			// Check that the corresponding tab content appears
			const contentRegex = new RegExp(
				`^${tab.renderingEl.props.children}$`,
				'i'
			);

			expect(screen.getByText(contentRegex)).toBeVisible();
		}
	});
});
