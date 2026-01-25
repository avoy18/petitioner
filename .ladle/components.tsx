import React from 'react';
import type { GlobalProvider } from '@ladle/react';

// Re-export React as wp.element
if (typeof window !== 'undefined') {
    (window as any).React = React;
    (window as any).ReactDOM = require('react-dom');
}

export const Provider: GlobalProvider = ({ children }) => <>{children}</>;