# Cursor Rules for Petitioner Plugin

This directory contains coding rules and guidelines for the Petitioner WordPress plugin using Cursor's MDC format.

## Structure

```
.cursor/
├── README.md
└── rules/
    ├── general.mdc    # Component patterns, TypeScript, WordPress
    ├── styles.mdc     # Styling guidelines and theme constants
    └── tests.mdc      # Testing patterns and best practices
```

## MDC Format

Each `.mdc` file has metadata and content:

```mdc
---
description: What this rule covers
globs:
  - "path/pattern/**/*.tsx"
alwaysApply: true|false
---

# Rule content in Markdown
```

### Rule Types

- **`alwaysApply: true`** - Applied to every chat and cmd-k session
- **`alwaysApply: false`** - Applied intelligently when relevant
- **Globs** - Automatically applies when matching files are referenced

## Current Rules

### `general.mdc`
- Component structure and organization
- Naming conventions
- Import order and patterns
- TypeScript conventions
- WordPress integration (i18n, hooks, AJAX)
- Component patterns (memo, hooks, state)

**Applies to:** All `.ts` and `.tsx` files in `src/js/` and `tests/`

### `styles.mdc`
- Theme constants (COLORS, SPACINGS, TRANSITIONS)
- Styled component patterns
- className forwarding
- WordPress component style resets
- Accessibility guidelines

**Applies to:** All styled components and TSX files

### `tests.mdc`
- Vitest and Testing Library patterns
- Component and hook testing
- WordPress-specific mocking
- Query priorities and best practices

**Applies to:** Test files only

## Reference

See [Cursor Rules Documentation](https://cursor.com/docs/context/rules) for more information.
