import type { ReactNode, CSSProperties } from 'react';
import * as WPComponents from '@wordpress/components';
import { SPACINGS } from '@admin/theme';

type BaseProps = { children?: ReactNode; style?: CSSProperties;[key: string]: any };

const warnedComponents = new Set<string>();

const warnIfMissing = (componentName: string, experimentalName: string) => {
    if (!warnedComponents.has(componentName)) {
        console.warn(
            `[Petitioner] ${componentName}: ${experimentalName} not available in @wordpress/components. Using fallback.`
        );
        warnedComponents.add(componentName);
    }
};

const getComponent = (
    experimentalName: keyof typeof WPComponents,
    displayName: string
) => {
    const component = WPComponents[experimentalName];
    if (!component) {
        warnIfMissing(displayName, experimentalName);
    }
    return component;
};

export const Text = getComponent('__experimentalText', 'Text')
    ?? (({ children, ...props }: BaseProps) => <span {...props}>{children}</span>);

export const Heading = getComponent('__experimentalHeading', 'Heading')
    ?? (({ children, ...props }: BaseProps) => <h2 {...props}>{children}</h2>);

export const Divider = getComponent('__experimentalDivider', 'Divider')
    ?? (({ style, ...props }: BaseProps) => (
        <hr {...props} style={{ margin: `${SPACINGS.lg} 0`, ...style }} />
    ));