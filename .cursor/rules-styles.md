# Petitioner - Styling Rules

## Styled Components Philosophy

### Always use centralized theme values
```typescript
import { COLORS, SPACINGS, FONT_SIZES, TRANSITIONS } from '@admin/theme';
```

**Never use magic numbers or hardcoded colors** - always reference theme constants.

## Available Theme Values

### Colors (CSS Variables)
```typescript
COLORS.primary     // --ptr-admin-color-primary
COLORS.dark        // --ptr-admin-color-dark
COLORS.grey        // --ptr-admin-color-grey
COLORS.light       // --ptr-admin-color-light
COLORS.darkGrey    // --ptr-admin-color-dark-grey
```

### Spacings (CSS Variables with Fallbacks)
```typescript
SPACINGS.xs        // 4px
SPACINGS.sm        // 8px
SPACINGS.md        // 12px
SPACINGS.lg        // 16px
SPACINGS.xl        // 24px
SPACINGS['2xl']    // 32px
SPACINGS['3xl']    // 40px
SPACINGS['4xl']    // 48px
SPACINGS['5xl']    // 64px
```

### Font Sizes
```typescript
FONT_SIZES.sm      // Small font size
FONT_SIZES.md      // Medium font size
```

### Transitions
```typescript
TRANSITIONS.sm     // 0.15s - Quick transitions
TRANSITIONS.md     // 0.3s - Standard transitions
```

## Styled Component Patterns

### Basic Wrapper
```typescript
export const ComponentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${SPACINGS.md};
`;
```

### Extending WordPress Components
```typescript
export const StyledButton = styled(Button)`
	padding: ${SPACINGS.sm} ${SPACINGS.md};
	background: ${COLORS.primary};
	transition: all ${TRANSITIONS.sm};
`;
```

### Complex Layout Components
```typescript
export const FiltersWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	gap: ${SPACINGS.md};
	width: 100%;
`;
```

### Components with Nested Styling
```typescript
export const GroupHeader = styled.div`
	display: flex;
	align-items: center;
	gap: ${SPACINGS.sm};
	margin-bottom: ${SPACINGS.md};

	span {
		font-weight: 500;
		color: rgba(0, 0, 0, 0.7);
	}

	.components-base-control {
		margin-bottom: 0;
		width: auto;
		min-width: 100px;
	}
`;
```

## Forwarding className for Styled Components

When creating components that will be wrapped with `styled()`, always accept and forward the `className` prop:

```typescript
interface Props {
	className?: string;
	// ... other props
}

export default function Component({ className, ...props }: Props) {
	return <div className={className}>...</div>;
}
```

**Example Usage:**
```typescript
// NoticeSystem component accepts className
export default function NoticeSystem({ className, noticeStatus, noticeText }: Props) {
	return (
		<AlertStatusWrapper className={className}>
			<Notice status={noticeStatus}>{noticeText}</Notice>
		</AlertStatusWrapper>
	);
}

// Can then be styled externally
export const NoticeSystemWrapper = styled(NoticeSystem)`
	position: absolute;
	--notice-system-z-index: 9999;
	--notice-system-top: ${SPACINGS.md};
`;
```

## Resetting WordPress Component Styles

WordPress components often come with default margins that need to be reset:

```typescript
export const StyledWrapper = styled.div`
	.components-base-control {
		margin-bottom: 0;
	}

	.components-base-control__field {
		margin-bottom: 0;
	}
`;
```

## Common Patterns

### Card/Panel Components
```typescript
export const CardWrapper = styled.div`
	width: 100%;
	border: 1px solid ${COLORS.grey};
	border-radius: 4px;
	padding: ${SPACINGS.md};
	background: ${COLORS.light};
`;
```

### Button Sections
```typescript
export const ActionButtons = styled.div`
	display: flex;
	gap: ${SPACINGS.sm};
	margin-top: ${SPACINGS.sm};
	
	button {
		flex-grow: 0; // Prevent buttons from stretching
	}
`;
```

### Separated Sections
```typescript
export const ApplyButtonWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	padding-top: ${SPACINGS.md};
	margin-top: ${SPACINGS.md};
	border-top: 1px solid ${COLORS.grey};
	
	button {
		min-width: 120px;
	}
`;
```

### Responsive Layouts
```typescript
export const SummaryWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${SPACINGS.sm};
	margin-bottom: ${SPACINGS.md};
`;
```

## Styling Rules

### ✅ DO
- Use theme constants for all spacing, colors, and timing values
- Keep styled components in separate `styled.tsx` files
- Name styled components descriptively (e.g., `FiltersWrapper`, not `Container`)
- Use semantic HTML elements (div, button, section, etc.)
- Reset WordPress component margins when needed
- Use CSS variables for dynamic theming
- Add transitions for interactive elements

### ❌ DON'T
- Use inline styles (e.g., `style={{ marginTop: '16px' }}`)
- Hardcode spacing values (e.g., `margin: 16px`)
- Hardcode colors (e.g., `color: #333`)
- Use generic names (e.g., `Wrapper`, `Container`, `Box`)
- Style components directly in JSX
- Mix styled-components with CSS modules

## Custom CSS Variables Pattern

For components that need to be customizable from parent contexts:

```typescript
export const CustomizableWrapper = styled.div`
	--component-z-index: 1000;
	--component-top: ${SPACINGS['4xl']};
	
	position: fixed;
	top: var(--component-top);
	z-index: var(--component-z-index);
`;

// Parent can override
export const ParentWrapper = styled(CustomizableWrapper)`
	--component-z-index: 9999;
	--component-top: ${SPACINGS.md};
`;
```

## File Organization

### styled.tsx Structure
```typescript
import styled from 'styled-components';
import { SPACINGS, COLORS } from '@admin/theme';
import { Button } from '@wordpress/components'; // If extending

// Main wrapper first
export const ComponentWrapper = styled.div`
	// styles
`;

// Sub-components in logical order
export const ComponentHeader = styled.div`
	// styles
`;

export const ComponentBody = styled.div`
	// styles
`;

// Styled WordPress components
export const StyledButton = styled(Button)`
	// styles
`;
```

## Performance Considerations

- Prefer CSS for animations over JavaScript when possible
- Use `will-change` sparingly for performance-critical animations
- Avoid excessive nesting (keep to 3 levels or less)
- Use CSS custom properties for values that change frequently

## Accessibility

- Ensure color contrast meets WCAG AA standards (4.5:1 for normal text)
- Don't rely on color alone to convey information
- Make sure focus states are visible and clear
- Use appropriate cursor styles (pointer, not-allowed, etc.)

