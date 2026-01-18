import type { ReactNode, CSSProperties } from 'react';
import * as WPComponents from '@wordpress/components';
import { SPACINGS } from '@admin/theme';

type BaseProps = { children?: ReactNode; style?: CSSProperties;[key: string]: any };

export const Text = (WPComponents as any).__experimentalText
    ?? (({ children, ...props }: BaseProps) => <span {...props}>{children}</span>);

export const Heading = (WPComponents as any).__experimentalHeading
    ?? (({ children, ...props }: BaseProps) => <h2 {...props}>{children}</h2>);

export const Divider = (WPComponents as any).__experimentalDivider
    ?? (({ style, ...props }: BaseProps) => (
        <hr {...props} style={{ margin: `${SPACINGS.lg} 0`, ...style }} />
    ));