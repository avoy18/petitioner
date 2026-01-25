import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { TextControl, Button } from '@wordpress/components';
import { Heading } from '@admin/components/Experimental';
import type { TableHeading } from '../consts';
import { EditPopoverContainer, PopoverActions, PopoverInputGroup } from './styled';

export default function EditPopover({
    heading,
    onClose,
    onSave
}: {
    heading: TableHeading,
    onClose: () => void,
    onSave: (updatedHeading: TableHeading) => void
}) {
    const [label, setLabel] = useState<string>(heading.label as string);

    const handleSave = () => {
        onSave({ ...heading, label });
    };

    return (
        <EditPopoverContainer>
            <Heading level={4}>
                {__('Editing: ', 'petitioner')} <span>{heading.label}</span>
            </Heading>
            {label}
            <PopoverInputGroup>
                <TextControl
                    label={__('Label', 'petitioner')}
                    value={label}
                    onChange={setLabel}
                />
            </PopoverInputGroup>

            <PopoverActions>
                <Button aria-label="Save" size="small" icon="saved" onClick={handleSave} variant="primary">{__('Save', 'petitioner')}</Button>
                <Button aria-label="Close" size="small" icon="no-alt" onClick={onClose} variant="tertiary">{__('Cancel', 'petitioner')}</Button>
            </PopoverActions>
        </EditPopoverContainer>
    );
}