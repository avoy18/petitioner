# Petitioner WordPress Plugin - General Rules

## Project Overview
This is a WordPress plugin called "Petitioner" built with React, TypeScript, styled-components, and WordPress components. It provides petition/form submission management with an admin interface.

## Technology Stack
- **Frontend**: React 18+ (via @wordpress/element)
- **Styling**: styled-components with centralized theme
- **UI Components**: @wordpress/components library
- **TypeScript**: Strict mode enabled
- **Build Tool**: Vite
- **i18n**: @wordpress/i18n for translations

## File Organization

### Component Structure
```
ComponentName/
├── index.tsx       # Main component logic
├── styled.tsx      # Styled components (if needed)
├── consts.ts       # Constants and type definitions
├── hooks.tsx       # Custom hooks (if needed)
└── utilities.ts    # Helper functions (if needed)
```

### Naming Conventions
- **Components**: PascalCase (e.g., `ConditionalLogic`, `NoticeSystem`)
- **Files**: camelCase for utilities, lowercase for configs
- **Styled Components**: PascalCase with descriptive names (e.g., `FiltersWrapper`, `StyledExportButton`)
- **Hooks**: camelCase starting with 'use' (e.g., `useConditionalLogic`, `useNoticeSystem`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `EXCLUDED_FIELDS`, `DEFAULT_LOGIC`)
- **Types**: PascalCase with descriptive names (e.g., `SubmissionItem`, `FiltersProps`)

## Import Patterns

### Import Order (always follow this order):
1. React/WordPress imports
2. WordPress components
3. WordPress utilities (i18n, etc.)
4. Local styled components
5. Local utilities and hooks
6. Local types and constants
7. Relative imports from parent directories

### Example:
```typescript
import { memo, useState, useCallback } from '@wordpress/element';
import { Button, Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { FiltersWrapper, ActionButton } from './styled';
import { getFieldLabels } from '../utilities';
import type { ConditionGroup } from './consts';
import { EXCLUDED_FIELDS } from './consts';
```

### Path Aliases
- Use `@admin/*` for admin code (e.g., `@admin/components/NoticeSystem`)
- Use `@js/*` for shared code
- Use relative paths for sibling/child components

## TypeScript Conventions

### Type Definitions
- **Always** define types in `consts.ts` files
- Use `type` for unions and simple objects
- Use `interface` for component props that might be extended
- Export types that are used in multiple files

### Props Interface Pattern:
```typescript
interface ComponentProps {
	// Required props first
	value: string;
	onChange: (value: string) => void;
	
	// Optional props last
	className?: string;
	disabled?: boolean;
}

const Component = ({ value, onChange, className, disabled }: ComponentProps) => {
	// ...
};
```

### Type Exports:
```typescript
// Export types alongside consts
export type SubmissionItem = {
	id: number;
	// ...
};

export const EXCLUDED_FIELDS = ['id', 'form_id'];
```

## WordPress Integration

### i18n (Internationalization)
```typescript
import { __ } from '@wordpress/i18n';

// Always use translation function with text domain
__('Apply filters', 'petitioner')
__('Total:', 'petitioner')
```

### React Hooks (WordPress)
```typescript
// Always use WordPress versions of React hooks
import { useState, useCallback, useMemo, useEffect, memo } from '@wordpress/element';
```

### WordPress Components
```typescript
import { Button, Modal, Card, CardBody } from '@wordpress/components';

// Common props:
// Button: variant="primary|secondary", icon="icon-name", size="small"
// Modal: size="small|medium|large", onRequestClose
```

## Component Patterns

### Functional Components with Memo
```typescript
import { memo } from '@wordpress/element';

const Component = ({ prop1, prop2 }: ComponentProps) => {
	// Component logic
	return <div>...</div>;
};

export default memo(Component);
```

### Custom Hooks Pattern
```typescript
export const useCustomHook = (options?: { initialValue?: Type }) => {
	const [state, setState] = useState(options?.initialValue);
	
	const someAction = useCallback(() => {
		// action logic
	}, [dependencies]);
	
	return {
		state,
		setState,
		someAction,
	};
};
```

### State Management
- Use `useState` for component-level state
- Use `useCallback` for memoized callbacks passed to children
- Use `useMemo` for expensive computations
- Use `useEffect` for side effects
- Keep state as local as possible
- Only lift state up when it needs to be shared

### Self-Contained Components
- Components should manage their own internal state when possible
- Keep filters, visibility toggles, etc. inside the component
- Close UI elements automatically after actions (e.g., close filters on apply)

## AJAX Patterns

### WordPress AJAX Pattern
```typescript
const finalQuery = new URLSearchParams();
finalQuery.set('action', 'petitioner_action_name');

const finalData = new FormData();
finalData.append('param', value);
finalData.append('petitioner_nonce', getAjaxNonce());

try {
	const request = await fetch(`${ajaxurl}?${finalQuery.toString()}`, {
		method: 'POST',
		body: finalData,
	});
	
	const response = await request.json();
	
	if (response.success) {
		onSuccess(response.data);
	} else {
		onError('Error message');
	}
} catch (error) {
	onError('Error: ' + error);
}
```

## Constants Patterns

### Default Values
```typescript
export const DEFAULT_LOGIC = {
	id: 'default-group',
	logic: 'AND' as const,
	conditions: [
		{
			id: 'default-condition',
			field: 'approval_status',
			operator: 'equals',
			value: 'Confirmed',
		},
	],
};
```

### Action Names
```typescript
export const UPDATE_ACTION = 'petitioner_update_submission';
export const FETCH_ACTION = 'petitioner_fetch_submissions';
```

## Best Practices

### 1. Component Independence
- Extract reusable components into their own directories
- Each component should be self-contained with its own types, styles, and logic
- Move shared logic into custom hooks

### 2. Type Safety
- Always define prop types as interfaces or types
- Use strict TypeScript settings
- Avoid `any` - use proper types or `unknown`

### 3. Performance
- Use `memo` for components that don't need to re-render often
- Use `useCallback` for callbacks passed to child components
- Use `useMemo` for expensive calculations
- Extract primitive values from objects for dependency arrays

### 4. Error Handling
- Always handle both success and error cases in async operations
- Provide user feedback via NoticeSystem
- Use try-catch for async operations

### 5. Accessibility
- Use semantic HTML
- Provide proper ARIA labels when needed
- Use WordPress components which have built-in accessibility

## WordPress-Specific Notes

### Global Variables
- `ajaxurl` - WordPress AJAX endpoint URL (available globally)
- `window.petitionerData` - Plugin-specific data passed from PHP

### Nonce Handling
```typescript
import { getAjaxNonce } from '@admin/utilities';
// Use getAjaxNonce() for all AJAX requests
```

### Post Meta and Options
- Form settings are stored as post meta with `_petitioner_` prefix
- Plugin options use `petitioner_` prefix

## Code Review Checklist

Before submitting code, verify:
- [ ] All imports are properly ordered
- [ ] Using theme constants for spacing/colors (see rules-styles.md)
- [ ] Types are defined in consts.ts
- [ ] Strings are wrapped in `__()` for i18n
- [ ] Components are memoized when appropriate
- [ ] Custom hooks follow naming convention
- [ ] Styled components are in separate file
- [ ] Error handling is implemented
- [ ] No linter errors
- [ ] Component is self-contained

