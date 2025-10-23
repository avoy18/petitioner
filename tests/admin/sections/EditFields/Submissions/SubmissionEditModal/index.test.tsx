import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import SubmissionEditModal from '@admin/sections/EditFields/Submissions/SubmissionEditModal';

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
	it('Modal renders', () => {
		render(
			<SubmissionEditModal
				onSave={() => {}}
				onClose={() => {}}
				onDelete={() => {}}
				submission={mockSubmission}
			></SubmissionEditModal>
		);

        expect(screen.getByText('John')).toBeInTheDocument();
	});
});
