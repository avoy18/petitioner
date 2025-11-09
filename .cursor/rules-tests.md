# Petitioner - Testing Rules

## Testing Framework

We use **Vitest** with **@testing-library/react** for component testing.

## Test File Organization

### File Naming
- Test files should mirror the source file structure
- Name test files: `ComponentName.test.tsx`
- Place tests in `tests/` directory matching the source structure

### Example Structure:
```
src/js/admin/components/ConditionalLogic/index.tsx
tests/admin/components/ConditionalLogic/index.test.tsx
```

## Test Patterns

### Basic Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Component from '@admin/components/Component';

describe('Component', () => {
	it('renders correctly', () => {
		render(<Component />);
		expect(screen.getByText('Expected Text')).toBeInTheDocument();
	});
});
```

### Testing with User Interactions
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Component from '@admin/components/Component';

describe('Component interactions', () => {
	it('handles click events', async () => {
		const user = userEvent.setup();
		const handleClick = vi.fn();
		
		render(<Component onClick={handleClick} />);
		
		await user.click(screen.getByRole('button'));
		
		expect(handleClick).toHaveBeenCalledTimes(1);
	});
});
```

### Testing with Props
```typescript
describe('Component with props', () => {
	it('displays custom text', () => {
		render(<Component text="Custom Text" />);
		expect(screen.getByText('Custom Text')).toBeInTheDocument();
	});

	it('applies custom className', () => {
		const { container } = render(<Component className="custom-class" />);
		expect(container.firstChild).toHaveClass('custom-class');
	});
});
```

### Testing State Changes
```typescript
describe('Component state', () => {
	it('updates state on interaction', async () => {
		const user = userEvent.setup();
		
		render(<Component initialCount={0} />);
		
		expect(screen.getByText('Count: 0')).toBeInTheDocument();
		
		await user.click(screen.getByText('Increment'));
		
		expect(screen.getByText('Count: 1')).toBeInTheDocument();
	});
});
```

### Testing Custom Hooks
```typescript
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCustomHook } from './hooks';

describe('useCustomHook', () => {
	it('initializes with default value', () => {
		const { result } = renderHook(() => useCustomHook());
		expect(result.current.value).toBe(0);
	});

	it('updates value', () => {
		const { result } = renderHook(() => useCustomHook());
		
		act(() => {
			result.current.setValue(5);
		});
		
		expect(result.current.value).toBe(5);
	});
});
```

### Testing with Mocks
```typescript
import { vi } from 'vitest';

describe('Component with external dependencies', () => {
	it('calls API on mount', async () => {
		const mockFetch = vi.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ data: [] }),
			})
		);
		
		global.fetch = mockFetch;
		
		render(<Component />);
		
		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledWith('/api/data');
		});
	});
});
```

## WordPress-Specific Testing

### Mocking WordPress Globals
```typescript
// In setup.ts or individual test files
global.ajaxurl = 'https://example.com/wp-admin/admin-ajax.php';
global.petitionerData = {
	nonce: 'test-nonce',
	// ... other data
};
```

### Testing i18n
```typescript
import { __ } from '@wordpress/i18n';

describe('Component with translations', () => {
	it('displays translated text', () => {
		render(<Component />);
		// Translations will use the English text in tests
		expect(screen.getByText('Apply filters')).toBeInTheDocument();
	});
});
```

### Testing WordPress Components
```typescript
import { Button } from '@wordpress/components';

describe('Component with WordPress components', () => {
	it('renders WordPress Button', () => {
		render(<Button variant="primary">Click me</Button>);
		expect(screen.getByRole('button')).toHaveTextContent('Click me');
	});
});
```

## Styled Components Testing

### Testing Styled Components
```typescript
import styled from 'styled-components';

describe('StyledComponent', () => {
	it('applies custom styles', () => {
		const StyledDiv = styled.div`
			color: red;
		`;
		
		const { container } = render(<StyledDiv>Text</StyledDiv>);
		// Note: styled-components adds class names dynamically
		expect(container.firstChild).toBeInTheDocument();
	});
});
```

## Best Practices

### ✅ DO
- Test user-facing behavior, not implementation details
- Use `screen.getByRole` over `getByTestId` when possible
- Test accessibility (ARIA labels, roles, etc.)
- Mock external dependencies (APIs, localStorage, etc.)
- Use `waitFor` for async operations
- Test error states and edge cases
- Keep tests focused and isolated
- Use descriptive test names

### ❌ DON'T
- Test internal state directly
- Over-mock (mock only what's necessary)
- Test third-party library internals
- Create brittle tests that break on minor changes
- Test styling details (leave to visual regression tools)
- Ignore accessibility in tests

## Testing Checklist

For each component, consider testing:
- [ ] Renders without errors
- [ ] Displays correct content with different props
- [ ] Handles user interactions (clicks, typing, etc.)
- [ ] Updates state correctly
- [ ] Calls callbacks with correct arguments
- [ ] Handles loading and error states
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] Handles edge cases (empty data, invalid input, etc.)

## Queries Priority

Use queries in this order (from most to least preferred):

1. **Accessible queries** (preferred):
   - `getByRole`
   - `getByLabelText`
   - `getByPlaceholderText`
   - `getByText`

2. **Semantic queries**:
   - `getByAltText`
   - `getByTitle`

3. **Test IDs** (last resort):
   - `getByTestId`

## Async Testing Patterns

### Waiting for Elements
```typescript
import { waitFor } from '@testing-library/react';

it('displays data after loading', async () => {
	render(<Component />);
	
	await waitFor(() => {
		expect(screen.getByText('Loaded data')).toBeInTheDocument();
	});
});
```

### Finding Elements that Appear
```typescript
it('shows success message', async () => {
	render(<Component />);
	
	const successMessage = await screen.findByText('Success!');
	expect(successMessage).toBeInTheDocument();
});
```

## Coverage Goals

- Aim for 80%+ code coverage
- Focus on critical paths and user flows
- Don't chase 100% coverage at the expense of test quality
- Use coverage reports to find untested code paths

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test path/to/test.test.tsx
```

