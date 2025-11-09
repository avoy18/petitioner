# Cursor Rules for Petitioner Plugin

This directory contains coding rules and guidelines for the Petitioner WordPress plugin.

## Files

- **`rules-general.md`** - Core development patterns, component structure, TypeScript conventions, and WordPress integration
- **`rules-styles.md`** - Styling guidelines, theme constants, styled-components patterns, and accessibility rules
- **`rules-tests.md`** - Testing patterns, best practices, and examples using Vitest and Testing Library

## How to Use

These rules are automatically applied by Cursor when working in this repository. They help maintain consistency and follow best practices specific to this project.

## Quick Reference

### Common Patterns

**Component Structure:**
```
ComponentName/
├── index.tsx       # Main component
├── styled.tsx      # Styled components
├── consts.ts       # Types and constants
├── hooks.tsx       # Custom hooks
└── utilities.ts    # Helper functions
```

**Import Order:**
1. React/WordPress imports
2. WordPress components
3. WordPress utilities
4. Local styled components
5. Local utilities and hooks
6. Local types and constants

**Styling:**
- Always use theme constants: `COLORS`, `SPACINGS`, `FONT_SIZES`, `TRANSITIONS`
- Never hardcode values
- Keep styled components in separate files

For detailed information, see the individual rule files.

