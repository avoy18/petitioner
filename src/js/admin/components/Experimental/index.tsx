import type { ReactNode, CSSProperties } from 'react';
import * as WPComponents from '@wordpress/components';
import { SPACINGS } from '@admin/theme';

type BaseProps = {
    children?: ReactNode;
    style?: CSSProperties;
    [key: string]: any;
};

const warnedComponents = new Set<string>();

const warnIfMissing = (componentName: string, experimentalName: string) => {
    if (!warnedComponents.has(componentName)) {
        console.warn(
            `[Petitioner] ${componentName}: ${experimentalName} not available in @wordpress/components. Using fallback.`
        );
        warnedComponents.add(componentName);
    }
};

const getComponent = <T extends keyof typeof WPComponents>(
    experimentalName: T,
    displayName: string
): typeof WPComponents[T] | ((props: BaseProps) => JSX.Element) => {
    const component = WPComponents[experimentalName];
    if (!component) {
        warnIfMissing(displayName, experimentalName);
    }
    return component as typeof WPComponents[T];
};

export const Text = (getComponent('__experimentalText', 'Text')
    ?? (({ children, ...props }: BaseProps) => <span {...props}>{children}</span>)) as typeof WPComponents.__experimentalText;

export const Heading = (getComponent('__experimentalHeading', 'Heading')
    ?? (({ children, ...props }: BaseProps) => <h2 {...props}>{children}</h2>)) as typeof WPComponents.__experimentalHeading;

export const Divider = (getComponent('__experimentalDivider', 'Divider')
    ?? (({ style, ...props }: BaseProps) => (
        <hr {...props} style={{ margin: `${SPACINGS.lg} 0`, ...style }} />
    ))) as typeof WPComponents.__experimentalDivider;