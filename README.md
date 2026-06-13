# Petitioner WordPress Plugin

**Petitioner** is a powerful WordPress plugin that allows users to create, target, and track high-impact petitions. It features a drag-and-drop builder, automated delivery to decision-makers, submission management, and CSV exports.

[Plugin homepage & demo](https://getpetitioner.com) | [Documentation](https://getpetitioner.com/docs/)

## Features
- **Unlimited petitions** with a drag-and-drop form builder.
- **Automated decision-maker delivery** with optional double opt-in.
- **Frontend submission showcases** (several styles available).
- **Spam protection** (reCAPTCHA, hCaptcha, Turnstile, Akismet).
- **Lightweight & Modern**: Built with React, TypeScript, and native WordPress components.

## Development & Contributing

To get started:
1. Clone the repository into your WordPress plugins folder.
2. Run `pnpm install` in the `petitioner-pro` directory (or root if configured) to install dependencies.
3. Run `composer install` for PHP dependencies.
4. Run `pnpm dev` to start the development server for frontend assets.

---

## 🤖 AI Assistant & Development Guidelines

> [!IMPORTANT]  
> **To all AI Coding Assistants (Copilot, Qodo, Gemini, Cursor, Windsurf, Cline, etc.) and Human Contributors:**  
> Before writing any code, modifying architecture, or making suggestions, you MUST read the configuration files located in the `.rules/` directory.

We maintain strict coding standards and architecture patterns. Please refer to the following rule files in the `.rules/` directory:

- 🐘 **PHP, Architecture, and Security**: See [`.rules/php.mdc`](.rules/php.mdc)
- ⚛️ **TypeScript, React, and Component patterns**: See [`.rules/general.mdc`](.rules/general.mdc)
- 🎨 **Styling and CSS-in-JS guidelines**: See [`.rules/styles.mdc`](.rules/styles.mdc)
- 🧪 **Testing patterns**: See [`.rules/tests.mdc`](.rules/tests.mdc)
