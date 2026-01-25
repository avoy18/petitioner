import { memo, useState, useCallback } from '@wordpress/element';
import { Button, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { Heading, Text } from '@admin/components/Experimental';

import {
    EditPopoverContainer,
    PopoverActions,
    PopoverInputGroup,
    MappingWrapper,
    MappingExample,
} from './styled';
import type { EditPopoverProps } from './consts';

const EditPopover = ({ heading, onClose, onSave }: EditPopoverProps) => {
    const [label, setLabel] = useState<string>(heading.label);

    const handleSave = useCallback(() => {
        onSave({ ...heading, label });
    }, [heading, label, onSave]);

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

            <MappingWrapper>
                <div>
                    <Text size="sm" weight="medium">
                        {__('Value Mappings', 'petitioner')}
                    </Text>
                    <MappingExample>
                        <Text size="sm" color="grey">
                            {__('Replace raw values with readable text. For example, convert "0" -> "No" or "1" -> "Yes".', 'petitioner')}
                        </Text>
                    </MappingExample>
                </div>
                <Button
                    size="small"
                    icon="plus"
                    variant="tertiary"
                    onClick={() => { }}
                >
                    {__('Add mapping', 'petitioner')}
                </Button>
            </MappingWrapper>

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