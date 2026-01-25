import { memo, useState, useCallback } from '@wordpress/element';
import { Button, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { Heading } from '@admin/components/Experimental';

import {
    EditPopoverContainer,
    PopoverActions,
    PopoverInputGroup,
} from './styled';
import Mappings from '../Mappings';
import type { ValueMapping } from '../Mappings/consts';
import type { EditPopoverProps } from './consts';


const EditPopover = ({ heading, onClose, onSave }: EditPopoverProps) => {
    const [label, setLabel] = useState<string>(heading.label);
    const [mappings, setMappings] = useState<ValueMapping[] | []>([]);

    const handleSave = useCallback(() => {
        onSave({ ...heading, label, mappings });
    }, [heading, label, mappings, onSave]);

    return (
        <EditPopoverContainer>
            <Heading level={4}>
                {__('Editing: ', 'petitioner')} <span>{heading.label}</span>
            </Heading>

            <PopoverInputGroup>
                <TextControl
                    label={__('Override label', 'petitioner')}
                    value={label}
                    onChange={setLabel}
                />
            </PopoverInputGroup>

            <Mappings mappings={mappings} onUpdate={setMappings} />

            <PopoverActions>
                <Button
                    size="small"
                    icon="saved"
                    variant="primary"
                    onClick={handleSave}
                >
                    {__('Save', 'petitioner')}
                </Button>
                <Button
                    size="small"
                    icon="no-alt"
                    variant="tertiary"
                    onClick={onClose}
                >
                    {__('Cancel', 'petitioner')}
                </Button>
            </PopoverActions>
        </EditPopoverContainer>
    );
};

export default memo(EditPopover);