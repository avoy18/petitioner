import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import SubmissionEditModal from '@admin/sections/EditFields/Submissions/SubmissionEditModal';
import { FormBuilderContextProvider } from '@admin/context/FormBuilderContext';
const mockSubmission = {
	id: '1',
	fname: 'John',
	lname: 'Doe',
	email: 'a@a.com',
	country: 'US',
	salutation: null,
	bcc_yourself: '0' as const,
	newsletter: '0' as const,
	hide_name: '0' as const,
	accept_tos: '1' as const,
	submitted_at: '12212112',
	approval_status: 'Confirmed' as const,
	confirmation_token: 'test-token',
	form_id: 111,
};

describe('SubmissionEditModal', () => {

	beforeEach(() => {
		window.petitionerData = {
			builder_config: {
				defaults: {
					fname: { fieldKey: 'fname', label: 'First Name', type: 'text' },
					lname: { fieldKey: 'lname', label: 'Last Name', type: 'text' },
					email: { fieldKey: 'email', label: 'Email', type: 'text' },
				},
				draggable: []
			},
			form_fields: {}
		};
	});

	it('Modal renders', () => {
		render(
			<FormBuilderContextProvider>
				<SubmissionEditModal
					onSave={() => {}}
					onClose={() => {}}
					onDelete={() => {}}
					submission={mockSubmission}
				/>
			</FormBuilderContextProvider>
		);

        expect(screen.getByText('John')).toBeInTheDocument();
	});
});
