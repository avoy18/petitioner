import { ReactNode } from 'react';

export type CheckboxInputProps = {
    checked: boolean | undefined;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string | ReactNode;
    help?: string | ReactNode;
};
