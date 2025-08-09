import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import IntegrationBox from '@admin/sections/SettingsFields/IntegrationBox';
import { within } from '@testing-library/react';

describe('IntegrationBox', () => {
	const title = 'Test Integration';
	const description = 'Test description';
	const integrationFields = (
		<div data-testid="custom-fields">Custom Fields</div>
	);

	it('renders title, description, and status inactive by default', () => {
		render(
			<IntegrationBox
				title={title}
				description={description}
				enabled={false}
			/>
		);

		expect(screen.getByText(title)).toBeInTheDocument();
		expect(screen.getByText(description)).toBeInTheDocument();
		expect(screen.getByText('Inactive')).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /configure/i })
		).toBeInTheDocument();
	});

	it('renders "Active" when enabled is true', () => {
		render(
			<IntegrationBox
				title={title}
				description={description}
				enabled={true}
			/>
		);

		expect(screen.getByText('Active')).toBeInTheDocument();
	});

	it('opens modal on "Configure" click and displays content', () => {
		render(
			<IntegrationBox
				title={title}
				description={description}
				enabled={true}
				integrationFields={integrationFields}
			/>
		);

		const configureBtn = screen.getByRole('button', { name: /configure/i });
		fireEvent.click(configureBtn);

		// Find the modal/dialog element
		const dialog = screen.getByRole('dialog');

		// Scope queries inside the modal only
		const modalWithin = within(dialog);

		expect(modalWithin.getByText(title)).toBeInTheDocument();
		expect(modalWithin.getByText(description)).toBeInTheDocument();
		expect(modalWithin.getByTestId('custom-fields')).toBeInTheDocument();

		const closeBtn = modalWithin.getByTestId('petitioner_modal_close');
		fireEvent.click(closeBtn);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});
});
