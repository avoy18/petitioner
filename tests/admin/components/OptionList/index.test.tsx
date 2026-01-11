import OptionList from '@admin/components/OptionList';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('OptionList Component', () => {
	it('renders the component', () => {
		render(<OptionList label="Option List" options={['Option 1', 'Option 2', 'Option 3']} onOptionsChange={() => {}} />);
		expect(screen.getByTestId('option-list')).toBeInTheDocument();
	});
});
