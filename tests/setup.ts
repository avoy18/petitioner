import '@testing-library/jest-dom';

globalThis.window ??= {} as typeof window;

window.ajaxurl = '';
