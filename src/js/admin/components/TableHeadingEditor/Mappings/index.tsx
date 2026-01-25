import { memo, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { MappingExample, MappingInputGroup, MappingInputs, MappingArrow, MappingWrapper, StyledButton } from './styled';
import { Text } from '@admin/components/Experimental';
import { TextControl } from '@wordpress/components';
import { Button } from '@wordpress/components';

import type { MappingsProps, ValueMapping } from './consts';

const Mappings = ({ mappings, onUpdate }: MappingsProps) => {

    const handleAddMapping = useCallback(() => {
        const newMapping: ValueMapping = {
            id: crypto.randomUUID(),
            rawValue: '',
            mappedValue: '',
        };
        onUpdate([...mappings, newMapping]);
    }, [mappings, onUpdate]);

    const handleUpdateMapping = useCallback(
        (id: string, field: 'rawValue' | 'mappedValue', value: string) => {
            const updated = mappings.map((mapping) =>
                mapping.id === id ? { ...mapping, [field]: value } : mapping
            );
            onUpdate(updated);
        },
        [mappings, onUpdate]
    );

    const handleDeleteMapping = useCallback(
        (id: string) => {
            const filtered = mappings.filter((mapping) => mapping.id !== id);
            onUpdate(filtered);
        },
        [mappings, onUpdate]
    );

    return (
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

            <MappingInputGroup>
                {mappings.map((mapping) => {
                    return (
                        <MappingInputs key={mapping.id}>
                            <TextControl
                                label={__('Raw value', 'petitioner')}
                                value={mapping.rawValue}
                                onChange={(value) =>
                                    handleUpdateMapping(mapping.id, 'rawValue', value)
                                }
                                placeholder="Original value"
                                __nextHasNoMarginBottom={true}
                            />
                            <MappingArrow />
                            <TextControl
                                label={__('Mapped value', 'petitioner')}
                                value={mapping.mappedValue}
                                onChange={(value) =>
                                    handleUpdateMapping(mapping.id, 'mappedValue', value)
                                }
                                placeholder="New value"
                                __nextHasNoMarginBottom={true}
                            />
                            <StyledButton
                                size="small"
                                icon="trash"
                                variant="tertiary"
                                onClick={() => handleDeleteMapping(mapping.id)}
                                isDestructive={true}
                                label={__('Delete mapping', 'petitioner')}
                            />
                        </MappingInputs>
                    )
                })}

            </MappingInputGroup>

            <Button
                size="small"
                icon="plus"
                variant="tertiary"
                onClick={handleAddMapping}
            >
                {__('Add mapping', 'petitioner')}
            </Button>
        </MappingWrapper>
    );
};

export default memo(Mappings);