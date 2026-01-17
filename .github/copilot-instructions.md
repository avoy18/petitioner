# Petitioner WordPress Plugin - AI Coding Instructions

## Project Overview
**Petitioner** is a WordPress plugin for collecting petition signatures with forms, submissions management, email confirmations, and admin dashboard. The codebase spans TypeScript/React frontend components, PHP backend, and WordPress Gutenberg blocks.

### Key Repos & Versions
- **Primary**: `/wp-content/plugins/petitioner/` (version 0.8.0)
- **Theme**: `/wp-content/themes/petitioner-theme/` (paired theme)
- **SVN Archive**: `/svn-petitioner/trunk/` and `/svn-petitioner/tags/` (for reference)

---

## Architecture Overview

### Backend Structure (PHP - `/inc/`)
- **Submissions**: `class-submissions-model.php` (database schema, fields: id, form_id, fname, lname, email, phone, country, city, postal_code, etc.), `class-submissions-controller.php` (CRUD operations, REST API)
- **Forms**: Form definitions stored as post meta; Gutenberg blocks render forms on frontend
- **Admin UI**: `/admin-ui/` provides WordPress admin pages for form editing and submissions view
- **Emails**: `class-email-controller.php`, `class-email-confirmations.php`, `class-mailer.php` handle transactional emails
- **Integrations**: CAPTCHA (`class-captcha.php`), Akismet spam checking
- **Frontend**: Shortcodes and Gutenberg blocks for rendering forms

### Frontend Structure (TypeScript/React - `/src/js/`)
- **Admin Dashboard** (`/admin/`): Form builder UI, submissions management, settings
  - Uses Context API (`FormBuilderContext`, `SettingsFormContext`) for state
  - Drag-n-drop field reordering with `DndSortableProvider`
  - Styled-components with centralized theme values
- **Frontend** (`/frontend/`): Petition form display for site visitors
- **Gutenberg Blocks** (`/blocks/`): WordPress block definitions for inserting forms into post content

### Build System
- **Admin/Frontend**: Vite builds (`vite.admin.config.ts`, `vite.frontend.config.ts`) with WordPress externals (React, WP libraries loaded globally)
- **Gutenberg**: `wp-scripts` build system
- **All outputs**: Go to `/dist/` directories for admin and frontend; `/dist-gutenberg/` for blocks

---

## Developer Workflows

### Quick Start
```bash
# Install & develop
pnpm install
pnpm dev              # Runs both admin & frontend in watch mode
pnpm dev:admin        # Admin build only
pnpm dev:frontend     # Frontend build only
pnpm dev:gutenberg    # Blocks build only
```

### Build & Deploy
```bash
pnpm build            # Full production build (clean, admin, frontend, gutenberg)
pnpm deploy           # Build + deploy script (see scripts/deploy.js)
```

### Testing
```bash
pnpm test             # Vitest run all tests
# Tests use @testing-library/react with happy-dom environment
# Test files: tests/**/*.test.{ts,tsx}
```

---

## Coding Patterns & Conventions

### TypeScript/React Components
**File Structure** (example: `Button` component):
```
src/js/admin/components/Button/
├── index.tsx          # Main component (memoized)
├── styled.tsx         # Styled-components (if any styles)
├── consts.ts          # Types, interfaces, constants
├── hooks.tsx          # Custom hooks (if any)
└── utilities.ts       # Helper functions
```

**Naming Conventions**:
- Components & Styled Components: `PascalCase` (e.g., `ConditionalLogic`, `FiltersWrapper`)
- Custom Hooks: camelCase with `use` prefix (e.g., `useConditionalLogic`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `EXCLUDED_FIELDS`, `DEFAULT_LOGIC`)
- Types: `PascalCase` (e.g., `SubmissionItem`, `FiltersProps`)

**Component Template**:
```typescript
import { memo, useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { StyledWrapper, ActionButton } from './styled';
import type { ComponentProps } from './consts';
import { DEFAULT_VALUE } from './consts';

const Component = ({ value, onChange }: ComponentProps) => {
  const [state, setState] = useState(value);
  
  const handleChange = useCallback((val: string) => {
    onChange(val);
  }, [onChange]);

  return <StyledWrapper>{/* component content */}</StyledWrapper>;
};

export default memo(Component);
```

**Import Order** (strict):
1. React/WordPress imports (`@wordpress/element`)
2. WordPress components (`@wordpress/components`)
3. WordPress utilities (`@wordpress/i18n`, `@wordpress/hooks`)
4. Local styled components
5. Local utilities and hooks
6. Local types and constants
7. Relative imports from parent directories

**Path Aliases**:
- `@admin/*` → `src/js/admin/`
- `@js/*` → `src/js/`
- Use relative paths for sibling/child components

### Styling with styled-components
**Theme Constants** (centralized in `/src/js/admin/theme.ts`):
```typescript
import { COLORS, SPACINGS, FONT_SIZES, TRANSITIONS } from '@admin/theme';

// COLORS: primary, dark, grey, light, darkGrey (CSS vars)
// SPACINGS: xs (4px), sm (8px), md (12px), lg (16px), xl (24px), 2xl, 3xl, 4xl, 5xl
// FONT_SIZES: sm, md
// TRANSITIONS: sm (0.15s), md (0.3s)
```

**Never hardcode colors or spacing** — always use theme constants.

### Context Usage
Two main contexts for state management:
- **`FormBuilderContext`**: Form field definitions, draggable field types, builder state
- **`SettingsFormContext`**: Admin settings form data
- **`DndSortableProvider`**: Drag-n-drop state for field/option reordering

Context pattern:
```typescript
export const MyContext = createContext<ContextValue | null>(null);

export const MyContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ContextValue>(initialValue);
  // ...
  return <MyContext.Provider value={state}>{children}</MyContext.Provider>;
};

// Usage: useContext(MyContext) with null check
```

### PHP Backend Patterns
**Class Naming**: `AV_Petitioner_[Feature]_[Class]` (e.g., `AV_Petitioner_Submissions_Model`, `AV_Petitioner_Email_Controller`)

**Security**:
- Always check `ABSPATH` at file top: `if (!defined('ABSPATH')) { exit; }`
- Use `$wpdb` prepared statements for queries
- Sanitize user input with `sanitize_*()` functions
- Use nonces for form submissions

**Model Pattern** (Submissions):
- Static methods for database operations (query, insert, update, delete)
- Field definitions in static arrays (`ALLOWED_FIELDS`, `SENSITIVE_FIELDS`, `INTERNAL_FIELDS`)
- Database table: `wp_{prefix}_av_petitioner_submissions`

**Data Flow**:
1. Frontend form submission → Admin AJAX endpoint
2. Controller validates & processes → Model persists to DB
3. Email Controller triggers transactional emails
4. Admin Dashboard queries & displays submissions

---

## Key Integration Points

### WordPress Hooks & Filters
- Used in `FormBuilderContext` for extending field types via `applyFilters()`
- Check existing hook points before adding new ones

### REST API & AJAX
- Endpoints registered in Controllers (e.g., `AV_Petitioner_Submissions_Controller`)
- Frontend fetches data via `wp-api-fetch` (WordPress standard)

### Email System
- Template-based emails (`class-email-template.php`)
- Confirmation tokens for subscription/verification
- Uses WordPress's `wp_mail()` with HTML headers

### Gutenberg Blocks
- Built with `@wordpress/scripts` and `@wordpress/block-editor`
- Server-side rendering for form display
- Output path: `/dist-gutenberg/`

---

## Testing Approach

### Unit Tests (Vitest + Testing Library)
- **Setup**: `tests/setup.ts` configures environment
- **Location**: `tests/` directory mirrors `src/` structure
- **File naming**: `ComponentName.test.tsx`

**Test Template**:
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Component from '@admin/components/Component';

describe('Component', () => {
  it('renders with correct text', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Component onClick={handleClick} />);
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### PHP Tests (PHPUnit)
- Configuration: `phpunit.xml`
- Test location: `tests/` directory
- Focus: Model queries, controller logic, email generation

---

## Common Pitfalls & Solutions

| Pitfall | Solution |
|---------|----------|
| Hardcoded colors/spacing | Import from `@admin/theme` |
| Missing i18n strings | Wrap with `__('text', 'petitioner')` |
| Direct state mutation in context | Use `useCallback` for setter functions |
| Props drilling deep | Consider Context API or extract sub-component |
| Type `any` | Define proper interface/type in `consts.ts` |
| Missing null check on context | `const ctx = useContext(MyContext); if (!ctx) throw new Error(...)` |
| CSS class name collisions | Use styled-components, not global CSS |
| Unescaped HTML in PHP | Use `wp_kses_post()`, `esc_attr()`, `esc_html()` |

---

## Essential Files to Know
- **Plugin entry**: [petitioner.php](petitioner.php) (registers classes, hooks)
- **Admin theme**: [src/js/admin/theme.ts](src/js/admin/theme.ts) (color, spacing constants)
- **Form builder**: [src/js/admin/context/FormBuilderContext.tsx](src/js/admin/context/FormBuilderContext.tsx) (form state, field types)
- **Submissions model**: [inc/submissions/class-submissions-model.php](inc/submissions/class-submissions-model.php) (DB schema, field definitions)
- **Styling rules**: [.cursor/rules/styles.mdc](.cursor/rules/styles.mdc) (comprehensive styling guide)
- **Testing rules**: [.cursor/rules/tests.mdc](.cursor/rules/tests.mdc) (testing patterns)

---

## Quick Reference Commands
```bash
pnpm install          # Install dependencies
pnpm dev              # Start all dev servers (watch mode)
pnpm build            # Production build
pnpm test             # Run tests
pnpm clean            # Remove dist directories
npm run prepare       # Install git hooks (husky)
```

---

## Questions to Ask When Uncertain
1. Is this a **new field type**? Check `FormBuilderContext.DRAGGABLE_FIELD_TYPES` for pattern
2. Is this **user input**? Sanitize in PHP, validate in TS, and use nonces
3. Is this **styling**? Use `@admin/theme`, never hardcode
4. Is this **a new endpoint**? Implement in Controller class with proper WordPress REST API setup
5. Is this **a new form action**? Add to form submission flow in email & admin dashboard

---

**Last Updated**: January 17, 2026 | **Plugin Version**: 0.8.0
