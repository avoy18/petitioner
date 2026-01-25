import { memo, useState, useCallback } from '@wordpress/element';
import { Button, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { Heading, Text, Divider } from '@admin/components/Experimental';

import {
    EditPopoverContainer,
    PopoverActions,
    PopoverInputGroup,
} from './styled';
import Mappings from '../Mappings';
import type { ValueMapping } from '../Mappings/consts';
import type { EditPopoverProps } from './consts';
import { getHeadingLabel } from '../utilities';

const EditPopover = ({ heading, onClose, onSave }: EditPopoverProps) => {
    const headingLabel = getHeadingLabel(heading);
    const originalLabel = heading.label;
    const [label, setLabel] = useState<string>(headingLabel);
    const [mappings, setMappings] = useState<ValueMapping[] | []>(heading.overrides?.mappings || []);

    const handleSave = useCallback(() => {
        onSave({ ...heading, overrides: { ...(heading.overrides || {}), label, mappings } });
    }, [heading, label, mappings, onSave]);

    return (
        <EditPopoverContainer>
            <Heading level={4}>
                {__('Editing: ', 'petitioner')}
                <span>{headingLabel}</span>
            </Heading>

            <Text size="small">
                {__('ID: ', 'petitioner')}
                <code>{`${heading.id}`}</code>
            </Text>

            <Text size="small">
                {__('Original label: ', 'petitioner')}
                <code>{originalLabel}</code>
            </Text>


            <Divider margin="md" color="grey" />

            <PopoverInputGroup>
                <TextControl
                    id={`override-label-${heading.id}`}
                    name={`override-label-${heading.id}`}
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