import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import SubmissionEditModal from '@admin/sections/EditFields/Submissions/SubmissionEditModal';
import { FormBuilderContextProvider } from '@admin/context/FormBuilderContext';
const mockSubmission = {
	id: '1',
	fname: 'John',
	lname: 'Doe',
	email: 'john@example.com',
	country: 'US',
	salutation: null,
	bcc_yourself: '0' as const,
	newsletter: '0' as const,
	hide_name: '0' as const,
	accept_tos: '1' as const,
	submitted_at: '2024-01-15',
	approval_status: 'Confirmed' as const,
	confirmation_token: 'test-token',
	form_id: 111,
};

const defaultBuilderConfig = {
	builder_config: {
		defaults: {
			fname: { fieldKey: 'fname', label: 'First Name', type: 'text' },
			lname: { fieldKey: 'lname', label: 'Last Name', type: 'text' },
			email: { fieldKey: 'email', label: 'Email', type: 'text' },
		},
		draggable: [],
	},
	form_fields: {},
};

function renderModal(props = {}) {
	const defaultProps = {
		onSave: vi.fn(),
		onClose: vi.fn(),
		onDelete: vi.fn(),
		submission: mockSubmission,
		...props,
	};

	return render(
		<FormBuilderContextProvider>
			<SubmissionEditModal {...defaultProps} />
		</FormBuilderContextProvider>
	);
}

describe('SubmissionEditModal', () => {
	beforeEach(() => {
		window.petitionerData = structuredClone(defaultBuilderConfig) as any;
	});

	it('renders the modal with submission details title', () => {
		renderModal();
		expect(screen.getByText('Submission details')).toBeInTheDocument();
	});

	it('renders the submission field values', () => {
		renderModal();
		expect(screen.getByText('John')).toBeInTheDocument();
		expect(screen.getByText('Doe')).toBeInTheDocument();
		expect(screen.getByText('john@example.com')).toBeInTheDocument();
	});

	it('renders field labels from the context', () => {
		renderModal();
		// Labels come from getAllPossibleFields — "First name" not "First Name"
		const strongElements = document.querySelectorAll('strong');
		const labelTexts = Array.from(strongElements).map((el) => el.textContent);
		expect(labelTexts.some((t) => t?.includes('First name'))).toBe(true);
		expect(labelTexts.some((t) => t?.includes('Last name'))).toBe(true);
	});

	it('renders Save and Delete buttons', () => {
		renderModal();
		expect(
			screen.getByRole('button', { name: /save/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /delete/i })
		).toBeInTheDocument();
	});

	it('has Save button disabled by default (no changes)', () => {
		renderModal();
		const saveButton = screen.getByRole('button', { name: /save/i });
		expect(saveButton).toBeDisabled();
	});

	it('shows edit buttons for each editable field', () => {
		renderModal();
		const editButtons = screen.getAllByText('Edit');
		expect(editButtons.length).toBeGreaterThan(0);
	});

	it('enters edit mode when edit button is clicked', async () => {
		const user = userEvent.setup();
		renderModal();

		const editButtons = screen.getAllByText('Edit');
		await user.click(editButtons[0]);

		// Should show a "Done" button instead of "Edit"
		expect(screen.getByText('Done')).toBeInTheDocument();
	});

	it('calls onSave with updated data when Save is clicked', async () => {
		const user = userEvent.setup();
		const mockOnSave = vi.fn();
		renderModal({ onSave: mockOnSave });

		// Click edit on the first field (fname)
		const editButtons = screen.getAllByText('Edit');
		await user.click(editButtons[0]);

		// Find the input that appeared and change its value
		const input = screen.getByDisplayValue('John');
		await user.clear(input);
		await user.type(input, 'Jane');

		// Click done
		await user.click(screen.getByText('Done'));

		// Save button should now be enabled
		const saveButton = screen.getByRole('button', { name: /save/i });
		expect(saveButton).not.toBeDisabled();

		await user.click(saveButton);

		expect(mockOnSave).toHaveBeenCalledTimes(1);
		expect(mockOnSave).toHaveBeenCalledWith(
			expect.objectContaining({ fname: 'Jane' })
		);
	});

	it('prompts confirmation on delete', async () => {
		const user = userEvent.setup();
		const mockOnDelete = vi.fn();
		const confirmSpy = vi
			.spyOn(window, 'confirm')
			.mockReturnValue(true);

		renderModal({ onDelete: mockOnDelete });

		const deleteButton = screen.getByRole('button', { name: /delete/i });
		await user.click(deleteButton);

		expect(confirmSpy).toHaveBeenCalled();
		expect(mockOnDelete).toHaveBeenCalledWith('1');

		confirmSpy.mockRestore();
	});

	it('does not delete when confirmation is cancelled', async () => {
		const user = userEvent.setup();
		const mockOnDelete = vi.fn();
		const confirmSpy = vi
			.spyOn(window, 'confirm')
			.mockReturnValue(false);

		renderModal({ onDelete: mockOnDelete });

		const deleteButton = screen.getByRole('button', { name: /delete/i });
		await user.click(deleteButton);

		expect(confirmSpy).toHaveBeenCalled();
		expect(mockOnDelete).not.toHaveBeenCalled();

		confirmSpy.mockRestore();
	});

	it('enables Save button after editing a field', async () => {
		const user = userEvent.setup();
		renderModal();

		// Save should be disabled initially
		expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();

		// Edit a field
		const editButtons = screen.getAllByText('Edit');
		await user.click(editButtons[0]);

		const input = screen.getByDisplayValue('John');
		await user.clear(input);
		await user.type(input, 'Changed');

		await user.click(screen.getByText('Done'));

		// Save should now be enabled
		expect(
			screen.getByRole('button', { name: /save/i })
		).not.toBeDisabled();
	});
});
