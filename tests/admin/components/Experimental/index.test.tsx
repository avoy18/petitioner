import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@wordpress/components', () => ({
    __esModule: true,
    __experimentalText: undefined,
    __experimentalHeading: undefined,
    __experimentalDivider: undefined,
}));

vi.mock('@admin/theme', () => ({
    __esModule: true,
    SPACINGS: {
        lg: 'var(--ptr-admin-spacing-lg, 16px)',
    },
}));

import { Text, Heading, Divider } from '@admin/components/Experimental';

describe('ExperimentalElements - Fallbacks', () => {
    it('Text renders fallback span when experimental not available', () => {
        render(<Text>Hello World</Text>);
        const element = screen.getByText('Hello World');
        expect(element.tagName).toBe('SPAN');
    });

    it('Text passes through props to fallback', () => {
        render(<Text className="custom-class" data-testid="text">Content</Text>);
        const element = screen.getByTestId('text');
        expect(element).toHaveClass('custom-class');
    });

    it('Heading renders fallback h2 when experimental not available', () => {
        render(<Heading>Title</Heading>);
        const element = screen.getByText('Title');
        expect(element.tagName).toBe('H2');
    });

    it('Divider renders fallback hr with default margin', () => {
        const { container } = render(<Divider />);
        const hr = container.querySelector('hr');
        expect(hr).toBeInTheDocument();
        expect(hr).toHaveStyle({ margin: 'var(--ptr-admin-spacing-lg, 16px) 0' });
    });

    it('Divider respects custom style prop', () => {
        const { container } = render(<Divider style={{ margin: '24px 0' }} />);
        const hr = container.querySelector('hr');
        expect(hr).toHaveStyle({ margin: '24px 0' });
    });
});